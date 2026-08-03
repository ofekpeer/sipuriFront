import React, { forwardRef } from "react";
import { useLiveBookContent } from './Book/BookContentContext';
import "./EndingPage.css";

const EndingPage = forwardRef(({ book }, ref) => {
  const liveBook = useLiveBookContent();
  const displayedBook = liveBook || book;

  return (
    <div className="ending-page" ref={ref}>

      <div className="ending-icon">
        🌟
      </div>

      <h1>מוסר ההשכל</h1>

      <p>
        {displayedBook?.moral}
      </p>

      <span>
        ❤️ תודה שקראת את הספר
      </span>

    </div>
  );
});

export default EndingPage;
