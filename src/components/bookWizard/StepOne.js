import { useBook } from '../../context/BookContext';

const hobbySuggestions = [
  { label: 'כדורגל', icon: '⚽' },
  { label: 'ציור', icon: '🎨' },
  { label: 'לגו', icon: '🧱' },
  { label: 'ריקוד', icon: '🎵' },
  { label: 'חיות', icon: '🐾' },
  { label: 'חלל', icon: '🚀' },
];

function StepOne() {
  const {
    formData,
    handleInputChange,
    updateField,
    nextStep,
  } = useBook();

  const childName = formData.child.name.trim();
  const hobbies = formData.story.hobbies.trim();
  const age = Number(formData.child.age);
  const validAge = Number.isInteger(age) && age >= 1 && age <= 12;
  const avatarLetter = childName ? Array.from(childName)[0] : '✨';
  const completedFields = [
    Boolean(childName),
    validAge,
    Boolean(formData.child.gender),
    Boolean(hobbies),
  ].filter(Boolean).length;
  const canContinue = completedFields === 4;

  const heroLabel = formData.child.gender === 'girl'
    ? 'הגיבורה של הסיפור'
    : formData.child.gender === 'boy'
      ? 'הגיבור של הסיפור'
      : 'הכוכב של הסיפור';
  const ageLabel = validAge
    ? `${formData.child.gender === 'girl' ? 'בת' : formData.child.gender === 'boy' ? 'בן' : 'גיל'} ${age}`
    : 'מחכים לגיל';

  function addHobby(hobby) {
    const currentItems = hobbies
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (currentItems.includes(hobby)) return;

    const nextValue = [...currentItems, hobby].join(', ');
    if (nextValue.length <= 160) {
      updateField('story', 'hobbies', nextValue);
    }
  }

  return (
    <div className="step-one">
      <section className="step-one__intro">
        <div className="step-one__heading">
          <span className="wizard-step-kicker">שלב 1 · מכירים את הגיבור</span>
          <h2>
            מי הולך להיות
            {' '}
            <span>הכוכב של הסיפור?</span>
          </h2>
          <p className="step-description">
            כמה פרטים קטנים יעזרו לנו להפוך את הספר לעולם שמרגיש כאילו נכתב במיוחד בשבילו.
          </p>

          <div className="step-one__completion" aria-label={`${completedFields} מתוך 4 פרטים הושלמו`}>
            <div>
              <strong>{completedFields}/4</strong>
              <span>פרטים הושלמו</span>
            </div>
            <div className="step-one__completion-track" aria-hidden="true">
              <span style={{ width: `${completedFields * 25}%` }} />
            </div>
          </div>
        </div>

        <aside className="hero-profile-card" aria-live="polite">
          <span className="hero-profile-card__spark hero-profile-card__spark--one">✦</span>
          <span className="hero-profile-card__spark hero-profile-card__spark--two">✧</span>
          <span className="hero-profile-card__eyebrow">הכוכב של הספר</span>
          <div className="hero-profile-card__avatar">{avatarLetter}</div>
          <strong>{childName || 'השם יופיע כאן'}</strong>
          <span>{heroLabel} · {ageLabel}</span>
          <small>
            {hobbies
              ? `אוהב/ת ${hobbies}`
              : 'כאן מתחילה הרפתקה חדשה'}
          </small>
        </aside>
      </section>

      <section className="step-one__form" aria-labelledby="hero-details-title">
        <div className="step-one__section-title">
          <span aria-hidden="true">👋</span>
          <div>
            <h3 id="hero-details-title">ספרו לנו קצת עליו או עליה</h3>
            <p>אל דאגה, אפשר לשנות את הפרטים בכל רגע לפני יצירת הספר.</p>
          </div>
        </div>

        <div className="step-one__fields">
          <div className="input-box step-one__field step-one__field--name">
            <label htmlFor="child-name">
              <span aria-hidden="true">✏️</span>
              שם הילד או הילדה
            </label>
            <input
              id="child-name"
              type="text"
              name="child.name"
              value={formData.child.name}
              onChange={handleInputChange}
              placeholder="לדוגמה: יונתן"
              maxLength="40"
              autoComplete="off"
              autoFocus
            />
            <span className="input-hint">זה השם שיופיע לאורך כל הסיפור.</span>
          </div>

          <div className="input-box step-one__field step-one__field--age">
            <label htmlFor="child-age">
              <span aria-hidden="true">🎂</span>
              גיל
            </label>
            <input
              id="child-age"
              type="number"
              name="child.age"
              value={formData.child.age}
              onChange={handleInputChange}
              placeholder="5"
              min="1"
              max="12"
              inputMode="numeric"
            />
            {formData.child.age && !validAge ? (
              <span className="input-hint is-error">הגיל צריך להיות בין 1 ל־12.</span>
            ) : (
              <span className="input-hint">נתאים את השפה והעלילה לגיל.</span>
            )}
          </div>
        </div>

        <fieldset className="step-one__gender">
          <legend>
            <span aria-hidden="true">💬</span>
            איך לפנות לגיבור או לגיבורה בסיפור?
          </legend>
          <div className="step-one__gender-options">
            <button
              type="button"
              className={formData.child.gender === 'boy' ? 'is-selected' : ''}
              aria-pressed={formData.child.gender === 'boy'}
              onClick={() => updateField('child', 'gender', 'boy')}
            >
              <span aria-hidden="true">👦</span>
              <strong>בן</strong>
              <small>הוא · שלו</small>
              <i aria-hidden="true">✓</i>
            </button>
            <button
              type="button"
              className={formData.child.gender === 'girl' ? 'is-selected' : ''}
              aria-pressed={formData.child.gender === 'girl'}
              onClick={() => updateField('child', 'gender', 'girl')}
            >
              <span aria-hidden="true">👧</span>
              <strong>בת</strong>
              <small>היא · שלה</small>
              <i aria-hidden="true">✓</i>
            </button>
          </div>
        </fieldset>

        <div className="input-box step-one__field step-one__field--hobbies">
          <label htmlFor="child-hobbies">
            <span aria-hidden="true">💜</span>
            מה הוא או היא הכי אוהבים?
          </label>
          <input
            id="child-hobbies"
            type="text"
            name="story.hobbies"
            value={formData.story.hobbies}
            onChange={handleInputChange}
            placeholder="כדורגל, ציור, לגו..."
            maxLength="160"
          />
          <span className="input-hint">
            התחביבים ישתלבו בעלילה ויהפכו אותה לאישית ומפתיעה יותר.
          </span>
          <div className="step-one__suggestions" aria-label="הצעות לתחביבים">
            {hobbySuggestions.map((suggestion) => {
              const isAdded = hobbies
                .split(',')
                .map((item) => item.trim())
                .includes(suggestion.label);

              return (
                <button
                  type="button"
                  key={suggestion.label}
                  className={isAdded ? 'is-added' : ''}
                  onClick={() => addHobby(suggestion.label)}
                  disabled={isAdded}
                >
                  <span aria-hidden="true">{suggestion.icon}</span>
                  {suggestion.label}
                  <i aria-hidden="true">{isAdded ? '✓' : '+'}</i>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="step-one__footer">
        <div className="step-one__reassurance">
          <span aria-hidden="true">✨</span>
          <div>
            <strong>כבר אפשר לדמיין את הסיפור</strong>
            <small>בשלב הבא נבחר את ההרפתקה המושלמת.</small>
          </div>
        </div>
        <button
          type="button"
          className="next-btn"
          onClick={nextStep}
          disabled={!canContinue}
        >
          בואו נבחר הרפתקה
          <span aria-hidden="true">←</span>
        </button>
      </div>
    </div>
  );
}

export default StepOne;
