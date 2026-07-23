import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { getLibraryRequest } from '../../services/authApi';
import { deleteBookRequest, getBookAssetUrl } from '../../services/bookApi';
import './Library.css';

function Library() {
  const location = useLocation();
  const { user, token, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState('');

  const loadLibrary = useCallback(async ({ silent = false } = {}) => {
    try {
      const response = await getLibraryRequest(token);
      setBooks(response.data?.books || response.books || response.data || []);
      setError('');
    } catch (requestError) {
      if (!silent) {
        setError(requestError.message || 'לא הצלחנו לטעון את הספרייה');
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  const hasGeneratingBooks = useMemo(
    () => books.some((book) => book.status === 'generating'),
    [books],
  );

  useEffect(() => {
    if (!hasGeneratingBooks) return undefined;

    const pollId = setInterval(() => {
      loadLibrary({ silent: true });
    }, 4000);

    return () => clearInterval(pollId);
  }, [hasGeneratingBooks, loadLibrary]);

  const getGenerationLabel = (book) => {
    switch (book.generationStep) {
      case 'analyzing-image':
        return 'מנתחים את התמונה ושומרים על תווי הפנים';
      case 'generating-story':
        return 'כותבים את הסיפור ומכינים את הדמות';
      case 'generating-preview':
        return 'יוצרים את הכריכה והעמודים הראשונים';
      default:
        return 'יצירת הספר התחילה ברקע';
    }
  };

  async function removeBook(book) {
    const message = book.isOwner
      ? 'למחוק את הספר לצמיתות? לא ניתן לבטל את הפעולה.'
      : 'להסיר את הספר מהספרייה שלך?';

    if (!window.confirm(message)) return;

    setRemovingId(book._id);
    setError('');

    try {
      await deleteBookRequest(book._id);
      setBooks((current) => current.filter((item) => item._id !== book._id));
    } catch (requestError) {
      setError(requestError.message || 'לא הצלחנו להסיר את הספר');
    } finally {
      setRemovingId('');
    }
  }

  return (
    <main className="library-page">
      <header className="library-header">
        <Link to="/" className="library-brand">סיפורי</Link>
        <div className="library-account">
          <Link to="/" className="library-home-link">חזרה לדף הבית</Link>
          <span>שלום, {user?.name || 'קורא/ת'}</span>
          <button type="button" onClick={logout}>התנתקות</button>
        </div>
      </header>

      <section className="library-hero">
        <span>📚 הספרייה שלי</span>
        <h1>כל הסיפורים שלך מחכים כאן</h1>
        <p>הספרים שנרכשו או נוצרו עבורך זמינים כאן מכל מכשיר.</p>
      </section>

      {location.state?.bookQueued && (
        <div className="library-queued-notice" role="status">
          <span>✨</span>
          <div>
            <strong>יצירת הספר התחילה</strong>
            <p>אפשר להמשיך להשתמש באתר. הספר יתעדכן כאן אוטומטית ברגע שיהיה מוכן.</p>
          </div>
        </div>
      )}

      {location.state?.bookRemoved && (
        <div className="library-queued-notice is-removed" role="status">
          <span>✓</span>
          <div>
            <strong>הספר הוסר מהספרייה</strong>
          </div>
        </div>
      )}

      {loading && <p className="library-status">טוען את הספרייה...</p>}
      {error && <p className="library-status library-error">{error}</p>}

      {!loading && !error && books.length === 0 && (
        <section className="library-empty">
          <div>✨</div>
          <h2>הספרייה עדיין ריקה</h2>
          <p>כשתיצרו או תרכשו ספר, הוא יופיע כאן ויהיה זמין לקריאה בכל עת.</p>
          <Link to="/create-book">ליצירת הספר הראשון</Link>
        </section>
      )}

      {!loading && !error && books.length > 0 && (
        <section className="library-grid">
          {books.map((book) => (
            <article
              className={`library-book ${book.status === 'generating' ? 'is-generating' : ''}`}
              key={book._id}
            >
              <div className="library-cover-wrap">
                {book.cover?.imageUrl ? (
                  <img src={getBookAssetUrl(book.cover.imageUrl)} alt={book.title} />
                ) : book.status === 'generating' ? (
                  <div className="library-generating-art" aria-hidden="true">
                    <span className="library-generating-spinner" />
                    <span>📖</span>
                  </div>
                ) : (
                  <span>📖</span>
                )}
              </div>

              <h2>{book.title}</h2>
              <p>{book.child?.name ? `נוצר עבור ${book.child.name}` : 'ספר אישי'}</p>

              {book.status === 'generating' ? (
                <div className="library-generation-status">
                  <span className="library-status-dot" />
                  {getGenerationLabel(book)}
                </div>
              ) : book.status === 'failed' ? (
                <div className="library-generation-status is-failed">
                  יצירת הספר נכשלה. ניתן ליצור ספר חדש.
                </div>
              ) : (
                <div className="library-book-actions">
                  <Link className="library-read-action" to={`/book/${book._id}`}>
                    להמשך קריאה
                  </Link>
                  {book.canEdit && (
                    <Link
                      className="library-edit-action"
                      to={`/library/book/${book._id}/edit`}
                    >
                      עריכה
                    </Link>
                  )}
                  {book.canRemove && (
                    <button
                      type="button"
                      className="library-remove-action"
                      disabled={removingId === book._id}
                      onClick={() => removeBook(book)}
                    >
                      {removingId === book._id
                        ? 'מסיר...'
                        : book.isOwner ? 'מחיקה' : 'הסרה'}
                    </button>
                  )}
                </div>
              )}

              {book.status !== 'completed' && book.canRemove && (
                <button
                  type="button"
                  className="library-remove-action is-full"
                  disabled={removingId === book._id}
                  onClick={() => removeBook(book)}
                >
                  {removingId === book._id ? 'מסיר...' : 'מחיקת הספר'}
                </button>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Library;
