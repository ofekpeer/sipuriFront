import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { getPaymentRequest } from '../../services/bookApi';
import { useCart } from '../../context/CartContext';
import Navbar from '../../components/navbar/Navbar';
import './PaymentResult.css';

function PaymentResult() {
  const { refreshCart } = useCart();
  const [params] = useSearchParams();
  const paymentId = params.get('payment');
  const requestedOutcome = params.get('outcome');
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayment() {
      if (!paymentId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getPaymentRequest(paymentId);
        setPayment(response.data);
        if (response.data?.status === 'paid') {
          await refreshCart({ silent: true });
        }
      } catch (_) {
        setPayment(null);
      } finally {
        setLoading(false);
      }
    }

    loadPayment();
  }, [paymentId, refreshCart]);

  if (loading) {
    return (
      <>
        <Navbar variant="checkout" />
        <main className="payment-result"><p>מאמתים את התשלום שלך...</p></main>
      </>
    );
  }

  const paid = payment?.status === 'paid';
  const cancelled = requestedOutcome === 'cancel' || payment?.status === 'cancelled';
  const purchasedSeveralBooks = payment?.bookIds?.length > 1;
  const hasPhysicalBook = Boolean(payment?.hasPhysicalBook);
  const bookPath = purchasedSeveralBooks
    ? '/library'
    : payment?.bookId ? `/book/${payment.bookId}` : '/library';

  return (
    <>
      <Navbar variant="checkout" />
      <main className="payment-result" dir="rtl">
        <section className={`payment-result-card ${paid ? 'is-success' : 'is-error'}`}>
          <div className="payment-result-icon">{paid ? '✓' : cancelled ? '←' : '!'}</div>
          <h1>{paid ? 'התשלום התקבל בהצלחה!' : cancelled ? 'התשלום בוטל' : 'התשלום לא הושלם'}</h1>
          <p>
            {paid
              ? hasPhysicalBook
                ? 'הגרסה הדיגיטלית נפתחה ונשמרה בספרייה. הספר הפיזי נכנס להכנה ויישלח לכתובת שמסרת.'
                : purchasedSeveralBooks
                  ? 'כל הספרים נפתחו ונשמרו בספרייה. איורי ההמשך נוצרים עכשיו ויתעדכנו אוטומטית.'
                  : 'הספר נפתח עבורך. אפשר להתחיל לקרוא בזמן שאיורי ההמשך נוצרים ומתעדכנים אוטומטית.'
              : cancelled
                ? 'לא חויבת. אפשר לחזור לספר ולנסות שוב מתי שנוח.'
                : 'לא חויבת או שהתשלום לא אומת. אפשר לנסות שוב.'}
          </p>
          <Link className="payment-result-button" to={bookPath}>
            {paid
              ? purchasedSeveralBooks ? 'לספרייה שלי' : 'לקריאת הספר המלא'
              : 'חזרה לספר'}
          </Link>
        </section>
      </main>
    </>
  );
}

export default PaymentResult;
