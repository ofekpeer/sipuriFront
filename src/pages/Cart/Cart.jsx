import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../../context/CartContext';
import { createCartCheckoutRequest } from '../../services/cartApi';
import { getBookAssetUrl } from '../../services/bookApi';
import './Cart.css';

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
}).format((amountAgorot || 0) / 100);

function Cart() {
  const {
    items,
    products,
    summary,
    loading,
    error,
    updatingBookId,
    removeBook,
    emptyCart,
    refreshCart,
    updateBookProduct,
  } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [shippingAddress, setShippingAddress] = useState(EMPTY_ADDRESS);
  const [pendingProducts, setPendingProducts] = useState({});

  const productsById = useMemo(
    () => new Map((products || []).map((product) => [product.id, product])),
    [products],
  );
  const displayedItems = useMemo(() => items.map((item) => {
    const productType = pendingProducts[String(item.bookId)] || item.productType;
    const product = productsById.get(productType);
    return {
      ...item,
      productType,
      productLabel: product?.label || item.productLabel,
      includesPhysicalBook: product?.includesPhysicalBook ?? item.includesPhysicalBook,
      unitPriceAgorot: product?.amountAgorot ?? item.unitPriceAgorot,
    };
  }), [items, pendingProducts, productsById]);
  const displayedSubtotal = displayedItems.reduce(
    (total, item) => total + (item.unitPriceAgorot || 0),
    0,
  );
  const displayedHasPhysicalItems = displayedItems.some(
    (item) => item.includesPhysicalBook,
  );

  function updateShippingField(event) {
    const { name, value } = event.target;
    setShippingAddress((current) => ({ ...current, [name]: value }));
  }

  async function selectProduct(bookId, productType, currentProductType) {
    const key = String(bookId);
    if (productType === currentProductType || updatingBookId) return;

    setPendingProducts((current) => ({ ...current, [key]: productType }));
    try {
      await updateBookProduct(bookId, productType);
    } finally {
      setPendingProducts((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  }

  async function checkout(event) {
    event.preventDefault();
    setCheckoutLoading(true);
    setCheckoutError('');

    try {
      const response = await createCartCheckoutRequest(
        summary.hasPhysicalItems ? { shippingAddress } : {},
      );
      window.location.assign(response.data.checkoutUrl);
    } catch (requestError) {
      setCheckoutError(requestError.message || 'לא הצלחנו להמשיך לתשלום.');
      setCheckoutLoading(false);
    }
  }

  return (
    <main className="cart-page" dir="rtl">
      <div className="cart-page__glow cart-page__glow--one" />
      <div className="cart-page__glow cart-page__glow--two" />

      <header className="cart-hero">
        <span className="cart-hero__eyebrow">העגלה שלי</span>
        <h1>הסיפורים שבחרתם, במקום אחד</h1>
        <p>בחרו לכל ספר גרסה דיגיטלית או חבילה מלאה שכוללת גם ספר פיזי.</p>
      </header>

      {loading && !items.length ? (
        <section className="cart-state" aria-live="polite">
          <span className="cart-loader" />
          <h2>טוענים את העגלה...</h2>
        </section>
      ) : error && !items.length ? (
        <section className="cart-state">
          <div className="cart-state__icon">!</div>
          <h2>לא הצלחנו לטעון את העגלה</h2>
          <p>{error}</p>
          <button
            className="cart-primary-link"
            type="button"
            onClick={() => refreshCart().catch(() => {})}
          >
            נסו שוב
          </button>
        </section>
      ) : items.length === 0 ? (
        <section className="cart-state">
          <div className="cart-state__icon">🛒</div>
          <h2>העגלה עדיין ריקה</h2>
          <p>צרו ספר אישי, צפו בתצוגה המקדימה והוסיפו אותו לכאן.</p>
          <Link className="cart-primary-link" to="/create-book">ליצירת ספר אישי</Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items" aria-label="פריטים בעגלה">
            <div className="cart-items__header">
              <h2>{summary.itemCount} {summary.itemCount === 1 ? 'ספר בעגלה' : 'ספרים בעגלה'}</h2>
              <button
                type="button"
                onClick={() => emptyCart().catch(() => {})}
                disabled={loading}
              >
                ריקון העגלה
              </button>
            </div>

            {displayedItems.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item__cover">
                  {item.imageUrl ? (
                    <img
                      src={getBookAssetUrl(item.imageUrl)}
                      alt={`כריכת ${item.title}`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span>📖</span>
                  )}
                </div>

                <div className="cart-item__details">
                  <span>ספר אישי עבור {item.childName || 'הילד או הילדה שלכם'}</span>
                  <h3>{item.title}</h3>

                  <div
                    className={`cart-product-picker${updatingBookId === String(item.bookId) ? ' is-updating' : ''}`}
                    role="radiogroup"
                    aria-label={`חבילה עבור ${item.title}`}
                    aria-busy={updatingBookId === String(item.bookId)}
                  >
                    {(products || []).map((product) => (
                      <label
                        className={item.productType === product.id ? 'is-selected' : ''}
                        key={product.id}
                      >
                        <input
                          type="radio"
                          name={`product-${item.bookId}`}
                          value={product.id}
                          checked={item.productType === product.id}
                          onChange={() => selectProduct(
                            item.bookId,
                            product.id,
                            item.productType,
                          ).catch(() => {})}
                          disabled={Boolean(updatingBookId)}
                        />
                        <span>
                          {product.includesPhysicalBook ? '📚' : '📱'} {product.shortLabel || product.label}
                        </span>
                        <b>{formatPrice(product.amountAgorot)}</b>
                      </label>
                    ))}
                  </div>

                  <div className="cart-item__links">
                    <Link to={`/book/${item.bookId}`}>תצוגה מקדימה</Link>
                    <Link to={`/library/book/${item.bookId}/edit`}>עריכת הספר</Link>
                  </div>
                </div>

                <div className="cart-item__actions">
                  <span>{item.productLabel}</span>
                  <strong>{formatPrice(item.unitPriceAgorot)}</strong>
                  <button
                    type="button"
                    onClick={() => removeBook(item.bookId).catch(() => {})}
                    disabled={updatingBookId === String(item.bookId)}
                  >
                    {updatingBookId === String(item.bookId) ? 'מעדכן...' : 'הסרה'}
                  </button>
                </div>
              </article>
            ))}
          </section>

          <form className="cart-summary" onSubmit={checkout}>
            <span className="cart-summary__badge">🔒 רכישה מאובטחת</span>
            <h2>סיכום הזמנה</h2>
            <div className="cart-summary__row">
              <span>ספרים ({summary.itemCount})</span>
              <strong>{formatPrice(displayedSubtotal)}</strong>
            </div>

            {displayedHasPhysicalItems ? (
              <fieldset className="cart-shipping">
                <legend>📦 כתובת למשלוח</legend>
                <label>
                  שם מלא
                  <input name="fullName" value={shippingAddress.fullName} onChange={updateShippingField} required />
                </label>
                <label>
                  טלפון
                  <input name="phone" type="tel" value={shippingAddress.phone} onChange={updateShippingField} required />
                </label>
                <label>
                  עיר
                  <input name="city" value={shippingAddress.city} onChange={updateShippingField} required />
                </label>
                <label>
                  רחוב, מספר בית ודירה
                  <input name="street" value={shippingAddress.street} onChange={updateShippingField} required />
                </label>
                <label>
                  מיקוד
                  <input name="postalCode" value={shippingAddress.postalCode} onChange={updateShippingField} />
                </label>
                <label>
                  הערות לשליח
                  <input name="notes" value={shippingAddress.notes} onChange={updateShippingField} />
                </label>
              </fieldset>
            ) : null}

            <div className="cart-summary__divider" />
            <div className="cart-summary__total">
              <span>סה״כ</span>
              <strong>{formatPrice(displayedSubtotal)}</strong>
            </div>

            <button
              className="cart-checkout-button"
              type="submit"
              disabled={checkoutLoading || Boolean(updatingBookId) || !summary.checkoutConfigured}
            >
              {checkoutLoading ? 'פותחים תשלום מאובטח...' : 'המשך לתשלום'}
            </button>

            {!summary.checkoutConfigured ? (
              <p className="cart-summary__notice">הסליקה עדיין אינה זמינה.</p>
            ) : null}
            {checkoutError ? <p className="cart-error" role="alert">{checkoutError}</p> : null}
            {error ? <p className="cart-error" role="alert">{error}</p> : null}

            <div className="cart-summary__benefits">
              <span>✓ גישה לכל עמודי הספר לאחר התשלום</span>
              <span>✓ הספר נשמר בספרייה האישית</span>
              {displayedHasPhysicalItems ? <span>✓ הספר הפיזי יישלח לכתובת שהוזנה</span> : null}
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default Cart;
