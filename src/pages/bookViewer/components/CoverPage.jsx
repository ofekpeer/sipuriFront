import React, { forwardRef } from 'react';
import { getBookAssetUrl } from '../../../services/bookApi';
import './CoverPage.css';

const CoverPage = forwardRef(({ book }, ref) => {
  return (
    <div className="cover-page" ref={ref}>
      <div className="cover-inner">

        {book.cover?.imageUrl ? (
          <img
            src={getBookAssetUrl(book.cover.imageUrl)}
            alt={book.title}
            className="cover-book-image"
            draggable="false"
          />
        ) : (
          <div className="cover-placeholder" aria-hidden="true">
            📖
          </div>
        )}

        <h1>{book.title}</h1>

        <p>{book.summary}</p>

        <span>
          ✨ נוצר במיוחד עבור {book.child.name}
        </span>

      </div>
    </div>
  );
});

export default CoverPage;
