import React, { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../../../context/CartContext';
import './PaywallPage.css';

const PaywallPage = forwardRef(({ bookId }, ref) => {
  const {
    addBook,
    containsBook,
    updatingBookId,
  } = useCart();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const isInCart = containsBook(bookId);
  const adding = updatingBookId === String(bookId);

  async function addToCart() {
    setMessage('');
    setError('');

    try {
      await addBook(bookId);
      setMessage('הספר נוסף לעגלה בהצלחה.');
    } catch (requestError) {
      setError(requestError.message || 'לא הצלחנו להוסיף את הספר לעגלה.');
    }
  }

  return (
    <div className="paywall-page" ref={ref}>
      <div className="paywall-icon" aria-hidden="true">🔒</div>
      <h1>המשך הסיפור מחכה לך</h1>
      <p>כדי לפתוח את העמודים הבאים ולהמשיך לקרוא, יש להשלים את הרכישה.</p>

      <div className="paywall-actions">
        {isInCart ? (
          <Link className="paywall-button" to="/cart">
            מעבר לעגלה
          </Link>
        ) : (
          <button
            className="paywall-button"
            type="button"
            onClick={addToCart}
            disabled={adding}
          >
            {adding ? 'מוסיף לעגלה...' : 'הוספה לעגלה'}
          </button>
        )}

        <Link className="paywall-buy-now" to={`/book/${bookId}/checkout`}>
          רכישה מיידית
        </Link>
      </div>

      {message ? <span className="paywall-feedback" role="status">{message}</span> : null}
      {error ? <span className="paywall-feedback is-error" role="alert">{error}</span> : null}
    </div>
  );
});

PaywallPage.displayName = 'PaywallPage';

export default PaywallPage;
