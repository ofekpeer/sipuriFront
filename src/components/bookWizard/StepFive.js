import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBook } from '../../context/BookContext';
import { createBookRequest } from '../../services/bookApi';

function StepFive() {
  const { formData, prevStep } = useBook();

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const storyNames = {
    space: 'חלל',
    dinosaurs: 'דינוזאורים',
    magic: 'קסמים',
    pirates: 'פיראטים',
  };

  const styleNames = {
    disney: 'דיסני',
    pixar: 'פיקסאר',
    watercolor: 'צבעי מים',
    comic: 'קומיקס',
  };

  async function createBook() {
    if (submitting) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await createBookRequest(formData, crypto.randomUUID());

      navigate('/library', {
        replace: true,
        state: {
          queuedBookId: response.data._id,
          bookQueued: true,
        },
      });
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || 'לא הצלחנו להתחיל את יצירת הספר');
      setSubmitting(false);
    }
  }

  return (
    <>
      <h2>הכול מוכן! 🎉</h2>

      <p>בדקו שכל הפרטים נכונים לפני יצירת הספר.</p>

      <div className="summary">
        <h3>שם: {formData.child.name || '-'}</h3>

        <h3>גיל: {formData.child.age || '-'}</h3>

        <h3>מין: {formData.child.gender || '-'}</h3>

        <h3>תחביבים: {formData.story.hobbies || '-'}</h3>

        <h3>הרפתקה: {storyNames[formData.story.type] || '-'}</h3>

        <h3>
          סגנון איור: {styleNames[formData.design.illustrationStyle] || '-'}
        </h3>

        <h3>תמונה: {formData.child.image ? '✅ הועלתה' : '❌ לא הועלתה'}</h3>
      </div>

      {submitError && <p className="book-submit-error" role="alert">{submitError}</p>}

      <div className="wizard-buttons">
        <button className="back-btn" onClick={prevStep}>
          ← הקודם
        </button>

        <button className="next-btn" onClick={createBook} disabled={submitting}>
          {submitting ? 'שומר ומתחיל ליצור...' : '✨ צור את הספר'}
        </button>
      </div>
    </>
  );
}

export default StepFive;
