import "./Navbar.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
}) {

  const isHome = !showProgress;
  const progress = (step / totalSteps) * 100;

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
      className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
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

            </nav>

            <div className="navbar-actions">

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

        </nav>

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