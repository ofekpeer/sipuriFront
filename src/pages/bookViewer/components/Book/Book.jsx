import React, { useEffect, useMemo, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';

import CoverPage from '../CoverPage';
import StoryPage from '../StoryPage';
import EndingPage from '../EndingPage';
import PaywallPage from '../PaywallPage';

import BookScene from './BookScene';
import BookShell from './BookShell';

import './Book.css';

function Book({ book }) {
  const flipBook = useRef(null);
  const [bookSize, setBookSize] = useState({ width: 720, height: 900 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function updateBookSize() {
      const mobileViewport = window.innerWidth <= 768;
      setIsMobile(mobileViewport);

      const maxWidth = window.innerWidth - (mobileViewport ? 8 : 144);
      // Reserve room for the fixed navigation bar so it never covers the book.
      const maxHeight = window.innerHeight - (mobileViewport ? 96 : 176);
      const pageAspectRatio = 0.74;
      const availablePageWidth = mobileViewport ? maxWidth : maxWidth / 2;
      const width = Math.round(
        Math.min(availablePageWidth, maxHeight * pageAspectRatio),
      );
      const height = Math.round(width / pageAspectRatio);

      setBookSize({ width, height });
    }

    updateBookSize();
    window.addEventListener('resize', updateBookSize);

    return () => window.removeEventListener('resize', updateBookSize);
  }, []);

  const pages = useMemo(
    () => (Array.isArray(book.pages) ? book.pages : []),
    [book.pages],
  );
  const isPurchased = Boolean(book.isPurchased || book.isPaid);
  const previewPages = isPurchased ? pages : pages.slice(0, 2);
  function nextPage() {
    flipBook.current?.pageFlip()?.flipNext();
  }

  function previousPage() {
    flipBook.current?.pageFlip()?.flipPrev();
  }

  return (
    <BookScene>
      <BookShell>
        <div className="book-view">
          <button
            className="nav-button"
            type="button"
            onClick={previousPage}
            aria-label="לעמוד הקודם"
          >
            ←
          </button>

          <div className="book-stage">
            <HTMLFlipBook
              ref={flipBook}
              width={bookSize.width}
              height={bookSize.height}
              size="fixed"
              minWidth={320}
              maxWidth={1800}
              minHeight={480}
              maxHeight={1800}
              usePortrait={isMobile}
              autoSize={false}
              drawShadow={false}
              flippingTime={700}
              showCover
              showPageCorners={false}
              useMouseEvents
            >
              <CoverPage book={book} />

              {previewPages.map((page) => (
                <StoryPage key={page.page} page={page} />
              ))}

              {isPurchased ? (
                <EndingPage book={book} />
              ) : (
                <PaywallPage bookId={book._id} />
              )}
            </HTMLFlipBook>
          </div>

          <button
            className="nav-button"
            type="button"
            onClick={nextPage}
            aria-label="לעמוד הבא"
          >
            →
          </button>
        </div>
      </BookShell>
    </BookScene>
  );
}

export default Book;
