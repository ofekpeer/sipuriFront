import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './BookViewer.css';

function BookViewer() {
  const { id } = useParams();

  const [book, setBook] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBook() {
      try {
        // const response = await fetch(`http://localhost:5000/api/books/${id}`);
        const response = await fetch(`https://sipuriback.onrender.com/api/books/${id}`);

        const data = await response.json();

        if (data.success) {
          setBook(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id]);

  if (loading) {
    return (
      <div className="book-viewer-empty">
        <h2>טוען ספר...</h2>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-viewer-empty">
        <h2>לא נמצא ספר</h2>

        <Link to="/create-book">
          <button>צור ספר חדש</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="book-viewer">
      <div className="viewer-cover">
        <h1>{book.title}</h1>

        <p>{book.summary}</p>
      </div>

      <div className="viewer-pages">
        {book.pages.map((page) => (
          <div className="page-card" key={page.page}>
            <div className="page-image">🖼️</div>

            <div className="page-text">
              <h3>עמוד {page.page}</h3>

              <p>{page.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="viewer-ending">
        <h2>מוסר השכל</h2>

        <p>{book.moral}</p>
      </div>
    </div>
  );
}

export default BookViewer;
