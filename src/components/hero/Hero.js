import { Link } from "react-router-dom";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import "./Hero.css";
import Fox from "../../assets/sipuri-fox.png";

function Hero() {
  return (
    <section className="hero" dir="rtl">
      <div className="hero-background" />
      <div className="hero-grid" aria-hidden="true" />
      <span className="hero-star hero-star--one" aria-hidden="true">✦</span>
      <span className="hero-star hero-star--two" aria-hidden="true">✧</span>
      <span className="hero-star hero-star--three" aria-hidden="true">✦</span>

      <div className="hero-content">
        <div className="hero-copy">
          <span className="hero-badge">✦ סיפורים אישיים שנוצרים במיוחד בשבילכם</span>
          <h1>כל ילד יכול להיות<br /><em>הגיבור של הסיפור שלו</em></h1>
          <p>
            יוצרים ספר ילדים אישי עם עלילה מקורית, איורים קסומים והרפתקה שבה
            הילד או הילדה שלכם נמצאים במרכז.
          </p>

          <div className="hero-buttons">
            <Link className="primary-btn" to="/create-book">יוצרים ספר אישי <FaArrowLeft aria-hidden="true" /></Link>
            <Link className="secondary-btn" to="/how-it-works">איך זה עובד?</Link>
          </div>

          <div className="hero-promises">
            <span><FaCheck aria-hidden="true" /> מותאם אישית לילד או לילדה</span>
            <span><FaCheck aria-hidden="true" /> נשמר בספרייה האישית שלכם</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="דוגמה לכריכה של ספר אישי">
          <div className="hero-orbit hero-orbit--one" />
          <div className="hero-orbit hero-orbit--two" />
          <div className="hero-book">
            <div className="hero-book__spine" />
            <div className="cover">
              <div className="bookmark" />
              <span className="cover-kicker">SIPURI</span>
              <div className="monster"><img src={Fox} alt="דמות השועל של Sipuri" /></div>
              <h2>ההרפתקה<br />של נועם</h2>
              <span className="cover-spark cover-spark--one">✦</span>
              <span className="cover-spark cover-spark--two">✧</span>
              <span className="cover-spark cover-spark--three">✦</span>
            </div>
          </div>
          <div className="hero-floating-note">💜 ספר שהוא רק שלו</div>
          <div className="hero-floating-chip">✨ דמיון ללא גבולות</div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
