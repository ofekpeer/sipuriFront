import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { getPaymentRequest } from '../../services/bookApi';
import './PaymentResult.css';

function PaymentResult() {
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
      } catch (_) {
        setPayment(null);
      } finally {
        setLoading(false);
      }
    }

    loadPayment();
  }, [paymentId]);

  if (loading) {
    return <main className="payment-result"><p>מאמתים את התשלום שלך...</p></main>;
  }

  const paid = payment?.status === 'paid';
  const cancelled = requestedOutcome === 'cancel' || payment?.status === 'cancelled';
  const bookPath = payment?.bookId ? `/book/${payment.bookId}` : '/library';

  return (
    <main className="payment-result" dir="rtl">
      <section className={`payment-result-card ${paid ? 'is-success' : 'is-error'}`}>
        <div className="payment-result-icon">{paid ? '✓' : cancelled ? '←' : '!'}</div>
        <h1>{paid ? 'התשלום התקבל בהצלחה!' : cancelled ? 'התשלום בוטל' : 'התשלום לא הושלם'}</h1>
        <p>
          {paid
            ? 'הספר המלא נפתח עבורך עכשיו. קריאה נעימה!'
            : cancelled
              ? 'לא חויבת. אפשר לחזור לספר ולנסות שוב מתי שנוח.'
              : 'לא חויבת או שהתשלום לא אומת. אפשר לנסות שוב.'}
        </p>
        <Link className="payment-result-button" to={bookPath}>
          {paid ? 'לקריאת הספר המלא' : 'חזרה לספר'}
        </Link>
      </section>
    </main>
  );
}

export default PaymentResult;
