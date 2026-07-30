import { useBook } from '../../context/BookContext';

function StepOne() {
  const { formData, handleInputChange, nextStep } = useBook();

  const age = Number(formData.child.age);
  const canContinue = Boolean(
    formData.child.name.trim()
    && Number.isInteger(age)
    && age >= 1
    && age <= 12
    && formData.child.gender
    && formData.story.hobbies.trim(),
  );

  return (
    <>
      <span className="wizard-step-kicker">שלב 1 · מכירים את הגיבור</span>
      <h2>בואו נכיר את גיבור הסיפור 🌟</h2>
      <p className="step-description">
        מלאו כמה פרטים פשוטים, וכך הספר יישמע אישי ומיוחד יותר.
      </p>

      <div className="input-box">
        <label htmlFor="child-name">שם הילד או הילדה</label>
        <input
          id="child-name"
          type="text"
          name="child.name"
          value={formData.child.name}
          onChange={handleInputChange}
          placeholder="לדוגמה: יונתן"
          maxLength="40"
          autoComplete="off"
        />
      </div>

      <div className="input-box">
        <label htmlFor="child-age">גיל</label>
        <input
          id="child-age"
          type="number"
          name="child.age"
          value={formData.child.age}
          onChange={handleInputChange}
          placeholder="לדוגמה: 5"
          min="1"
          max="12"
          inputMode="numeric"
        />
        {formData.child.age && (age < 1 || age > 12) ? (
          <span className="input-hint is-error">הגיל צריך להיות בין 1 ל־12.</span>
        ) : null}
      </div>

      <div className="input-box">
        <label htmlFor="child-gender">לשון הפנייה בסיפור</label>
        <select
          id="child-gender"
          name="child.gender"
          value={formData.child.gender}
          onChange={handleInputChange}
        >
          <option value="">בחר</option>
          <option value="boy">בן</option>
          <option value="girl">בת</option>
        </select>
      </div>

      <div className="input-box">
        <label htmlFor="child-hobbies">תחביבים ודברים שאוהבים</label>
        <input
          id="child-hobbies"
          type="text"
          name="story.hobbies"
          value={formData.story.hobbies}
          onChange={handleInputChange}
          placeholder="כדורגל, ציור, לגו..."
          maxLength="160"
        />
        <span className="input-hint">התחביבים משתלבים בעלילה והופכים אותה לאישית יותר.</span>
      </div>

      <button type="button" className="next-btn" onClick={nextStep} disabled={!canContinue}>
        המשך →
      </button>
    </>
  );
}

export default StepOne;
