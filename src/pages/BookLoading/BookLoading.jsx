import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { createBookRequest, getBookRequest } from '../../services/bookApi';
import Navbar from '../../components/navbar/Navbar';
import './BookLoading.css';

function BookLoading() {
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState('מכין את הספר שלך...');
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const waitUntilCompleted = useCallback(
    (id) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(async () => {
        try {
          const data = await getBookRequest(id);
          const book = data.data;

          switch (book.generationStep) {
            case 'created':
              setStep('📚 יוצר את הספר...');
              setProgress(5);
              break;

            case 'analyzing-image':
              setStep('📷 מנתח את תמונת הילד...');
              setProgress(15);
              break;

            case 'generating-story':
              setStep('✍️ כותב את הסיפור...');
              setProgress(35);
              break;

            case 'generating-cover':
              setStep('📕 יוצר את הכריכה...');
              setProgress(50);
              break;

            case 'generating-preview':
              setStep('🎨 יוצר את הכריכה ואת העמודים הראשונים...');
              setProgress(50 + Math.min(book.generatedPages || 0, 2) * 20);
              break;

            case 'generating-pages': {
              const total = book.pages?.length || 1;
              const percent = 50 + (book.generatedPages / total) * 45;
              setProgress(percent);
              setStep(`🎨 יוצר איורים (${book.generatedPages}/${total})`);
              break;
            }

            case 'completed':
              setProgress(100);
              setStep('✅ הספר מוכן!');
              clearInterval(intervalRef.current);
              setTimeout(() => navigate(`/book/${id}`), 500);
              break;

            case 'failed':
              clearInterval(intervalRef.current);
              setStep('❌ אירעה שגיאה ביצירת הספר');
              break;

            default:
              break;
          }
        } catch (err) {
          clearInterval(intervalRef.current);
          console.error(err);
          setStep('❌ שגיאה בתקשורת עם השרת');
        }
      }, 1000);
    },
    [navigate],
  );

  const createBook = useCallback(async () => {
    try {
      const data = await createBookRequest(
        location.state.formData,
        location.state.submissionId,
      );
      waitUntilCompleted(data.data._id);
    } catch (err) {
      console.error(err);
      setStep('❌ אירעה שגיאה');
    }
  }, [location.state?.formData, location.state?.submissionId, waitUntilCompleted]);

  useEffect(() => {
    if (!location.state?.formData) {
      navigate('/create-book');
      return;
    }

    createBook();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [createBook, location.state, navigate]);

  return (
    <div className="book-loading">
      <Navbar variant="app" />
      <div className="loading-card">
        <div className="loading-spinner"></div>

        <h1>יוצר את הספר שלך</h1>

        <p>{step}</p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <span className="progress-text">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

export default BookLoading;
