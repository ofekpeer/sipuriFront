import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  createBookCheckoutRequest,
  getBookAssetUrl,
  getBookRequest,
  getPaymentConfigurationRequest,
} from '../../services/bookApi';
import './BookCheckout.css';

function BookCheckout() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingPayment, setStartingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentConfig, setPaymentConfig] = useState(null);

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

  async function continueToPayment() {
    setStartingPayment(true);
    setPaymentError('');

    try {
      const response = await createBookCheckoutRequest(id);

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
    return <main className="checkout-page">טוען את פרטי ההזמנה...</main>;
  }

  if (!book) {
    return (
      <main className="checkout-page">
        <p>לא הצלחנו למצוא את הספר.</p>
        <Link to="/">חזרה לדף הבית</Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-glow checkout-glow-one" />
      <div className="checkout-glow checkout-glow-two" />

      <section className="checkout-shell">
        <header className="checkout-header">
          <Link className="checkout-brand" to="/" aria-label="חזרה לדף הבית">
            <span className="checkout-brand-mark">ס</span>
            סיפורי
          </Link>
          <span className="checkout-secure">🔒 רכישה מאובטחת</span>
        </header>

        <div className="checkout-card">
          <section className="checkout-story-preview">
            <span className="checkout-spark sparkle-one">✦</span>
            <span className="checkout-spark sparkle-two">✦</span>
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
            <p>נוצר במיוחד עבור {book.child?.name || 'הילד/ה שלך'}</p>
          </section>

          <section className="checkout-details">
            <span className="checkout-eyebrow">הסיפור שלך מחכה להיפתח</span>
            <h1>{book.title}</h1>
            <p className="checkout-intro">פתחו את הספר המלא והמשיכו למסע אישי, מאויר ומלא קסם.</p>

            <div className="checkout-includes">
              <div><span>✓</span> גישה לכל עמודי הסיפור</div>
              <div><span>✓</span> האיורים האישיים במלואם</div>
              <div><span>✓</span> קריאה חוזרת בכל זמן</div>
            </div>

            <div className="checkout-order">
              <span>הספר שנבחר</span>
              <strong>ספר דיגיטלי אישי</strong>
              {paymentConfig?.configured ? (
                <b>{new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(paymentConfig.amountAgorot / 100)}</b>
              ) : null}
            </div>

            <button type="button" className="checkout-button" onClick={continueToPayment} disabled={startingPayment || !paymentConfig?.configured}>
              <span>{startingPayment ? 'מעבירים לתשלום מאובטח...' : 'המשך לתשלום מאובטח'}</span>
              <span aria-hidden="true">←</span>
            </button>

            {paymentError ? <p className="checkout-error" role="alert">{paymentError}</p> : null}

            <p className="checkout-note">🔒 פרטי התשלום מוגנים ומעובדים דרך ספק סליקה מאובטח.</p>
            <Link className="checkout-back" to={`/book/${id}`}>
              ← חזרה לתצוגה המקדימה
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}

export default BookCheckout;
