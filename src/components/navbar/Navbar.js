import "./Navbar.css";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToHomeSection = (sectionId) => (event) => {
    event.preventDefault();
    setMobileOpen(false);

    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }

    const section = document.getElementById(sectionId);
    if (!section) return;

    const navbarOffset = 96;
    const top = section.getBoundingClientRect().top + window.scrollY - navbarOffset;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `/#${sectionId}`);
  };

  useEffect(() => {
    let frameId = null;

    const updateNavbar = () => {
      frameId = null;
      const nextScrolled = window.scrollY > 30;
      setScrolled((current) => current === nextScrolled ? current : nextScrolled);
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateNavbar);
      }
    };

    updateNavbar();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
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

              <Link to="/how-it-works">
                איך זה עובד
              </Link>

              <Link to="/#story" onClick={scrollToHomeSection("story")}>
                הסיפור שלנו
              </Link>

              <Link to="/#reviews" onClick={scrollToHomeSection("reviews")}>
                ביקורות
              </Link>

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

          <Link
            to="/how-it-works"
            onClick={() => setMobileOpen(false)}
          >
            איך זה עובד
          </Link>

          <Link
            to="/#story"
            onClick={scrollToHomeSection("story")}
          >
            הסיפור שלנו
          </Link>

          <Link
            to="/#reviews"
            onClick={scrollToHomeSection("reviews")}
          >
            ביקורות
          </Link>

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
