import { useBook } from '../../context/BookContext';

function StepThree() {
  const {
    formData,

    handleInputChange,

    nextStep,

    prevStep,
  } = useBook();

  const styles = [
    {
      title: 'דיסני',
      value: 'disney',
      icon: '🏰',
    },

    {
      title: 'פיקסאר',
      value: 'pixar',
      icon: '🎬',
    },

    {
      title: 'צבעי מים',
      value: 'watercolor',
      icon: '🎨',
    },

    {
      title: 'קומיקס',
      value: 'comic',
      icon: '📚',
    },
  ];

  return (
    <>
      <h2>בחר את סגנון האיור 🎨</h2>

      <p className="step-description">
        זה ישפיע על המראה של כל הדמויות והדפים בספר.
      </p>

      <div className="cards-grid">
        {styles.map((style) => (
          <div
            key={style.value}
            className={`story-card ${
              formData.design.illustrationStyle === style.value
                ? 'selected'
                : ''
            }`}
            onClick={() =>
              handleInputChange({
                target: {
                  name: 'design.illustrationStyle',

                  value: style.value,
                },
              })
            }
          >
            <span>{style.icon}</span>

            <h3>{style.title}</h3>
          </div>
        ))}
      </div>

      <div className="wizard-buttons">
        <button className="back-btn" onClick={prevStep}>
          ← הקודם
        </button>

        <button className="next-btn" onClick={nextStep} disabled={!formData.design.illustrationStyle}>
          הבא →
        </button>
      </div>
    </>
  );
}

export default StepThree;
