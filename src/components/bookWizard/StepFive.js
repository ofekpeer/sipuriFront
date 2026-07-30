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

const storyIcons = {
  space: '🚀',
  dinosaurs: '🦕',
  magic: '🪄',
  pirates: '🏴‍☠️',
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

  const childName = formData.child.name.trim();
  const storyName = storyNames[formData.story.type];
  const storyIcon = storyIcons[formData.story.type] || '✨';
  const styleName = styleNames[formData.design.illustrationStyle];
  const avatarLetter = childName ? Array.from(childName)[0] : '✨';

  function validateBeforeSubmit() {
    const age = Number(formData.child.age);
    if (
      !childName
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
    <div className="final-step">
      <section className="final-step__hero">
        <div className="final-step__heading">
          <span className="wizard-step-kicker">שלב 5 · בדיקה אחרונה</span>
          <h2>
            הסיפור של
            {' '}
            <span>{childName || 'הכוכב שלנו'}</span>
            {' '}
            מוכן לצאת לדרך
          </h2>
          <p>
            עברו עוד פעם אחת על הבחירות. לאחר הלחיצה הספר יופיע בספרייה והקסם ימשיך להיווצר ברקע.
          </p>
          <div className="final-step__ready-badge">
            <span aria-hidden="true">✓</span>
            כל הפרטים הדרושים מוכנים
          </div>
        </div>

        <aside className="final-book-preview" aria-label="תצוגת סיכום הספר">
          <span className="final-book-preview__shine" aria-hidden="true">✦</span>
          <span className="final-book-preview__genre">{storyIcon} {storyName}</span>
          <div className="final-book-preview__avatar">{avatarLetter}</div>
          <strong>{childName}</strong>
          <small>וההרפתקה הגדולה בעולם ה{storyName}</small>
          <span className="final-book-preview__style">מאויר בסגנון {styleName}</span>
        </aside>
      </section>

      <section className="final-step__review">
        <div className="final-step__review-heading">
          <div>
            <span aria-hidden="true">🔎</span>
            <div>
              <h3>הכול נראה נכון?</h3>
              <p>לחצו על עריכה ליד כל חלק שתרצו לשנות.</p>
            </div>
          </div>
          <span>4 מתוך 4 חלקים מוכנים</span>
        </div>

        <div className="review-grid review-grid--polished">
          <section className="review-card review-card--hero">
            <div className="review-card__header">
              <span>👋 פרטי הגיבור</span>
              <button type="button" onClick={() => goToStep(1)}>עריכה</button>
            </div>
            <div className="review-card__avatar-row">
              <span>{avatarLetter}</span>
              <div>
                <strong>{childName}</strong>
                <small>{genderNames[formData.child.gender]} · גיל {formData.child.age}</small>
              </div>
            </div>
            <div className="review-card__hobbies">
              <span>הדברים האהובים</span>
              <strong>{formData.story.hobbies}</strong>
            </div>
          </section>

          <section className="review-card review-card--choice">
            <div className="review-card__header">
              <span>🚀 ההרפתקה</span>
              <button type="button" onClick={() => goToStep(2)}>עריכה</button>
            </div>
            <div className="review-card__choice-value">
              <span aria-hidden="true">{storyIcon}</span>
              <div>
                <strong>{storyName || 'לא נבחרה הרפתקה'}</strong>
                <small>העולם שבו הסיפור יתרחש</small>
              </div>
            </div>
          </section>

          <section className="review-card review-card--choice">
            <div className="review-card__header">
              <span>🎨 סגנון האיור</span>
              <button type="button" onClick={() => goToStep(3)}>עריכה</button>
            </div>
            <div className="review-card__choice-value">
              <span aria-hidden="true">🖼️</span>
              <div>
                <strong>{styleName || 'לא נבחר סגנון'}</strong>
                <small>המראה שיוביל את כל עמודי הספר</small>
              </div>
            </div>
          </section>

          <section className="review-card review-card--photo">
            <div className="review-card__header">
              <span>📸 תמונת הייחוס</span>
              <button type="button" onClick={() => goToStep(4)}>עריכה</button>
            </div>
            <div className="review-card__photo-value">
              <span aria-hidden="true">{formData.child.image ? '✓' : '○'}</span>
              <div>
                <strong>{formData.child.image ? 'התמונה מוכנה' : 'ללא תמונה'}</strong>
                <small>
                  {formData.child.image
                    ? formData.child.image.name
                    : 'הדמות תיווצר לפי הפרטים שמילאתם'}
                </small>
              </div>
            </div>
          </section>
        </div>
      </section>

      <div className="creation-expectation creation-expectation--polished">
        <span aria-hidden="true">✨</span>
        <div>
          <strong>אין צורך להישאר במסך המתנה</strong>
          <p>הספר יופיע מיד בספרייה ויתעדכן שם אוטומטית בזמן שהסיפור והאיורים נוצרים.</p>
        </div>
        <span className="creation-expectation__steps">סיפור ← כריכה ← עמודים</span>
      </div>

      {submitError ? <p className="book-submit-error" role="alert">{submitError}</p> : null}

      <div className="wizard-step-footer final-step__actions">
        <button type="button" className="back-btn" onClick={prevStep} disabled={submitting}>
          <span aria-hidden="true">→</span>
          הקודם
        </button>

        <div className="wizard-step-footer__status">
          <span aria-hidden="true">5</span>
          <div>
            <strong>השלב האחרון</strong>
            <small>מכאן הספר עובר לספרייה שלכם</small>
          </div>
        </div>

        <button
          type="button"
          className="next-btn create-book-btn"
          onClick={createBook}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="button-spinner" aria-hidden="true" />
              שומרים ומתחילים...
            </>
          ) : (
            <>
              <span aria-hidden="true">✨</span>
              התחילו ליצור את הספר
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default StepFive;
