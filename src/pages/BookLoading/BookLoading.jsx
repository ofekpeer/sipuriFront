import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  createBookRequest,
  getBookAssetUrl,
  getBookRequest,
} from '../../services/bookApi';
import Navbar from '../../components/navbar/Navbar';
import {
  getBookPreviewImageUrls,
  hasRenderableBookPreview,
} from '../bookViewer/bookViewerState';
import './BookLoading.css';

const POLL_INTERVAL_MS = 1200;
const IMAGE_PRELOAD_TIMEOUT_MS = 15000;

function preloadImage(url) {
  if (!url || typeof Image === 'undefined') return Promise.resolve(false);

  return new Promise((resolve) => {
    const image = new Image();
    let settled = false;

    function finish(result) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      resolve(result);
    }

    const timeout = setTimeout(
      () => finish(false),
      IMAGE_PRELOAD_TIMEOUT_MS,
    );

    image.onload = async () => {
      try {
        if (typeof image.decode === 'function') await image.decode();
      } catch {
        // A successful load is sufficient on browsers that reject decode()
        // after taking the image from their memory cache.
      }

      finish(true);
    };
    image.onerror = () => finish(false);
    image.src = getBookAssetUrl(url);
  });
}

async function preloadBookPreview(book) {
  const urls = getBookPreviewImageUrls(book);
  const results = await Promise.all(urls.map(preloadImage));
  return results.length === 3 && results.every(Boolean);
}

function BookLoading() {
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState('מכין את הספר שלך...');
  const [progress, setProgress] = useState(0);
  const pollTimeoutRef = useRef(null);
  const stoppedRef = useRef(false);
  const mountedRef = useRef(false);
  const creationStartedRef = useRef(false);

  const waitUntilCompleted = useCallback(
    (id) => {
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
      stoppedRef.current = false;

      async function poll() {
        let shouldPollAgain = true;

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
              if (!hasRenderableBookPreview(book)) {
                setProgress(96);
                setStep('✨ מסדר את העמודים האחרונים לתצוגה...');
                break;
              }

              setProgress(98);
              setStep('📖 פותח את הספר שלך...');

              if (await preloadBookPreview(book)) {
                shouldPollAgain = false;
                setProgress(100);
                setStep('✅ הספר מוכן!');

                if (!stoppedRef.current) {
                  navigate(`/book/${id}`, {
                    replace: true,
                    state: { justCreated: true },
                  });
                }
              } else {
                setStep('✨ טוען את האיורים באיכות מלאה...');
              }
              break;

            case 'failed':
              shouldPollAgain = false;
              setStep('❌ אירעה שגיאה ביצירת הספר');
              break;

            default:
              break;
          }
        } catch (err) {
          console.error(err);
          setStep('מתחבר מחדש לשרת וממשיך להכין את הספר...');
        }

        if (shouldPollAgain && !stoppedRef.current) {
          pollTimeoutRef.current = setTimeout(poll, POLL_INTERVAL_MS);
        }
      }

      poll();
    },
    [navigate],
  );

  const createBook = useCallback(async () => {
    try {
      const data = await createBookRequest(
        location.state.formData,
        location.state.submissionId,
      );
      if (!mountedRef.current) return;
      waitUntilCompleted(data.data._id);
    } catch (err) {
      console.error(err);
      setStep('❌ אירעה שגיאה');
    }
  }, [location.state?.formData, location.state?.submissionId, waitUntilCompleted]);

  useEffect(() => {
    mountedRef.current = true;
    stoppedRef.current = false;

    if (!location.state?.formData) {
      navigate('/create-book');
      return;
    }

    if (creationStartedRef.current) return;
    creationStartedRef.current = true;
    createBook();

    return () => {
      mountedRef.current = false;
      stoppedRef.current = true;
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
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
