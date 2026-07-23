import React, { forwardRef } from "react";
import "./EndingPage.css";

const EndingPage = forwardRef(({ book }, ref) => {
  return (
    <div className="ending-page" ref={ref}>

      <div className="ending-icon">
        🌟
      </div>

      <h1>מוסר ההשכל</h1>

      <p>
        {book.moral}
      </p>

      <span>
        ❤️ תודה שקראת את הספר
      </span>

    </div>
  );
});

export default EndingPage;