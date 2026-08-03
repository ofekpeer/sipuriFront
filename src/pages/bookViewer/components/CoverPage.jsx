import React, { forwardRef } from 'react';
import { getBookAssetUrl } from '../../../services/bookApi';
import { useLiveBookContent } from './Book/BookContentContext';
import './CoverPage.css';

const CoverPage = forwardRef(({ book }, ref) => {
  const liveBook = useLiveBookContent();
  const displayedBook = liveBook || book;

  return (
    <div className="cover-page" ref={ref}>
      <div className="cover-inner">

        {displayedBook.cover?.imageUrl ? (
          <img
            src={getBookAssetUrl(displayedBook.cover.imageUrl)}
            alt={displayedBook.title}
            className="cover-book-image"
            draggable="false"
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <div className="cover-placeholder" aria-hidden="true">
            📖
          </div>
        )}

        <h1>{displayedBook.title}</h1>

        <p>{displayedBook.summary}</p>

        <span>
          <b aria-hidden="true">✦</b> נוצר במיוחד עבור {displayedBook.child.name}
        </span>

      </div>
    </div>
  );
});

export default CoverPage;
