import { useBook } from '../../context/BookContext';
import dinosaursImage from '../../assets/bookWizard/adventures/dinosaurs.jpg';
import magicImage from '../../assets/bookWizard/adventures/magic.jpg';
import piratesImage from '../../assets/bookWizard/adventures/pirates.jpg';
import spaceImage from '../../assets/bookWizard/adventures/space.jpg';

const stories = [
  {
    icon: '🚀',
    title: 'חלל',
    value: 'space',
    description: 'כוכבים, רובוטים ועולמות חדשים',
    detail: 'מסע מלא דמיון אל מעבר לכוכבים',
    image: spaceImage,
    accent: '#7568ff',
  },
  {
    icon: '🦕',
    title: 'דינוזאורים',
    value: 'dinosaurs',
    description: 'חברים ענקיים ותגליות פרהיסטוריות',
    detail: 'הרפתקה אמיצה בעולם קדום ומופלא',
    image: dinosaursImage,
    accent: '#51a875',
  },
  {
    icon: '🪄',
    title: 'קסמים',
    value: 'magic',
    description: 'טירות, לחשים ויצורים מכושפים',
    detail: 'עולם קסום שבו הכול יכול לקרות',
    image: magicImage,
    accent: '#a257d8',
  },
  {
    icon: '🏴‍☠️',
    title: 'פיראטים',
    value: 'pirates',
    description: 'מפת אוצר והרפתקה בלב הים',
    detail: 'מסע נועז בין איים ואוצרות סודיים',
    image: piratesImage,
    accent: '#e68a42',
  },
];

function StepTwo() {
  const {
    formData,
    updateField,
    nextStep,
    prevStep,
  } = useBook();

  const selectedStory = stories.find(
    (story) => story.value === formData.story.type,
  );

  return (
    <div className="wizard-choice-page adventure-step">
      <section className="wizard-choice-intro">
        <div>
          <span className="wizard-step-kicker">שלב 2 · בוחרים עולם</span>
          <h2>
            לאיזו הרפתקה
            {' '}
            <span>יוצאים הפעם?</span>
          </h2>
          <p>
            כל עולם יוצר סיפור אחר לגמרי. בחרו את ההרפתקה שתגרום לילד או לילדה לרצות לקפוץ ישר לתוך הספר.
          </p>
        </div>

        <aside className={`wizard-selection-glance ${selectedStory ? 'has-selection' : ''}`}>
          <span>{selectedStory ? 'העולם שבחרתם' : 'מחכים לבחירה שלכם'}</span>
          <strong>
            {selectedStory ? `${selectedStory.icon} ${selectedStory.title}` : 'ארבע הרפתקאות מחכות'}
          </strong>
          <small>
            {selectedStory?.detail || 'לחצו על אחד הכרטיסים וגלו לאן הסיפור יכול להגיע.'}
          </small>
        </aside>
      </section>

      <div className="cards-grid wizard-visual-grid">
        {stories.map((story, index) => {
          const isSelected = formData.story.type === story.value;

          return (
            <button
              type="button"
              key={story.value}
              className={`story-card adventure-choice ${isSelected ? 'selected' : ''}`}
              style={{ '--choice-accent': story.accent }}
              aria-pressed={isSelected}
              onClick={() => updateField('story', 'type', story.value)}
            >
              <img src={story.image} alt={`הרפתקת ${story.title}`} decoding="async" />
              <span className="adventure-choice__shade" aria-hidden="true" />
              <span className="wizard-choice-number" aria-hidden="true">0{index + 1}</span>
              <span className="adventure-choice__check" aria-hidden="true">✓</span>
              <div className="adventure-choice__content">
                <span className="adventure-choice__icon" aria-hidden="true">{story.icon}</span>
                <div>
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                </div>
              </div>
              <span className="wizard-choice-cta" aria-hidden="true">
                {isSelected ? 'ההרפתקה נבחרה' : 'בחירת ההרפתקה'}
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
          <span aria-hidden="true">{selectedStory ? '✓' : '2'}</span>
          <div>
            <strong>{selectedStory ? `${selectedStory.title} נבחרה` : 'בחרו הרפתקה אחת'}</strong>
            <small>{selectedStory ? 'אפשר להמשיך לסגנון האיור' : 'הכפתור ייפתח לאחר הבחירה'}</small>
          </div>
        </div>

        <button type="button" className="next-btn" onClick={nextStep} disabled={!selectedStory}>
          בואו נבחר סגנון
          <span aria-hidden="true">←</span>
        </button>
      </div>
    </div>
  );
}

export default StepTwo;
