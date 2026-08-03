import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  createBookCheckoutRequest,
  getBookAssetUrl,
  getBookRequest,
  getPaymentConfigurationRequest,
} from '../../services/bookApi';
import Navbar from '../../components/navbar/Navbar';
import './BookCheckout.css';

const FALLBACK_PRODUCTS = [
  {
    id: 'digital',
    label: 'ספר דיגיטלי',
    amountAgorot: 4_900,
    includesPhysicalBook: false,
  },
  {
    id: 'digital_physical',
    label: 'ספר דיגיטלי + ספר פיזי',
    amountAgorot: 12_900,
    includesPhysicalBook: true,
  },
];

const EMPTY_ADDRESS = {
  fullName: '',
  phone: '',
  city: '',
  street: '',
  postalCode: '',
  notes: '',
};

const formatPrice = (amountAgorot) => new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  maximumFractionDigits: 0,
}).format(amountAgorot / 100);

function BookCheckout() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingPayment, setStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [productType, setProductType] = useState('digital');
  const [shippingAddress, setShippingAddress] = useState(EMPTY_ADDRESS);

  useEffect(() => {
    async function loadBook() {
      try {
        const [bookResponse, configResponse] = await Promise.all([
          getBookRequest(id),
          getPaymentConfigurationRequest(),
        ]);
        setBook(bookResponse.data);
        setPaymentConfig(configResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id]);

  const products = paymentConfig?.products?.length
    ? paymentConfig.products
    : FALLBACK_PRODUCTS;
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productType) || products[0],
    [productType, products],
  );
  const requiresShipping = Boolean(selectedProduct?.includesPhysicalBook);

  function updateShippingField(event) {
    const { name, value } = event.target;
    setShippingAddress((current) => ({ ...current, [name]: value }));
  }

  async function continueToPayment(event) {
    event.preventDefault();
    setStartingPayment(true);
    setPaymentError('');

    try {
      const response = await createBookCheckoutRequest(id, {
        productType: selectedProduct.id,
        ...(requiresShipping ? { shippingAddress } : {}),
      });

      if (response.data.alreadyPurchased) {
        window.location.assign(`/book/${id}`);
        return;
      }

      window.location.assign(response.data.checkoutUrl);
    } catch (error) {
      setPaymentError(error.message || 'לא הצלחנו לפתוח את דף התשלום.');
      setStartingPayment(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar variant="checkout" />
        <main className="checkout-page checkout-state">טוענים את פרטי ההזמנה...</main>
      </>
    );
  }

  if (!book) {
    return (
      <>
        <Navbar variant="checkout" />
        <main className="checkout-page checkout-state">
          <p>לא הצלחנו למצוא את הספר.</p>
          <Link to="/">חזרה לדף הבית</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar variant="checkout" />
      <main className="checkout-page">
        <div className="checkout-glow checkout-glow-one" />
        <div className="checkout-glow checkout-glow-two" />

        <form className="checkout-shell" onSubmit={continueToPayment}>
          <aside className="checkout-story-preview">
            <span className="checkout-preview-label">הספר האישי שלכם</span>
            <div className="checkout-cover-frame">
              {book.cover?.imageUrl ? (
                <img
                  className="checkout-cover"
                  src={getBookAssetUrl(book.cover.imageUrl)}
                  alt={book.title}
                />
              ) : (
                <div className="checkout-cover-fallback">📖</div>
              )}
            </div>
            <h2>{book.title}</h2>
            <p>נוצר במיוחד עבור {book.child?.name || 'הילד או הילדה שלכם'}.</p>
            <div className="checkout-trust-list">
              <span>✓ גישה מיידית לגרסה הדיגיטלית</span>
              <span>✓ כל האיורים והעמודים המלאים</span>
              <span>✓ נשמר בספרייה האישית שלכם</span>
            </div>
          </aside>

          <section className="checkout-details">
            <span className="checkout-eyebrow">עוד רגע והסיפור המלא נפתח</span>
            <h1>איך תרצו לקבל את הספר?</h1>
            <p className="checkout-intro">
              בחרו בין קריאה דיגיטלית לבין החבילה המלאה, שכוללת גם ספר פיזי שיישלח אליכם.
            </p>

            <div className="checkout-products" role="radiogroup" aria-label="בחירת חבילת ספר">
              {products.map((product) => {
                const selected = product.id === selectedProduct.id;
                return (
                  <label
                    className={`checkout-product ${selected ? 'is-selected' : ''}`}
                    key={product.id}
                  >
                    <input
                      type="radio"
                      name="productType"
                      value={product.id}
                      checked={selected}
                      onChange={() => {
                        setProductType(product.id);
                        setPaymentError('');
                      }}
                    />
                    <span className="checkout-product__icon" aria-hidden="true">
                      {product.includesPhysicalBook ? '📚' : '📱'}
                    </span>
                    <span className="checkout-product__copy">
                      <strong>{product.label}</strong>
                      <small>
                        {product.includesPhysicalBook
                          ? 'גישה דיגיטלית מלאה וגם ספר מודפס עד הבית.'
                          : 'קריאה מלאה מכל מכשיר, בכל זמן.'}
                      </small>
                    </span>
                    <b>{formatPrice(product.amountAgorot)}</b>
                    {product.includesPhysicalBook ? (
                      <span className="checkout-product__badge">החוויה המלאה</span>
                    ) : null}
                  </label>
                );
              })}
            </div>

            {requiresShipping ? (
              <fieldset className="checkout-shipping">
                <legend>
                  <span>📦</span>
                  פרטי משלוח לספר הפיזי
                </legend>
                <div className="checkout-shipping__grid">
                  <label>
                    שם מלא
                    <input
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={updateShippingField}
                      autoComplete="name"
                      required
                    />
                  </label>
                  <label>
                    טלפון
                    <input
                      name="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={updateShippingField}
                      autoComplete="tel"
                      required
                    />
                  </label>
                  <label>
                    עיר
                    <input
                      name="city"
                      value={shippingAddress.city}
                      onChange={updateShippingField}
                      autoComplete="address-level2"
                      required
                    />
                  </label>
                  <label>
                    רחוב, מספר בית ודירה
                    <input
                      name="street"
                      value={shippingAddress.street}
                      onChange={updateShippingField}
                      autoComplete="street-address"
                      required
                    />
                  </label>
                  <label>
                    מיקוד
                    <input
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={updateShippingField}
                      autoComplete="postal-code"
                    />
                  </label>
                  <label>
                    הערות לשליח
                    <input
                      name="notes"
                      value={shippingAddress.notes}
                      onChange={updateShippingField}
                      placeholder="קומה, קוד כניסה וכדומה"
                    />
                  </label>
                </div>
              </fieldset>
            ) : null}

            <div className="checkout-total">
              <span>סה״כ לתשלום</span>
              <strong>{formatPrice(selectedProduct.amountAgorot)}</strong>
            </div>

            <button
              type="submit"
              className="checkout-button"
              disabled={startingPayment || !paymentConfig?.configured}
            >
              <span>{startingPayment ? 'מעבירים לתשלום מאובטח...' : 'המשך לתשלום מאובטח'}</span>
              <span aria-hidden="true">←</span>
            </button>

            {!paymentConfig?.configured ? (
              <p className="checkout-error" role="alert">הסליקה עדיין אינה זמינה.</p>
            ) : null}
            {paymentError ? <p className="checkout-error" role="alert">{paymentError}</p> : null}

            <p className="checkout-note">🔒 פרטי התשלום מוגנים ומעובדים דרך ספק סליקה מאובטח.</p>
            <Link className="checkout-back" to={`/book/${id}`}>חזרה לתצוגה המקדימה</Link>
          </section>
        </form>
      </main>
    </>
  );
}

export default BookCheckout;
