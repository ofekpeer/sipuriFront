import { useBook } from '../../context/BookContext';
import illustrationStylesSprite from '../../assets/bookWizard/illustrationStyles/illustration-styles-sprite.png';

function StepThree() {
  const {
    formData,

    updateField,

    nextStep,

    prevStep,
  } = useBook();

  const styles = [
    {
      title: 'דיסני',
      value: 'disney',
      previewClass: 'disney',
      icon: '🏰',
      description: 'אגדה צבעונית, רכה ומלאת קסם',
    },

    {
      title: 'פיקסאר',
      value: 'pixar',
      previewClass: 'pixar',
      icon: '🎬',
      description: 'דמויות תלת־ממדיות חמות והבעות עשירות',
    },

    {
      title: 'צבעי מים',
      value: 'watercolor',
      previewClass: 'watercolor',
      icon: '🎨',
      description: 'איור עדין בעבודת יד וצבעים רכים',
    },

    {
      title: 'קומיקס',
      value: 'comic',
      previewClass: 'comic',
      icon: '📚',
      description: 'קווים נועזים, תנועה ואנרגיה',
    },
  ];

  return (
    <>
      <span className="wizard-step-kicker">שלב 3 · בוחרים מראה</span>
      <h2>בחרו את סגנון האיור 🎨</h2>

      <p className="step-description">
        זה ישפיע על המראה של כל הדמויות והדפים בספר.
      </p>

      <div className="cards-grid">
        {styles.map((style) => (
          <button
            type="button"
            key={style.value}
            className={`story-card illustration-style-card ${
              formData.design.illustrationStyle === style.value
                ? 'selected'
                : ''
            }`}
            aria-pressed={formData.design.illustrationStyle === style.value}
            onClick={() => updateField('design', 'illustrationStyle', style.value)}
          >
            <span className={`illustration-style-card__preview illustration-style-card__preview--${style.previewClass}`} aria-hidden="true">
              <img src={illustrationStylesSprite} alt="" decoding="async" />
            </span>

            <span className="illustration-style-card__shade" aria-hidden="true" />
            <span className="illustration-style-card__check" aria-hidden="true">✓</span>

            <span className="illustration-style-card__content">
              <h3>{style.title}</h3>
              <p>{style.description}</p>
            </span>
          </button>
        ))}
      </div>

      <div className="wizard-buttons">
        <button type="button" className="back-btn" onClick={prevStep}>
          ← הקודם
        </button>

        <button type="button" className="next-btn" onClick={nextStep} disabled={!formData.design.illustrationStyle}>
          הבא →
        </button>
      </div>
    </>
  );
}

export default StepThree;
