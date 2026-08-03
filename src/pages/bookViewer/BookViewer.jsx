import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import Book from './components/Book/Book';
import { getBookRequest } from '../../services/bookApi';
import Navbar from '../../components/navbar/Navbar';
import {
  getBookRenderFingerprint,
  hasRenderableBookPreview,
  isBookStillEnhancing,
} from './bookViewerState';
import './BookViewer.css';

const BOOK_REFRESH_INTERVAL_MS = 2500;

function BookViewer() {
  const { id } = useParams();
  const location = useLocation();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const renderFingerprintRef = useRef('');

  useEffect(() => {
    let cancelled = false;
    let refreshTimer = null;
    let hasLoadedBook = false;

    async function loadBook() {
      try {
        const data = await getBookRequest(id);
        if (cancelled) return;

        const nextBook = data.data;
        hasLoadedBook = true;
        const nextFingerprint = getBookRenderFingerprint(nextBook);

        if (nextFingerprint !== renderFingerprintRef.current) {
          renderFingerprintRef.current = nextFingerprint;
          setBook(nextBook);
        }
        setError('');

        // A streamed preview lets the reader enter earlier. Keep refreshing in
        // the background so the same high-quality request can replace those
        // temporary images without a page reload.
        if (isBookStillEnhancing(nextBook)) {
          refreshTimer = setTimeout(loadBook, BOOK_REFRESH_INTERVAL_MS);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled && !hasLoadedBook) {
          setError(err.message);
        } else if (!cancelled && hasLoadedBook) {
          refreshTimer = setTimeout(loadBook, BOOK_REFRESH_INTERVAL_MS);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => {
      cancelled = true;
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar variant="app" />
        <div className="viewer-loading">
          <div className="viewer-loading__book" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="viewer-loading__eyebrow">הקסם כבר בדרך</span>
          <h2>פותחים את הספר שלך...</h2>
          <p>טוענים את הכריכה והאיורים באיכות מלאה</p>
        </div>
      </>
    );
  }

  if (book && !hasRenderableBookPreview(book) && book.status !== 'failed') {
    return (
      <>
        <Navbar variant="app" />
        <div className="viewer-loading viewer-loading--preparing" role="status">
          <div className="viewer-loading__book" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="viewer-loading__eyebrow">עוד נגיעה קטנה</span>
          <h2>מכינים את הספר להצגה</h2>
          <p>מוודאים שהכריכה ושני העמודים הראשונים נטענו לפני שפותחים</p>
        </div>
      </>
    );
  }

  if (!book) {
    return (
      <><Navbar variant="app" /><div className="viewer-loading">
        <h2>{error || 'הספר לא נמצא'}</h2>

        <Link to="/create-book">צור ספר חדש</Link>
      </div></>
    );
  }

  if (book.status === 'failed') {
    return (
      <>
        <Navbar variant="app" />
        <div className="viewer-loading viewer-loading--error">
          <span className="viewer-loading__eyebrow">לא הצלחנו לפתוח את הספר</span>
          <h2>אירעה שגיאה ביצירת הספר</h2>
          <p>אפשר לחזור לספרייה ולנסות שוב.</p>
          <Link to="/library">חזרה לספרייה שלי</Link>
        </div>
      </>
    );
  }

  return (
    <div className={`book-viewer${location.state?.justCreated ? ' book-viewer--reveal' : ''}`}>
      <Navbar variant="app" />
      <Book book={book} />
    </div>
  );
}

export default BookViewer;
