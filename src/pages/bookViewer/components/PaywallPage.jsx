import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

import './PaywallPage.css';

const PaywallPage = forwardRef(({ bookId }, ref) => {
  return (
    <div className="paywall-page" ref={ref}>
      <div className="paywall-icon" aria-hidden="true">🔒</div>
      <h1>המשך הסיפור מחכה לך</h1>
      <p>כדי לפתוח את העמודים הבאים ולהמשיך לקרוא, יש להשלים תשלום.</p>

      <Link className="paywall-button" to={`/book/${bookId}/checkout`}>
        המשך לתשלום
      </Link>
    </div>
  );
});

PaywallPage.displayName = 'PaywallPage';

export default PaywallPage;
