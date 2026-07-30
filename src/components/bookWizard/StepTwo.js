import { useBook } from '../../context/BookContext';
import dinosaursImage from '../../assets/bookWizard/adventures/dinosaurs.jpg';
import magicImage from '../../assets/bookWizard/adventures/magic.jpg';
import piratesImage from '../../assets/bookWizard/adventures/pirates.jpg';
import spaceImage from '../../assets/bookWizard/adventures/space.jpg';

function StepTwo() {
  const {
    formData,

    updateField,

    nextStep,

    prevStep,
  } = useBook();

  const stories = [
    {
      icon: '🚀',
      title: 'חלל',
      value: 'space',
      description: 'כוכבים, רובוטים ועולמות חדשים',
      image: spaceImage,
    },

    {
      icon: '🦖',
      title: 'דינוזאורים',
      value: 'dinosaurs',
      description: 'מסע פרהיסטורי ידידותי ומלא גילויים',
      image: dinosaursImage,
    },

    {
      icon: '🧙',
      title: 'קסמים',
      value: 'magic',
      description: 'טירות, דרקונים ויער מכושף',
      image: magicImage,
    },

    {
      icon: '🏴‍☠️',
      title: 'פיראטים',
      value: 'pirates',
      description: 'מפת אוצר והרפתקה בלב הים',
      image: piratesImage,
    },
  ];

  return (
    <>
      <span className="wizard-step-kicker">שלב 2 · בוחרים עולם</span>
      <h2>בחרו את סוג ההרפתקה 🚀</h2>

      <p className="step-description">
        כל אפשרות נותנת לסיפור אווירה אחרת — בחרו את זו שהכי נוגעת ללב.
      </p>

      <div className="cards-grid">
        {stories.map((story) => (
          <button
            type="button"
            key={story.value}
            className={`story-card adventure-choice ${
              formData.story.type === story.value ? 'selected' : ''
            }`}
            aria-pressed={formData.story.type === story.value}
            onClick={() => updateField('story', 'type', story.value)}
          >
            <img src={story.image} alt="" decoding="async" />
            <span className="adventure-choice__shade" aria-hidden="true" />
            <span className="adventure-choice__check" aria-hidden="true">✓</span>
            <div className="adventure-choice__content">
              <span className="adventure-choice__icon" aria-hidden="true">{story.icon}</span>
              <div>
                <h3>{story.title}</h3>
                <p>{story.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="wizard-buttons">
        <button type="button" className="back-btn" onClick={prevStep}>
          ← הקודם
        </button>

        <button type="button" className="next-btn" onClick={nextStep} disabled={!formData.story.type}>
          הבא →
        </button>
      </div>
    </>
  );
}

export default StepTwo;
