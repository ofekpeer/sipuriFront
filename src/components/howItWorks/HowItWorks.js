import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./HowItWorks.css";
import aboutKid from "../../assets/howItWorks/aboutkid.jpg";
import magicStart from "../../assets/howItWorks/magicstart.jpg";
import book from "../../assets/howItWorks/bookcreate.jpg";
import delivery from "../../assets/howItWorks/delivery.jpg";

const steps = [
  { image: aboutKid, title: "מכירים את הגיבור או הגיבורה", text: "ממלאים שם, גיל, תחביבים וכל פרט קטן שהופך את הסיפור לאישי.", accent: "violet" },
  { image: magicStart, title: "בוחרים עולם והרפתקה", text: "בוחרים נושא, מסר וסגנון איור שמתאים בדיוק לחלום הגדול שלהם.", accent: "orange" },
  { image: book, title: "נותנים לקסם לקרות", text: "המערכת יוצרת סיפור ואיורים אישיים שבהם הילד או הילדה נמצאים במרכז.", accent: "pink" },
  { image: delivery, title: "קוראים ושומרים בספרייה", text: "כשהספר מוכן הוא מחכה לכם בספרייה האישית — לקריאה חוזרת בכל עת.", accent: "teal" },
];

function HowItWorks() {
  return (
    <section id="how" className="how" dir="rtl">
      <div className="how-background" />
      <div className="how-orb how-orb--one" />
      <div className="how-orb how-orb--two" />

      <header className="how-header">
        <span className="how-badge">✦ ארבעה צעדים פשוטים</span>
        <h2>כך נוצר <em>הקסם</em></h2>
        <p>מרעיון קטן ועד לסיפור אישי שהילד או הילדה שלכם לא ירצו להניח מהיד.</p>
      </header>

      <div className="magic-line">
        {steps.map((step, index) => (
          <article className={`magic-step magic-step--${step.accent}`} key={step.title}>
            <span className="magic-step__number">0{index + 1}</span>
            <div className="magic-circle">
              <img className="magic-image" src={step.image} alt="" loading="lazy" decoding="async" />
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>

      <div className="how-actions">
        <Link className="how-actions__primary" to="/create-book">מתחילים ליצור ספר <FaArrowLeft aria-hidden="true" /></Link>
        <Link className="how-actions__secondary" to="/how-it-works">לכל התהליך בפירוט</Link>
      </div>
    </section>
  );
}

export default HowItWorks;
