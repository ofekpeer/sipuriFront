import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import HTMLFlipBook from 'react-pageflip';
import {
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

import { getBookAssetUrl } from '../../../../services/bookApi';
import CoverPage from '../CoverPage';
import StoryPage from '../StoryPage';
import EndingPage from '../EndingPage';
import PaywallPage from '../PaywallPage';

import BookScene from './BookScene';
import BookShell from './BookShell';
import { BookContentContext } from './BookContentContext';

import './Book.css';

const PAGE_ASPECT_RATIO = 0.75;

function getPageLabel(pageIndex, lastPageIndex, isPurchased) {
  if (pageIndex <= 0) return 'כריכה';
  if (pageIndex >= lastPageIndex) {
    return isPurchased ? 'סוף הסיפור' : 'המשך הסיפור';
  }

  return `עמוד ${pageIndex}`;
}

function Book({ book }) {
  const flipBook = useRef(null);
  const stageRef = useRef(null);
  const [bookSize, setBookSize] = useState({ width: 520, height: 693 });
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' && window.innerWidth <= 768
  ));
  const [currentPage, setCurrentPage] = useState(0);

  const pages = useMemo(
    () => (Array.isArray(book.pages) ? book.pages : []),
    [book.pages],
  );
  const isPurchased = Boolean(book.isPurchased || book.isPaid);
  const remainingPagesAreGenerating = isPurchased
    && ['queued', 'generating'].includes(book.remainingPagesStatus);
  const remainingPagesFailed = isPurchased
    && book.remainingPagesStatus === 'failed';
  const visiblePages = useMemo(
    () => (isPurchased ? pages : pages.slice(0, 2)),
    [isPurchased, pages],
  );
  const visiblePageStructure = visiblePages
    .map((page) => page.page)
    .join(',');

  // Keeping this array stable prevents react-pageflip from rebuilding the
  // physical book on every background status poll.
  const readerPages = useMemo(() => [
    <CoverPage key="cover" />,
    ...visiblePages.map((page) => (
      <StoryPage key={`story-${page.page}`} pageNumber={page.page} />
    )),
    isPurchased
      ? <EndingPage key="ending" />
      : <PaywallPage key="paywall" bookId={book._id} />,
    // Live text and images arrive through context. Recreate physical pages
    // only when purchase changes their number or structure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [book._id, isPurchased, visiblePageStructure]);

  const lastPageIndex = Math.max(0, readerPages.length - 1);
  const pageProgress = lastPageIndex
    ? Math.min(100, (currentPage / lastPageIndex) * 100)
    : 0;

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    function updateBookSize() {
      const { width: stageWidth, height: stageHeight } = stage.getBoundingClientRect();
      const mobileViewport = stageWidth <= 768;
      const horizontalReserve = mobileViewport ? 12 : 176;
      const verticalReserve = mobileViewport ? 22 : 112;
      const availableWidth = Math.max(260, stageWidth - horizontalReserve);
      const availableHeight = Math.max(400, stageHeight - verticalReserve);
      const availablePageWidth = mobileViewport
        ? availableWidth
        : availableWidth / 2;
      const width = Math.max(260, Math.round(Math.min(
        availablePageWidth,
        availableHeight * PAGE_ASPECT_RATIO,
      )));
      const height = Math.round(width / PAGE_ASPECT_RATIO);

      setIsMobile(mobileViewport);
      setBookSize((currentSize) => (
        currentSize.width === width && currentSize.height === height
          ? currentSize
          : { width, height }
      ));
    }

    updateBookSize();
    const observer = new ResizeObserver(updateBookSize);
    observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  const previousPage = useCallback(() => {
    const pageFlip = flipBook.current?.pageFlip?.();
    if (!pageFlip || pageFlip.getState() !== 'read') return;
    pageFlip.flipPrev();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [book._id]);

  const nextPage = useCallback(() => {
    const pageFlip = flipBook.current?.pageFlip?.();
    if (!pageFlip || pageFlip.getState() !== 'read') return;
    pageFlip.flipNext();
  }, []);

  useEffect(() => {
    function handleKeyboard(event) {
      if (event.key === 'ArrowRight') nextPage();
      if (event.key === 'ArrowLeft') previousPage();
    }

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [nextPage, previousPage]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, lastPageIndex));
  }, [lastPageIndex]);

  const coverBackground = getBookAssetUrl(book.cover?.imageUrl);
  const pageLabel = getPageLabel(currentPage, lastPageIndex, isPurchased);

  return (
    <BookScene backgroundUrl={coverBackground}>
      <BookShell>
        <div className={`book-view${remainingPagesAreGenerating ? ' is-finishing-pages' : ''}${remainingPagesFailed ? ' has-page-error' : ''}`}>
          <header className="book-reader-heading">
            <div className="book-reader-heading__icon" aria-hidden="true">
              <FiBookOpen />
            </div>
            <div className="book-reader-heading__copy">
              <span>
                {remainingPagesAreGenerating
                  ? 'איורי ההמשך נוצרים עכשיו'
                  : remainingPagesFailed
                    ? 'חלק מהאיורים עדיין לא הושלמו'
                    : isPurchased ? 'הספר המלא שלך' : 'טעימה מהסיפור'}
              </span>
              <strong>{book.title}</strong>
            </div>
            <div className="book-reader-heading__page" aria-live="polite">
              {pageLabel}
            </div>
          </header>

          <div className="book-stage" ref={stageRef}>
            <button
              className="nav-button nav-button--previous"
              type="button"
              onClick={previousPage}
              disabled={currentPage <= 0}
              aria-label="לעמוד הקודם"
            >
              <FiChevronLeft />
            </button>

            <BookContentContext.Provider value={book}>
            <HTMLFlipBook
              key={`${book._id}-${bookSize.width}-${bookSize.height}-${isMobile ? 'portrait' : 'landscape'}`}
              ref={flipBook}
              className="book-flipbook"
              style={{ direction: 'ltr' }}
              width={bookSize.width}
              height={bookSize.height}
              size="fixed"
              minWidth={260}
              maxWidth={1800}
              minHeight={346}
              maxHeight={2000}
              usePortrait={isMobile}
              startPage={Math.min(currentPage, lastPageIndex)}
              autoSize={false}
              drawShadow
              maxShadowOpacity={0.42}
              flippingTime={850}
              showCover
              showPageCorners={!isMobile}
              useMouseEvents
              swipeDistance={24}
              mobileScrollSupport
              onFlip={(event) => setCurrentPage(Number(event.data) || 0)}
            >
              {readerPages}
            </HTMLFlipBook>
            </BookContentContext.Provider>

            <button
              className="nav-button nav-button--next"
              type="button"
              onClick={nextPage}
              disabled={currentPage >= lastPageIndex}
              aria-label="לעמוד הבא"
            >
              <FiChevronRight />
            </button>
          </div>

          <footer className="book-reader-footer">
            <span className="book-reader-footer__hint">
              {remainingPagesAreGenerating
                ? 'אפשר להתחיל לקרוא — האיורים מתעדכנים אוטומטית'
                : remainingPagesFailed
                  ? 'העמודים שנוצרו נשמרו; ניתן לנסות להשלים שוב מאוחר יותר'
                  : isMobile ? 'החליקו כדי לדפדף' : 'גררו את פינת הדף או השתמשו בחצים'}
            </span>
            <div className="book-reader-progress" aria-hidden="true">
              <span style={{ width: `${pageProgress}%` }} />
            </div>
          </footer>
        </div>
      </BookShell>
    </BookScene>
  );
}

export default Book;
