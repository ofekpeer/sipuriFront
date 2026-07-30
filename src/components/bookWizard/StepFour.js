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
    <>
      <span className="wizard-step-kicker">שלב 4 · התמונה האישית</span>
      <h2>בחרו תמונה ברורה 📸</h2>

      <p className="step-description">
        התמונה משמשת רק כנקודת ייחוס לדמות המאוירת. פנים ברורות ותאורה טבעית
        יעזרו לנו ליצור תוצאה דומה ונעימה יותר.
      </p>

      <div className={`upload-card ${formData.child.image && previewUrl ? 'has-image' : ''}`}>
        {formData.child.image && previewUrl ? (
          <div className="upload-preview">
            <img src={previewUrl} alt="התמונה שנבחרה עבור הספר" />
            <div className="upload-preview__details">
              <strong>{formData.child.image.name}</strong>
              <span>{formatFileSize(formData.child.image.size)}</span>
              {optimized ? <em>התמונה הותאמה אוטומטית להעלאה מהירה</em> : null}
              <div className="upload-preview__actions">
                <button type="button" onClick={() => setCropTarget({ file: formData.child.image, optimized })}>עריכת החיתוך</button>
                <button type="button" onClick={removeImage}>בחירת תמונה אחרת</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="upload-card__icon" aria-hidden="true">📷</div>
            <strong>{processing ? 'מכינים את התמונה...' : 'לחצו לבחירת תמונה'}</strong>
            <span>JPG, PNG או WebP · עד 25MB</span>
            <label className="upload-select-button">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleImage}
                disabled={processing}
              />
              {processing ? 'מעבד...' : 'בחירת תמונה'}
            </label>
          </>
        )}
      </div>

      {imageError ? <p className="field-error" role="alert">{imageError}</p> : null}

      <div className="photo-guidelines" aria-label="טיפים לבחירת תמונה">
        <div><span>✓</span><p><strong>פנים מול המצלמה</strong>ללא משקפי שמש או הסתרה</p></div>
        <div><span>✓</span><p><strong>תאורה טובה</strong>בלי צל כבד על הפנים</p></div>
        <div><span>✓</span><p><strong>אדם אחד בתמונה</strong>כדי שנזהה את הדמות הנכונה</p></div>
      </div>

      <p className="optional-note">
        אפשר להמשיך בלי תמונה, אבל הדמות תהיה כללית ולא תתבסס על מראה הילד.
      </p>

      <div className="wizard-buttons">
        <button type="button" className="back-btn" onClick={prevStep}>
          ← הקודם
        </button>

        <button type="button" className="next-btn" onClick={nextStep} disabled={processing}>
          {formData.child.image ? 'התמונה נראית טוב, ממשיכים →' : 'המשך ללא תמונה →'}
        </button>
      </div>

      {cropTarget ? (
        <ImageCropEditor
          file={cropTarget.file}
          onCancel={() => setCropTarget(null)}
          onApply={applyCrop}
        />
      ) : null}
    </>
  );
}

export default StepFour;
