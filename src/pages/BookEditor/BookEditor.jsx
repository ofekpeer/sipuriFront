import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Navbar from '../../components/navbar/Navbar';
import {
  deleteBookRequest,
  getBookAssetUrl,
  getEditableBookRequest,
  replaceBookImageRequest,
  updateBookRequest,
} from '../../services/bookApi';
import './BookEditor.css';

function createDraft(book) {
  return {
    title: book.title || '',
    summary: book.summary || '',
    moral: book.moral || '',
    pages: (book.pages || []).map((page) => ({
      page: page.page,
      text: page.text || '',
    })),
  };
}

function BookEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    async function loadBook() {
      try {
        const response = await getEditableBookRequest(id);
        setBook(response.data);
        setDraft(createDraft(response.data));
      } catch (requestError) {
        setError(requestError.message || 'לא ניתן לטעון את עורך הספר');
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id]);

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setNotice('');
  }

  function updatePageText(pageNumber, text) {
    setDraft((current) => ({
      ...current,
      pages: current.pages.map((page) => (
        page.page === pageNumber ? { ...page, text } : page
      )),
    }));
    setNotice('');
  }

  async function saveChanges(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');

    try {
      const updates = {
        title: draft.title,
        summary: draft.summary,
        pages: draft.pages,
      };

      if (book.isPurchased) {
        updates.moral = draft.moral;
      }

      const response = await updateBookRequest(id, updates);
      setBook(response.data);
      setDraft(createDraft(response.data));
      setNotice('השינויים נשמרו בהצלחה');
    } catch (requestError) {
      setError(requestError.message || 'שמירת השינויים נכשלה');
    } finally {
      setSaving(false);
    }
  }

  async function replaceImage(event, target) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('ניתן להעלות תמונות JPG, PNG או WebP בלבד');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('התמונה גדולה מדי. ניתן להעלות קובץ עד 10MB');
      return;
    }

    const uploadKey = target.kind === 'cover'
      ? 'cover'
      : `page-${target.pageNumber}`;
    setUploading(uploadKey);
    setError('');
    setNotice('');

    try {
      const response = await replaceBookImageRequest(id, file, target);
      setBook(response.data);
      setNotice('התמונה הוחלפה בהצלחה');
    } catch (requestError) {
      setError(requestError.message || 'החלפת התמונה נכשלה');
    } finally {
      setUploading('');
    }
  }

  async function deleteBook() {
    const confirmed = window.confirm(
      'למחוק את הספר לצמיתות? לא ניתן לבטל את הפעולה.',
    );
    if (!confirmed) return;

    setDeleting(true);
    setError('');

    try {
      await deleteBookRequest(id);
      navigate('/library', {
        replace: true,
        state: { bookRemoved: true },
      });
    } catch (requestError) {
      setError(requestError.message || 'מחיקת הספר נכשלה');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="book-editor-page">
        <Navbar variant="app" />
        <div className="book-editor-state">טוען את עורך הספר...</div>
      </div>
    );
  }

  if (!book || !draft) {
    return (
      <div className="book-editor-page">
        <Navbar variant="app" />
        <div className="book-editor-state">
          <h1>לא ניתן לערוך את הספר</h1>
          <p>{error}</p>
          <Link to="/library">חזרה לספרייה</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="book-editor-page">
      <Navbar variant="app" />

      <main className="book-editor-shell">
        <header className="book-editor-header">
          <div>
            <Link to="/library" className="book-editor-back">← חזרה לספרייה</Link>
            <span className="book-editor-kicker">עריכת ספר אישי</span>
            <h1>עורכים את הסיפור</h1>
            <p>ניתן לשנות את הטקסט ולהעלות כריכה ואיורים משלכם.</p>
          </div>

          <div className="book-editor-header-actions">
            <Link to={`/book/${id}`} className="book-editor-preview">
              תצוגה מקדימה
            </Link>
            <button
              type="button"
              className="book-editor-delete"
              onClick={deleteBook}
              disabled={deleting}
            >
              {deleting ? 'מוחק...' : 'מחיקת הספר'}
            </button>
          </div>
        </header>

        {!book.isPurchased && (
          <div className="book-editor-lock-note">
            <span>🔒</span>
            <div>
              <strong>עריכת עמודי ההמשך זמינה לאחר רכישה</strong>
              <p>בינתיים אפשר לערוך את הכריכה, פרטי הספר ושני עמודי התצוגה המקדימה.</p>
            </div>
            <Link to={`/book/${id}/checkout`}>להמשך לתשלום</Link>
          </div>
        )}

        {error && <div className="book-editor-message is-error" role="alert">{error}</div>}
        {notice && <div className="book-editor-message is-success" role="status">{notice}</div>}

        <form onSubmit={saveChanges}>
          <section className="book-editor-section book-editor-overview">
            <div className="book-editor-cover-card">
              <div className="book-editor-image-frame is-cover">
                {book.cover?.imageUrl ? (
                  <img src={getBookAssetUrl(book.cover.imageUrl)} alt={book.title} />
                ) : (
                  <span>📖</span>
                )}
                <label className="book-editor-image-action">
                  {uploading === 'cover' ? 'מעלה...' : 'החלפת כריכה'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={Boolean(uploading)}
                    onChange={(event) => replaceImage(event, { kind: 'cover' })}
                  />
                </label>
              </div>
            </div>

            <div className="book-editor-fields">
              <label>
                שם הספר
                <input
                  value={draft.title}
                  maxLength={160}
                  onChange={(event) => updateField('title', event.target.value)}
                />
              </label>

              <label>
                תקציר
                <textarea
                  value={draft.summary}
                  rows={6}
                  maxLength={3000}
                  onChange={(event) => updateField('summary', event.target.value)}
                />
              </label>

              {book.isPurchased && (
                <label>
                  מוסר השכל
                  <textarea
                    value={draft.moral}
                    rows={4}
                    maxLength={1500}
                    onChange={(event) => updateField('moral', event.target.value)}
                  />
                </label>
              )}
            </div>
          </section>

          <section className="book-editor-section">
            <div className="book-editor-section-heading">
              <span>עמודי הסיפור</span>
              <h2>טקסט ואיורים</h2>
              <p>לחצו על החלפת תמונה כדי להעלות איור משלכם לכל עמוד.</p>
            </div>

            <div className="book-editor-pages">
              {draft.pages.map((pageDraft) => {
                const page = book.pages.find((item) => item.page === pageDraft.page);
                const uploadKey = `page-${pageDraft.page}`;

                return (
                  <article className="book-editor-page-card" key={pageDraft.page}>
                    <div className="book-editor-image-frame">
                      {page?.imageUrl ? (
                        <img
                          src={getBookAssetUrl(page.imageUrl)}
                          alt={`עמוד ${pageDraft.page}`}
                        />
                      ) : (
                        <span>🎨</span>
                      )}
                      <label className="book-editor-image-action">
                        {uploading === uploadKey ? 'מעלה...' : 'החלפת תמונה'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={Boolean(uploading)}
                          onChange={(event) => replaceImage(event, {
                            kind: 'page',
                            pageNumber: pageDraft.page,
                          })}
                        />
                      </label>
                    </div>

                    <label className="book-editor-page-text">
                      <span>עמוד {pageDraft.page}</span>
                      <textarea
                        value={pageDraft.text}
                        rows={8}
                        maxLength={5000}
                        onChange={(event) => updatePageText(
                          pageDraft.page,
                          event.target.value,
                        )}
                      />
                    </label>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="book-editor-save-bar">
            <span>השינויים יופיעו מיד בספר</span>
            <button type="submit" disabled={saving || Boolean(uploading)}>
              {saving ? 'שומר...' : 'שמירת כל השינויים'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default BookEditor;
