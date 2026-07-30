import { useBook } from '../../context/BookContext';
import disneyPreview from '../../assets/bookWizard/illustrationStyles/disney.png';
import pixarPreview from '../../assets/bookWizard/illustrationStyles/pixar.png';
import watercolorPreview from '../../assets/bookWizard/illustrationStyles/watercolor.png';
import comicPreview from '../../assets/bookWizard/illustrationStyles/comic.png';

const illustrationStyles = [
  {
    title: 'דיסני',
    value: 'disney',
    image: disneyPreview,
    icon: '🏰',
    description: 'אגדה צבעונית, רכה ומלאת קסם',
    detail: 'מראה חלומי עם דמויות אגדתיות',
    accent: '#9d6ee8',
  },
  {
    title: 'פיקסאר',
    value: 'pixar',
    image: pixarPreview,
    icon: '🎬',
    description: 'דמויות תלת־ממדיות חמות והבעות עשירות',
    detail: 'עולם קולנועי, חי ומלא רגש',
    accent: '#5aa6e8',
  },
  {
    title: 'צבעי מים',
    value: 'watercolor',
    image: watercolorPreview,
    icon: '🎨',
    description: 'איור עדין בעבודת יד וצבעים רכים',
    detail: 'תחושה קלאסית של ספר ילדים מצויר',
    accent: '#55aa9e',
  },
  {
    title: 'קומיקס',
    value: 'comic',
    image: comicPreview,
    icon: '💥',
    description: 'קווים נועזים, תנועה ואנרגיה',
    detail: 'פריימים סוחפים כמו הרפתקת־על',
    accent: '#ef8b4a',
  },
];

function StepThree() {
  const {
    formData,
    updateField,
    nextStep,
    prevStep,
  } = useBook();

  const selectedStyle = illustrationStyles.find(
    (style) => style.value === formData.design.illustrationStyle,
  );

  return (
    <div className="wizard-choice-page illustration-step">
      <section className="wizard-choice-intro">
        <div>
          <span className="wizard-step-kicker">שלב 3 · בוחרים מראה</span>
          <h2>
            איך העולם של הסיפור
            {' '}
            <span>ייראה?</span>
          </h2>
          <p>
            סגנון האיור ישפיע על הדמות, הצבעים והאווירה של כל עמוד. כל התמונות מציגות את אותו עולם כדי שיהיה קל להרגיש את ההבדל.
          </p>
        </div>

        <aside className={`wizard-selection-glance ${selectedStyle ? 'has-selection' : ''}`}>
          <span>סגנון האיור הנבחר</span>
          <strong>
            {selectedStyle ? `${selectedStyle.icon} ${selectedStyle.title}` : 'בחרו את המראה שלכם'}
          </strong>
          <small>
            {selectedStyle?.detail || 'אפשר לעבור בין הכרטיסים ולבחור את הסגנון שהכי מתאים לסיפור.'}
          </small>
        </aside>
      </section>

      <div className="cards-grid wizard-visual-grid">
        {illustrationStyles.map((style, index) => {
          const isSelected = formData.design.illustrationStyle === style.value;

          return (
            <button
              type="button"
              key={style.value}
              className={`story-card illustration-style-card ${isSelected ? 'selected' : ''}`}
              style={{ '--choice-accent': style.accent }}
              aria-pressed={isSelected}
              onClick={() => updateField('design', 'illustrationStyle', style.value)}
            >
              <span className="illustration-style-card__preview">
                <img
                  src={style.image}
                  alt={`דוגמה לסגנון ${style.title}`}
                  decoding="async"
                />
              </span>
              <span className="illustration-style-card__shade" aria-hidden="true" />
              <span className="wizard-choice-number" aria-hidden="true">0{index + 1}</span>
              <span className="illustration-style-card__check" aria-hidden="true">✓</span>

              <span className="illustration-style-card__content">
                <span className="illustration-style-card__icon" aria-hidden="true">{style.icon}</span>
                <span>
                  <h3>{style.title}</h3>
                  <p>{style.description}</p>
                </span>
              </span>
              <span className="wizard-choice-cta" aria-hidden="true">
                {isSelected ? 'זה הסגנון שלנו' : 'בחירת הסגנון'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="wizard-step-footer">
        <button type="button" className="back-btn" onClick={prevStep}>
          <span aria-hidden="true">→</span>
          הקודם
        </button>

        <div className="wizard-step-footer__status">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>{selectedStyle?.title || 'בחרו סגנון אחד'}</strong>
            <small>{selectedStyle?.detail || 'הבחירה תקבע את מראה כל הספר'}</small>
          </div>
        </div>

        <button type="button" className="next-btn" onClick={nextStep} disabled={!selectedStyle}>
          ממשיכים לתמונה
          <span aria-hidden="true">←</span>
        </button>
      </div>
    </div>
  );
}

export default StepThree;
