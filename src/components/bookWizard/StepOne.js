import { useBook } from '../../context/BookContext';

function StepOne() {
  const { formData, handleInputChange, nextStep } = useBook();

  const canContinue =
    formData.child.name && formData.child.age && formData.child.gender;

  return (
    <>
      <h2>בואו נכיר את גיבור הסיפור 🌟</h2>
      <p className="step-description">
        מלאו כמה פרטים פשוטים, וכך הספר יישמע אישי ומיוחד יותר.
      </p>

      <div className="input-box">
        <label>שם הילד</label>
        <input
          type="text"
          name="child.name"
          value={formData.child.name}
          onChange={handleInputChange}
          placeholder="לדוגמה: יונתן"
        />
      </div>

      <div className="input-box">
        <label>גיל</label>
        <input
          type="number"
          name="child.age"
          value={formData.child.age}
          onChange={handleInputChange}
          placeholder="לדוגמה: 5"
          min="1"
          max="12"
        />
      </div>

      <div className="input-box">
        <label>מין</label>
        <select
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
        <label>תחביבים</label>
        <input
          type="text"
          name="story.hobbies"
          value={formData.story.hobbies}
          onChange={handleInputChange}
          placeholder="כדורגל, ציור, לגו..."
        />
      </div>

      <button className="next-btn" onClick={nextStep} disabled={!canContinue}>
        המשך →
      </button>
    </>
  );
}

export default StepOne;
