import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Book from './components/Book/Book';
import { getBookRequest } from '../../services/bookApi';
import Navbar from '../../components/navbar/Navbar';
import './BookViewer.css';

function BookViewer() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBook() {
      try {
        const data = await getBookRequest(id);
        setBook(data.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id]);

  if (loading) {
    return (
      <><Navbar variant="app" /><div className="viewer-loading">
        <h2>טוען את הספר...</h2>
      </div></>
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

  return (
    <div className="book-viewer">
      <Navbar variant="app" />
      <Book book={book} />
    </div>
  );
}

export default BookViewer;
