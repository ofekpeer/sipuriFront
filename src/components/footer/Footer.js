import "./Footer.css";
import { Link } from "react-router-dom";

import {
  FaInstagram,
  FaFacebookF,
  FaTiktok
} from "react-icons/fa";

import mascot from "../../assets/sipuri-fox.png";

function Footer() {

      return (

    <footer className="footer">
        <div className="stars">

  <span className="star s1"></span>
  <span className="star s2"></span>
  <span className="star s3"></span>
  <span className="star s4"></span>
  <span className="star s5"></span>
  <span className="star s6"></span>
  <span className="star s7"></span>
  <span className="star s8"></span>

</div>

      <div className="footer-glow"></div>

      <div className="footer-container">

        <div className="footer-cta">

          <div className="footer-cta-text">

            <span>

              ✨ הגיע הזמן ליצור קסם

            </span>

            <h2>

              מוכנים ליצור את הספר הראשון?

            </h2>

            <p>

              תוך כמה דקות גם הילד שלכם יכול להפוך לגיבור של סיפור אישי ומאויר במיוחד עבורו.

            </p>

            <Link
              to="/create-book"
              className="footer-button"
            >

              צור ספר עכשיו

            </Link>

          </div>
                    <div className="footer-mascot">

            <img
              src={mascot}
              alt="Sipuri"
            />

          </div>

        </div>
                <div className="footer-content">

          <div className="footer-brand">

            <h3>

              Sipuri

            </h3>

            <p>

              סיפורים שנשארים בלב.
              כל ילד הוא הגיבור של הסיפור שלו.

            </p>

          </div>
                    <div>

            <h4>

              ניווט

            </h4>

            <Link to="/">

              בית

            </Link>

            <Link to="/create-book">

              צור ספר

            </Link>

            <a href="#how">

              איך זה עובד

            </a>

            <a href="#books">

              ספרים

            </a>

          </div>
                    <div>

            <h4>

              מידע

            </h4>

            <a href="/">

              שאלות נפוצות

            </a>

            <a href="/">

              מדיניות פרטיות

            </a>

            <a href="/">

              תנאי שימוש

            </a>

            <a href="/">

              צור קשר

            </a>

          </div>
                    <div>

            <h4>

              עקבו אחרינו

            </h4>

            <div className="footer-socials">

              <a href="/">

                <FaInstagram />

              </a>

              <a href="/">

                <FaFacebookF />

              </a>

              <a href="/">

                <FaTiktok />

              </a>

            </div>

          </div>

        </div>
                <div className="footer-bottom">

          <span>

            © 2026 Sipuri

          </span>

          <span>

            נוצר באהבה לילדים ולהורים ❤️

          </span>

        </div>

      </div>

    </footer>

  );

}

export default Footer;