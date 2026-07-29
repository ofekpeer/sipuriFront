import { Link } from "react-router-dom";
import { FaArrowLeft, FaBookOpen, FaMagic, FaPalette, FaRegSmile } from "react-icons/fa";
import "./HowItWorks.css";

const steps = [
  {
    icon: <FaRegSmile />,
    title: "מכירים את הגיבור או הגיבורה",
    text: "ממלאים כמה פרטים פשוטים על הילד או הילדה — שם, גיל, תחומי עניין ומה הופך אותם למיוחדים.",
  },
  {
    icon: <FaPalette />,
    title: "בוחרים עולם וסגנון",
    text: "בוחרים הרפתקה, מסר וסגנון איור שמתאים בדיוק לסיפור שאתם רוצים לספר.",
  },
  {
    icon: <FaMagic />,
    title: "יוצרים קסם אישי",
    text: "מעלים תמונה ברורה, והמערכת יוצרת ספר מאויר שבו הילד או הילדה משתלבים בעולם שבחרתם.",
  },
  {
    icon: <FaBookOpen />,
    title: "קוראים ושומרים בספרייה",
    text: "כשהספר מוכן, הוא מחכה בספרייה האישית שלכם — לקריאה, לניהול ולחזרה אליו בכל עת.",
  },
];

function HowItWorks() {
  return (
    <main className="how-page" dir="rtl">
      <section className="how-hero">
        <span className="how-hero__eyebrow">ארבעה צעדים קטנים</span>
        <h1>כך יוצרים סיפור<br /><em>שנשאר בלב</em></h1>
        <p>
          כמה בחירות פשוטות הופכות רעיון קטן להרפתקה אישית שהילד או הילדה שלכם מובילים.
        </p>
        <Link className="how-hero__button" to="/create-book">
          מתחילים ליצור ספר <FaArrowLeft aria-hidden="true" />
        </Link>
      </section>

      <section className="how-steps" aria-label="שלבי יצירת ספר">
        {steps.map((step, index) => (
          <article className="how-step" key={step.title}>
            <div className="how-step__number">0{index + 1}</div>
            <div className="how-step__icon" aria-hidden="true">{step.icon}</div>
            <h2>{step.title}</h2>
            <p>{step.text}</p>
          </article>
        ))}
      </section>

      <section className="how-tip">
        <span aria-hidden="true">✦</span>
        <div>
          <h2>טיפ קטן לתמונה נהדרת</h2>
          <p>בחרו תמונה מוארת וברורה, שבה הפנים נראות היטב ואין אנשים נוספים בפריים.</p>
        </div>
      </section>
    </main>
  );
}

export default HowItWorks;
