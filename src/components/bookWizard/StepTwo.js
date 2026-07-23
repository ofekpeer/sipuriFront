import { useBook } from '../../context/BookContext';

function StepTwo() {
  const {
    formData,

    handleInputChange,

    nextStep,

    prevStep,
  } = useBook();

  const stories = [
    {
      icon: '🚀',
      title: 'חלל',
      value: 'space',
    },

    {
      icon: '🦖',
      title: 'דינוזאורים',
      value: 'dinosaurs',
    },

    {
      icon: '🧙',
      title: 'קסמים',
      value: 'magic',
    },

    {
      icon: '🏴‍☠️',
      title: 'פיראטים',
      value: 'pirates',
    },
  ];

  return (
    <>
      <h2>בחרו את סוג ההרפתקה 🚀</h2>

      <p className="step-description">
        כל אפשרות נותנת לסיפור אווירה אחרת — בחרו את זו שהכי נוגעת ללב.
      </p>

      <div className="cards-grid">
        {stories.map((story) => (
          <div
            key={story.value}
            className={`story-card ${
              formData.story.type === story.value ? 'selected' : ''
            }`}
            onClick={() =>
              handleInputChange({
                target: {
                  name: 'story.type',

                  value: story.value,
                },
              })
            }
          >
            <span>{story.icon}</span>

            <h3>{story.title}</h3>
          </div>
        ))}
      </div>

      <div className="wizard-buttons">
        <button className="back-btn" onClick={prevStep}>
          ← הקודם
        </button>

        <button className="next-btn" onClick={nextStep} disabled={!formData.story.type}>
          הבא →
        </button>
      </div>
    </>
  );
}

export default StepTwo;
