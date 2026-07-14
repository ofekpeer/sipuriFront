import { useBook } from "../../context/BookContext";

function StepOne() {

  const {

    formData,

    handleInputChange,

    nextStep,

  } = useBook();

  return (

    <>

      <h2>

        בואו נכיר את גיבור הסיפור 🌟

      </h2>

      <div className="input-box">

        <label>

          שם הילד

        </label>

        <input

          type="text"

          name="child.name"

          value={formData.child.name}

          onChange={handleInputChange}

          placeholder="לדוגמה: יונתן"

        />

      </div>

      <div className="input-box">

        <label>

          גיל

        </label>

        <input

          type="number"

          name="child.age"

          value={formData.child.age}

          onChange={handleInputChange}

          placeholder="לדוגמה: 5"

        />

      </div>

      <div className="input-box">

        <label>

          מין

        </label>

        <select

          name="child.gender"

          value={formData.child.gender}

          onChange={handleInputChange}

        >

          <option value="">

            בחר

          </option>

          <option value="boy">

            בן

          </option>

          <option value="girl">

            בת

          </option>

        </select>

      </div>

      <div className="input-box">

        <label>

          תחביבים

        </label>

        <input

          type="text"

          name="story.hobbies"

          value={formData.story.hobbies}

          onChange={handleInputChange}

          placeholder="כדורגל, ציור, לגו..."

        />

      </div>

      <button

        className="next-btn"

        onClick={nextStep}

      >

        המשך →

      </button>

    </>

  );

}

export default StepOne;