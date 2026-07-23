import "./Navbar.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaBars,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";

import Fox from "../../assets/sipuri-fox-logo.png";

function Navbar({
  showProgress = false,
  step = 1,
  totalSteps = 5,
  variant = "home",
}) {

  const isHome = variant === "home" && !showProgress;
  const isApp = variant === "app" && !showProgress;
  const isAuth = variant === "auth" && !showProgress;
  const progress = (step / totalSteps) * 100;
  const { user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {

    const handleScroll = () => {

      setScrolled(window.scrollY > 30);

    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  useEffect(() => {

    if (mobileOpen) {

      document.body.style.overflow = "hidden";

    } else {

      document.body.style.overflow = "auto";

    }

    return () => {

      document.body.style.overflow = "auto";

    };

  }, [mobileOpen]);

  return (

    <header
      className={`navbar navbar--${variant} ${showProgress ? "navbar--progress" : ""} ${scrolled ? "navbar-scrolled" : ""}`}
    >

      <div className="navbar-container">

        <Link
          to="/"
          className="logo"
        >

          <div className="logo-circle">

            <img
              src={Fox}
              alt="Sipuri"
            />

          </div>

          <div className="logo-text">

            <h2>Sipuri</h2>

            <span>
              Personalized Storybooks
            </span>

          </div>

        </Link>

        {isHome && (

          <>

            <nav className="desktop-nav">

              <a href="#how">
                איך זה עובד
              </a>

              <a href="#books">
                ספרים
              </a>

              <a href="#story">
                הסיפור שלנו
              </a>

              <a href="#reviews">
                ביקורות
              </a>

              <Link to="/library">
                הספרייה שלי
              </Link>

            </nav>

            <div className="navbar-actions">

              {user ? (
                <button className="account-btn" onClick={logout}>
                  התנתקות {user.name ? `· ${user.name}` : ''}
                </button>
              ) : (
                <Link className="account-btn" to="/login">התחברות</Link>
              )}

              <Link to="/create-book">

                <button className="start-btn">

                  ✨ צור ספר אישי

                </button>

              </Link>

              <button
                className="menu-btn"
                onClick={() => setMobileOpen(true)}
              >

                <FaBars />

              </button>

            </div>

          </>

        )}

        {isApp && (
          <>
            <nav className="desktop-nav">
              <Link to="/">דף הבית</Link>
              <Link to="/library">הספרייה שלי</Link>
            </nav>

            <div className="navbar-actions">
              <Link className="library-nav-link" to="/library">📚 הספרים שלי</Link>
              {user ? (
                <button className="account-btn" onClick={logout}>התנתקות</button>
              ) : (
                <Link className="account-btn" to="/login">התחברות</Link>
              )}
              <button className="menu-btn" onClick={() => setMobileOpen(true)}>
                <FaBars />
              </button>
            </div>
          </>
        )}

        {isAuth && (
          <div className="navbar-actions">
            <button className="menu-btn" onClick={() => setMobileOpen(true)}>
              <FaBars />
            </button>
            <Link className="account-btn" to="/">← חזרה לדף הבית</Link>
          </div>
        )}

        {showProgress && (

          <div className="wizard-navbar">

            <Link
              className="back-home"
              to="/"
            >

              <FaArrowLeft />

              חזרה לבית

            </Link>

            <div className="wizard-progress">

              <span>

                שלב {step} מתוך {totalSteps}

              </span>

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

        )}

      </div>

      {mobileOpen && (

        <div

          className="mobile-overlay"

          onClick={() => setMobileOpen(false)}

        />

      )}

      <div

        className={`mobile-menu ${mobileOpen ? "open" : ""}`}

      >

        <div className="mobile-header">

          <h2>

            Sipuri

          </h2>

          <button

            onClick={() => setMobileOpen(false)}

          >

            <FaTimes />

          </button>

        </div>

        <nav>

          <Link to="/" onClick={() => setMobileOpen(false)}>
            דף הבית
          </Link>

          <a

            href="#how"

            onClick={() => setMobileOpen(false)}

          >

            איך זה עובד

          </a>

          <a

            href="#books"

            onClick={() => setMobileOpen(false)}

          >

            ספרים

          </a>

          <a

            href="#story"

            onClick={() => setMobileOpen(false)}

          >

            הסיפור שלנו

          </a>

          <a

            href="#reviews"

            onClick={() => setMobileOpen(false)}

          >

            ביקורות

          </a>

          <Link
            to="/library"
            onClick={() => setMobileOpen(false)}
          >
            הספרייה שלי
          </Link>

        </nav>

        {user ? (
          <button className="mobile-account-btn" onClick={() => { logout(); setMobileOpen(false); }}>
            התנתקות {user.name ? `· ${user.name}` : ''}
          </button>
        ) : (
          <Link className="mobile-account-btn" to="/login" onClick={() => setMobileOpen(false)}>
            התחברות לחשבון
          </Link>
        )}

        <Link

          to="/create-book"

          onClick={() => setMobileOpen(false)}

        >

          <button>

            ✨ צור ספר אישי

          </button>

        </Link>

      </div>

    </header>

  );

}

export default Navbar;
