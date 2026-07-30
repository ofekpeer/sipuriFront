import "./BookWizard.css";

function ProgressBar({ step }) {

  const progress = (step / 5) * 100;
  const stepNames = ['פרטים', 'הרפתקה', 'איור', 'תמונה', 'בדיקה'];

  return (
    <>
      {/* Desktop */}

      <div className="progress-wrapper desktop-progress">

        <div className={step >= 1 ? "step active" : "step"}>
          <span>1</span>
          <p>פרטים</p>
        </div>

        <div className={step >= 2 ? "line active-line" : "line"}></div>

        <div className={step >= 2 ? "step active" : "step"}>
          <span>2</span>
          <p>הרפתקה</p>
        </div>

        <div className={step >= 3 ? "line active-line" : "line"}></div>

        <div className={step >= 3 ? "step active" : "step"}>
          <span>3</span>
          <p>איור</p>
        </div>

        <div className={step >= 4 ? "line active-line" : "line"}></div>

        <div className={step >= 4 ? "step active" : "step"}>
          <span>4</span>
          <p>תמונה</p>
        </div>

        <div className={step >= 5 ? "line active-line" : "line"}></div>

        <div className={step >= 5 ? "step active" : "step"}>
          <span>5</span>
          <p>סיום</p>
        </div>

      </div>

      {/* Mobile */}

      <div className="mobile-progress">

        <div className="mobile-progress-top">

          <span>
            שלב {step} מתוך 5 · {stepNames[step - 1]}
          </span>

          <span>
            {progress}%
          </span>

        </div>

        <div className="mobile-progress-bar">

          <div
            className="mobile-progress-fill"
            style={{ width: `${progress}%` }}
          ></div>

        </div>

      </div>

    </>
  );

}

export default ProgressBar;
