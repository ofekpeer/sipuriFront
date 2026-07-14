import "./Hero.css";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import Fox from "../../assets/sipuri-fox.png";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-background"></div>

      <div className="hero-stars">

    <span className="star s1"></span>
    <span className="star s2"></span>
    <span className="star s3"></span>
    <span className="star s4"></span>
    <span className="star s5"></span>
    <span className="star s6"></span>
    <span className="star s7"></span>
    <span className="star s8"></span>

</div>

      <div className="hero-content">

        {/* צד שמאל */}

        <div className="hero-left">

          <div className="hero-badge">
            ✨ יותר מ־1,200 ספרים כבר נוצרו
          </div>

          <h1>
            כל ילד יכול להיות
            <br />
            <span>הגיבור של הסיפור שלו</span>
          </h1>

          <p>
            צרו ספר ילדים אישי בעזרת AI, עם עלילה מקורית,
            איורים קסומים והרפתקה שהילד שלכם לעולם לא ישכח.
          </p>

          <div className="hero-buttons">

            <Link to="/create-book">
              <button className="primary-btn">
                ✨ צור ספר עכשיו
              </button>
            </Link>

            <button className="secondary-btn">
              לראות דוגמא
              <FaArrowLeft />
            </button>

          </div>

          <div className="hero-info">

            <div>
              <h2>1200+</h2>
              <span>ספרים</span>
            </div>

            <div>
              <h2>4.9★</h2>
              <span>דירוג</span>
            </div>

            <div>
              <h2>98%</h2>
              <span>לקוחות מרוצים</span>
            </div>

          </div>

        </div>

        {/* צד ימין */}

        <div className="hero-right">

          <div className="hero-circle"></div>

          <div className="book">

            <div className="cover">

              <div className="bookmark"></div>

              <div className="logo">
                סיפורי
              </div>

              <div className="monster">
                <img src={Fox} alt="Sipuri Fox" />
              </div>

              <h3>
                ההרפתקה של נועם
              </h3>

              <div className="sparkle sparkle1">
                ✦
              </div>

              <div className="sparkle sparkle2">
                ✦
              </div>

              <div className="sparkle sparkle3">
                ✦
              </div>

            </div>

          </div>

          <div className="star star1">
            ⭐
          </div>

          <div className="star star2">
            ✨
          </div>

          <div className="star star3">
            💜
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;