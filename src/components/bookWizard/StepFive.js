import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useBook } from '../../context/BookContext';
import { createBookRequest } from '../../services/bookApi';

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

const genderNames = {
  boy: 'בן',
  girl: 'בת',
};

function StepFive() {
  const {
    formData,
    submissionId,
    prevStep,
    goToStep,
    resetBook,
  } = useBook();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  function validateBeforeSubmit() {
    const age = Number(formData.child.age);
    if (
      !formData.child.name.trim()
      || !Number.isInteger(age)
      || age < 1
      || age > 12
      || !formData.child.gender
      || !formData.story.hobbies.trim()
    ) {
      goToStep(1);
      return 'חסרים פרטים על גיבור הסיפור. השלימו אותם לפני היצירה.';
    }

    if (!formData.story.type) {
      goToStep(2);
      return 'בחרו הרפתקה לפני יצירת הספר.';
    }

    if (!formData.design.illustrationStyle) {
      goToStep(3);
      return 'בחרו סגנון איור לפני יצירת הספר.';
    }

    return '';
  }

  async function createBook() {
    if (submitting) return;

    const validationError = validateBeforeSubmit();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await createBookRequest(formData, submissionId);
      const queuedBookId = response.data._id;
      resetBook();

      navigate('/library', {
        replace: true,
        state: {
          queuedBookId,
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
      <span className="wizard-step-kicker">שלב 5 · בדיקה אחרונה</span>
      <h2>הכול מוכן ליצירת הקסם 🎉</h2>
      <p className="step-description">
        עברו על הפרטים. אחרי הלחיצה הספר יתחיל להיווצר ברקע ותוכלו להמשיך
        להשתמש באתר.
      </p>

      <div className="review-grid">
        <section className="review-card">
          <div className="review-card__header">
            <span>👋 פרטי הגיבור</span>
            <button type="button" onClick={() => goToStep(1)}>עריכה</button>
          </div>
          <dl>
            <div><dt>שם</dt><dd>{formData.child.name || '-'}</dd></div>
            <div><dt>גיל</dt><dd>{formData.child.age || '-'}</dd></div>
            <div><dt>לשון פנייה</dt><dd>{genderNames[formData.child.gender] || '-'}</dd></div>
            <div><dt>תחביבים</dt><dd>{formData.story.hobbies || '-'}</dd></div>
          </dl>
        </section>

        <section className="review-card">
          <div className="review-card__header">
            <span>🚀 ההרפתקה</span>
            <button type="button" onClick={() => goToStep(2)}>עריכה</button>
          </div>
          <strong>{storyNames[formData.story.type] || 'לא נבחרה הרפתקה'}</strong>
        </section>

        <section className="review-card">
          <div className="review-card__header">
            <span>🎨 סגנון האיור</span>
            <button type="button" onClick={() => goToStep(3)}>עריכה</button>
          </div>
          <strong>{styleNames[formData.design.illustrationStyle] || 'לא נבחר סגנון'}</strong>
        </section>

        <section className="review-card">
          <div className="review-card__header">
            <span>📸 תמונת הייחוס</span>
            <button type="button" onClick={() => goToStep(4)}>עריכה</button>
          </div>
          <strong>{formData.child.image ? `נבחרה: ${formData.child.image.name}` : 'ללא תמונה'}</strong>
        </section>
      </div>

      <div className="creation-expectation">
        <span aria-hidden="true">✨</span>
        <div>
          <strong>אין צורך להישאר במסך המתנה</strong>
          <p>הספר יופיע מיד בספרייה ויתעדכן שם אוטומטית בזמן שהסיפור והאיורים נוצרים.</p>
        </div>
      </div>

      {submitError ? <p className="book-submit-error" role="alert">{submitError}</p> : null}

      <div className="wizard-buttons">
        <button type="button" className="back-btn" onClick={prevStep} disabled={submitting}>
          ← הקודם
        </button>

        <button type="button" className="next-btn create-book-btn" onClick={createBook} disabled={submitting}>
          {submitting ? (
            <>
              <span className="button-spinner" aria-hidden="true" />
              שומרים ומתחילים...
            </>
          ) : '✨ התחילו ליצור את הספר'}
        </button>
      </div>
    </>
  );
}

export default StepFive;
