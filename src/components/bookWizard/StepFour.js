import { useEffect, useState } from 'react';

import { useBook } from '../../context/BookContext';
import ImageCropEditor from './ImageCropEditor';
import { cropBookImage, prepareBookImage } from '../../utils/prepareBookImage';

function formatFileSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function StepFour() {
  const {
    formData,
    updateField,
    nextStep,
    prevStep,
  } = useBook();
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [optimized, setOptimized] = useState(false);
  const [cropTarget, setCropTarget] = useState(null);
  const hasImage = Boolean(formData.child.image && previewUrl);

  useEffect(() => {
    if (!formData.child.image) {
      setPreviewUrl('');
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(formData.child.image);
    setPreviewUrl(nextPreviewUrl);
    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [formData.child.image]);

  async function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setImageError('');

    try {
      const prepared = await prepareBookImage(file);
      setCropTarget({ file: prepared.file, optimized: prepared.optimized });
      event.target.value = '';
    } catch (error) {
      event.target.value = '';
      setImageError(error.message || 'לא הצלחנו להכין את התמונה.');
    } finally {
      setProcessing(false);
    }
  }

  function removeImage() {
    updateField('child', 'image', null);
    setPreviewUrl('');
    setOptimized(false);
    setImageError('');
  }

  async function applyCrop(crop) {
    if (!cropTarget) return;

    setProcessing(true);
    setImageError('');

    try {
      const croppedImage = await cropBookImage(cropTarget.file, crop);
      const prepared = await prepareBookImage(croppedImage);
      updateField('child', 'image', prepared.file);
      setOptimized(cropTarget.optimized || prepared.optimized);
      setCropTarget(null);
    } catch (error) {
      setImageError(error.message || 'לא הצלחנו לשמור את החיתוך. נסו שוב.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="photo-step">
      <section className="wizard-choice-intro photo-step__intro">
        <div>
          <span className="wizard-step-kicker">שלב 4 · הפנים מאחורי הסיפור</span>
          <h2>
            הופכים את הדמות
            {' '}
            <span>לאישית באמת</span>
          </h2>
          <p>
            תמונה ברורה עוזרת לנו לשמור על המאפיינים המיוחדים של הילד או הילדה בכל האיורים.
          </p>
        </div>

        <aside className={`wizard-selection-glance ${hasImage ? 'has-selection' : ''}`}>
          <span>{hasImage ? 'התמונה מוכנה' : 'טיפ לתוצאה מעולה'}</span>
          <strong>{hasImage ? '✓ מצאנו את הכוכב' : 'פנים ברורות, חיוך טבעי'}</strong>
          <small>
            {hasImage
              ? 'אפשר לערוך שוב את החיתוך או להמשיך לסיכום.'
              : 'מומלץ לבחור תמונה של אדם אחד, מול המצלמה ובתאורה טובה.'}
          </small>
        </aside>
      </section>

      <section className="photo-step__workspace">
        <div className="photo-step__workspace-heading">
          <div>
            <span aria-hidden="true">📸</span>
            <div>
              <h3>{hasImage ? 'התמונה שבחרתם' : 'העלאת תמונת ייחוס'}</h3>
              <p>{hasImage ? 'כך היא תיחתך לפני שתישלח ליצירת האיורים.' : 'לאחר הבחירה תוכלו להזיז, להגדיל ולחתוך אותה.'}</p>
            </div>
          </div>
          <span className="photo-step__optional">אופציונלי, אבל מומלץ</span>
        </div>

        <div className={`upload-card ${hasImage ? 'has-image' : ''}`}>
          {hasImage ? (
            <div className="upload-preview">
              <div className="upload-preview__image">
                <img src={previewUrl} alt="התמונה שנבחרה עבור הספר" />
                <span aria-hidden="true">מוכן לאיור ✨</span>
              </div>
              <div className="upload-preview__details">
                <span className="upload-preview__success">✓ התמונה נשמרה בהצלחה</span>
                <strong>{formData.child.image.name}</strong>
                <span>{formatFileSize(formData.child.image.size)}</span>
                {optimized ? <em>התמונה הותאמה אוטומטית להעלאה מהירה</em> : null}
                <div className="upload-preview__actions">
                  <button
                    type="button"
                    onClick={() => setCropTarget({ file: formData.child.image, optimized })}
                  >
                    ✂️ עריכת החיתוך
                  </button>
                  <button type="button" onClick={removeImage}>↻ בחירת תמונה אחרת</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="upload-card__empty">
              <div className="upload-card__icon" aria-hidden="true">📷</div>
              <strong>{processing ? 'מכינים את התמונה...' : 'גררו תמונה לכאן או בחרו מהמכשיר'}</strong>
              <span>JPG, PNG או WebP · עד 25MB</span>
              <label className="upload-select-button">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleImage}
                  disabled={processing}
                />
                {processing ? (
                  <>
                    <span className="button-spinner" aria-hidden="true" />
                    מעבדים את התמונה...
                  </>
                ) : (
                  <>בחירת תמונה <span aria-hidden="true">←</span></>
                )}
              </label>
              <small>לא מעלים תמונה לפני שאתם בוחרים ומאשרים אותה.</small>
            </div>
          )}
        </div>

        {imageError ? <p className="field-error" role="alert">{imageError}</p> : null}

        <div className="photo-guidelines" aria-label="טיפים לבחירת תמונה">
          <div>
            <span>✓</span>
            <p><strong>פנים מול המצלמה</strong>ללא משקפי שמש או הסתרה</p>
          </div>
          <div>
            <span>✓</span>
            <p><strong>תאורה טבעית</strong>בלי צל כבד על הפנים</p>
          </div>
          <div>
            <span>✓</span>
            <p><strong>אדם אחד בתמונה</strong>כדי שנזהה את הדמות הנכונה</p>
          </div>
        </div>

        <div className="photo-step__skip-note">
          <span aria-hidden="true">💡</span>
          <div>
            <strong>מעדיפים להמשיך בלי תמונה?</strong>
            <p>אפשר בהחלט. הדמות תהיה כללית ותיבנה לפי הגיל ולשון הפנייה שבחרתם.</p>
          </div>
        </div>
      </section>

      <div className="wizard-step-footer">
        <button type="button" className="back-btn" onClick={prevStep}>
          <span aria-hidden="true">→</span>
          הקודם
        </button>

        <div className="wizard-step-footer__status">
          <span aria-hidden="true">{hasImage ? '✓' : '4'}</span>
          <div>
            <strong>{hasImage ? 'התמונה מוכנה' : 'אפשר גם בלי תמונה'}</strong>
            <small>{hasImage ? 'נשאר רק לעבור על הפרטים' : 'תמיד אפשר לחזור ולהוסיף'}</small>
          </div>
        </div>

        <button type="button" className="next-btn" onClick={nextStep} disabled={processing}>
          {hasImage ? 'התמונה נראית מעולה' : 'המשך ללא תמונה'}
          <span aria-hidden="true">←</span>
        </button>
      </div>

      {cropTarget ? (
        <ImageCropEditor
          file={cropTarget.file}
          onCancel={() => setCropTarget(null)}
          onApply={applyCrop}
        />
      ) : null}
    </div>
  );
}

export default StepFour;
