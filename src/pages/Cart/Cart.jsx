import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../../context/CartContext';
import { createCartCheckoutRequest } from '../../services/cartApi';
import { getBookAssetUrl } from '../../services/bookApi';
import './Cart.css';

const formatPrice = (amountAgorot) => (
  new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
  }).format((amountAgorot || 0) / 100)
);

function Cart() {
  const {
    items,
    summary,
    loading,
    error,
    updatingBookId,
    removeBook,
    emptyCart,
    refreshCart,
  } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  async function checkout() {
    setCheckoutLoading(true);
    setCheckoutError('');

    try {
      const response = await createCartCheckoutRequest();
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
        <p>אפשר להוסיף כמה ספרים, לחזור לערוך אותם ולהשלים את הרכישה יחד.</p>
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

            {items.map((item) => (
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
                  <span>ספר דיגיטלי אישי</span>
                  <h3>{item.title}</h3>
                  {item.childName ? <p>נוצר במיוחד עבור {item.childName}</p> : null}
                  <div className="cart-item__links">
                    <Link to={`/book/${item.bookId}`}>תצוגה מקדימה</Link>
                    <Link to={`/library/book/${item.bookId}/edit`}>עריכת הספר</Link>
                  </div>
                </div>

                <div className="cart-item__actions">
                  {item.unitPriceAgorot !== null ? (
                    <strong>{formatPrice(item.unitPriceAgorot)}</strong>
                  ) : (
                    <strong>המחיר יעודכן בקרוב</strong>
                  )}
                  <button
                    type="button"
                    onClick={() => removeBook(item.bookId).catch(() => {})}
                    disabled={updatingBookId === String(item.bookId)}
                  >
                    {updatingBookId === String(item.bookId) ? 'מסיר...' : 'הסרה'}
                  </button>
                </div>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <span className="cart-summary__badge">🔒 רכישה מאובטחת</span>
            <h2>סיכום הזמנה</h2>
            <div className="cart-summary__row">
              <span>ספרים ({summary.itemCount})</span>
              <strong>
                {summary.subtotalAgorot !== null
                  ? formatPrice(summary.subtotalAgorot)
                  : 'טרם הוגדר'}
              </strong>
            </div>
            <div className="cart-summary__divider" />
            <div className="cart-summary__total">
              <span>סה״כ</span>
              <strong>
                {summary.subtotalAgorot !== null
                  ? formatPrice(summary.subtotalAgorot)
                  : '—'}
              </strong>
            </div>

            <button
              className="cart-checkout-button"
              type="button"
              onClick={checkout}
              disabled={checkoutLoading || !summary.checkoutConfigured}
            >
              {checkoutLoading ? 'פותחים תשלום מאובטח...' : 'המשך לתשלום'}
            </button>

            {!summary.checkoutConfigured ? (
              <p className="cart-summary__notice">התשלום ייפתח לאחר השלמת הגדרת המחיר והסליקה.</p>
            ) : null}
            {checkoutError ? <p className="cart-error" role="alert">{checkoutError}</p> : null}
            {error ? <p className="cart-error" role="alert">{error}</p> : null}

            <div className="cart-summary__benefits">
              <span>✓ גישה לכל עמודי הספר</span>
              <span>✓ הספר נשמר בספרייה האישית</span>
              <span>✓ זמינות מכל מכשיר</span>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;
