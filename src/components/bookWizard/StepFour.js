import { useBook } from '../../context/BookContext';

function StepFour() {
  const {
    formData,

    updateField,

    nextStep,

    prevStep,
  } = useBook();

  function handleImage(e) {
    const file = e.target.files[0];

    if (!file) return;

    updateField(
      'child',

      'image',

      file,
    );
  }

  return (
    <>
      <h2>העלה תמונה של הילד 📸</h2>

      <p className="step-description">
        תמונה ברורה תעזור ל-AI ליצור איורים מדויקים יותר — אבל גם אפשר להמשיך
        בלי תמונה.
      </p>

      <div className="upload-box">
        <input type="file" accept="image/*" onChange={handleImage} />

        {formData.child.image ? (
          <p>✅ {formData.child.image.name}</p>
        ) : (
          <p>בחר תמונה מהמחשב</p>
        )}
      </div>

      <div className="wizard-buttons">
        <button className="back-btn" onClick={prevStep}>
          ← הקודם
        </button>

        <button className="next-btn" onClick={nextStep}>
          הבא →
        </button>
      </div>
    </>
  );
}

export default StepFour;
