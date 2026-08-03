import './Navbar.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBars,
  FaBookOpen,
  FaHome,
  FaLock,
  FaMagic,
  FaShoppingCart,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
} from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Fox from '../../assets/sipuri-fox-logo.png';

const MARKETING_PATHS = new Set([
  '/',
  '/terms',
  '/privacy',
  '/faq',
  '/how-it-works',
]);

function getAutomaticVariant(pathname) {
  if (pathname === '/login' || pathname === '/register') return 'auth';
  if (pathname.includes('/checkout') || pathname === '/payment/result') {
    return 'checkout';
  }
  if (MARKETING_PATHS.has(pathname)) return 'home';
  return 'app';
}

function Navbar({
  showProgress = false,
  step = 1,
  totalSteps = 5,
  variant = 'auto',
}) {
  const { user, logout } = useAuth();
  const { summary: cartSummary } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const previousBodyOverflow = useRef('');

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const resolvedVariant = showProgress
    ? 'progress'
    : variant === 'auto'
      ? getAutomaticVariant(location.pathname)
      : variant;

  const cartCount = cartSummary?.itemCount || 0;
  const progress = Math.min(100, Math.max(0, (step / totalSteps) * 100));
  const isSimpleNavbar = resolvedVariant === 'auth';
  const canOpenMenu = ['home', 'app', 'checkout'].includes(resolvedVariant);
  const showCreateAction = resolvedVariant === 'home' || resolvedVariant === 'app';

  const primaryLinks = useMemo(() => {
    if (resolvedVariant === 'home') {
      return [
        { label: 'איך זה עובד', to: '/how-it-works' },
        { label: 'הסיפור שלנו', to: '/#story', sectionId: 'story' },
        { label: 'ביקורות', to: '/#reviews', sectionId: 'reviews' },
        { label: 'הספרייה שלי', to: '/library' },
      ];
    }

    if (resolvedVariant === 'checkout') {
      return [
        { label: 'דף הבית', to: '/', icon: FaHome },
        { label: 'הספרייה שלי', to: '/library', icon: FaBookOpen },
      ];
    }

    if (resolvedVariant === 'app') {
      return [
        { label: 'דף הבית', to: '/', icon: FaHome },
        { label: 'הספרייה שלי', to: '/library', icon: FaBookOpen },
      ];
    }

    return [];
  }, [resolvedVariant]);

  const closeMenu = () => setMobileOpen(false);

  const scrollToHomeSection = (sectionId) => (event) => {
    event.preventDefault();
    closeMenu();

    if (location.pathname !== '/') {
      navigate({ pathname: '/', hash: sectionId });
      return;
    }

    const section = document.getElementById(sectionId);
    if (!section) return;

    const navbarOffset = 96;
    const top = section.getBoundingClientRect().top + window.scrollY - navbarOffset;
    window.scrollTo({ top, behavior: 'smooth' });
    window.history.replaceState(null, '', `/#${sectionId}`);
  };

  const isLinkActive = (item) => {
    if (item.sectionId) {
      return location.pathname === '/' && location.hash === `#${item.sectionId}`;
    }
    if (item.to === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.to);
  };

  useEffect(() => {
    let frameId = null;

    const updateNavbar = () => {
      frameId = null;
      const nextScrolled = window.scrollY > 24;
      setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
    };

    const handleScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateNavbar);
      }
    };

    updateNavbar();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    previousBodyOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeMenu();
    };

    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousBodyOverflow.current;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileOpen]);

  const renderNavLink = (item, mobile = false) => {
    const Icon = item.icon;
    const sectionHandler = item.sectionId
      ? scrollToHomeSection(item.sectionId)
      : mobile
        ? closeMenu
        : undefined;

    return (
      <Link
        key={`${mobile ? 'mobile' : 'desktop'}-${item.to}`}
        to={item.to}
        onClick={sectionHandler}
        className={isLinkActive(item) ? 'is-active' : ''}
        aria-current={isLinkActive(item) ? 'page' : undefined}
      >
        {Icon ? <Icon aria-hidden="true" /> : null}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <header
      className={[
        'navbar',
        `navbar--${resolvedVariant}`,
        scrolled ? 'navbar--scrolled' : '',
      ].filter(Boolean).join(' ')}
      dir="rtl"
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="סיפורי — דף הבית">
          <span className="navbar-logo__mark">
            <img src={Fox} alt="" aria-hidden="true" />
          </span>
          <span className="navbar-logo__copy">
            <strong>סיפורי</strong>
            <small>ספרי ילדים אישיים</small>
          </span>
        </Link>

        {resolvedVariant === 'progress' ? (
          <div className="wizard-navbar">
            <Link className="back-home" to="/">
              <FaArrowLeft aria-hidden="true" />
              <span>חזרה לבית</span>
            </Link>

            <div className="wizard-progress">
              <div className="wizard-progress__copy">
                <span>שלב {step} מתוך {totalSteps}</span>
                <strong>{Math.round(progress)}%</strong>
              </div>
              <div
                className="navbar-progress-track"
                role="progressbar"
                aria-label="התקדמות ביצירת הספר"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={Math.round(progress)}
              >
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        ) : (
          <>
            {!isSimpleNavbar ? (
              <nav className="navbar-main-nav" aria-label="ניווט ראשי">
                {primaryLinks.map((item) => renderNavLink(item))}
              </nav>
            ) : null}

            {isSimpleNavbar ? (
              <Link className="navbar-home-action" to="/">
                <FaArrowLeft aria-hidden="true" />
                <span>חזרה לדף הבית</span>
              </Link>
            ) : (
              <div className="navbar-actions">
                <div className="navbar-desktop-actions">
                  {resolvedVariant === 'checkout' ? (
                    <span className="navbar-secure-pill">
                      <FaLock aria-hidden="true" />
                      רכישה מאובטחת
                    </span>
                  ) : null}

                  {user ? (
                    <Link
                      className="navbar-icon-action"
                      to="/cart"
                      aria-label={`עגלת הקניות, ${cartCount} פריטים`}
                    >
                      <FaShoppingCart aria-hidden="true" />
                      <span>עגלה</span>
                      {cartCount > 0 ? (
                        <b className="navbar-cart-badge">{cartCount}</b>
                      ) : null}
                    </Link>
                  ) : null}

                  {user ? (
                    <button className="navbar-account-action" type="button" onClick={logout}>
                      <FaSignOutAlt aria-hidden="true" />
                      <span>התנתקות</span>
                      {user.name ? <small>{user.name}</small> : null}
                    </button>
                  ) : (
                    <Link className="navbar-account-action" to="/login">
                      <FaUserCircle aria-hidden="true" />
                      <span>התחברות</span>
                    </Link>
                  )}

                  {showCreateAction ? (
                    <Link className="navbar-create-action" to="/create-book">
                      <FaMagic aria-hidden="true" />
                      <span>יצירת ספר אישי</span>
                    </Link>
                  ) : null}
                </div>

                {canOpenMenu ? (
                  <button
                    className="navbar-menu-toggle"
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    aria-label="פתיחת תפריט הניווט"
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-navigation"
                  >
                    <FaBars aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>

      {canOpenMenu ? (
        <>
          <button
            className={`navbar-overlay ${mobileOpen ? 'is-open' : ''}`}
            type="button"
            aria-label="סגירת תפריט הניווט"
            tabIndex={mobileOpen ? 0 : -1}
            onClick={closeMenu}
          />

          <aside
            id="mobile-navigation"
            className={`navbar-drawer ${mobileOpen ? 'is-open' : ''}`}
            aria-hidden={!mobileOpen}
            aria-modal="true"
            role="dialog"
          >
            <div className="navbar-drawer__header">
              <Link to="/" className="navbar-drawer__brand" onClick={closeMenu}>
                <img src={Fox} alt="" aria-hidden="true" />
                <span>
                  <strong>סיפורי</strong>
                  <small>הסיפור שלך מתחיל כאן</small>
                </span>
              </Link>
              <button type="button" onClick={closeMenu} aria-label="סגירת התפריט">
                <FaTimes aria-hidden="true" />
              </button>
            </div>

            <nav className="navbar-drawer__links" aria-label="ניווט למובייל">
              {primaryLinks.map((item) => renderNavLink(item, true))}
              {user ? (
                <Link to="/cart" onClick={closeMenu} className={location.pathname === '/cart' ? 'is-active' : ''}>
                  <FaShoppingCart aria-hidden="true" />
                  <span>עגלת הקניות</span>
                  {cartCount > 0 ? <b>{cartCount}</b> : null}
                </Link>
              ) : null}
            </nav>

            <div className="navbar-drawer__footer">
              {user ? (
                <div className="navbar-drawer__user">
                  <span>
                    <FaUserCircle aria-hidden="true" />
                    <span>
                      <small>מחובר/ת בתור</small>
                      <strong>{user.name || user.email || 'החשבון שלי'}</strong>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                  >
                    <FaSignOutAlt aria-hidden="true" />
                    התנתקות
                  </button>
                </div>
              ) : (
                <Link className="navbar-drawer__login" to="/login" onClick={closeMenu}>
                  <FaUserCircle aria-hidden="true" />
                  התחברות לחשבון
                </Link>
              )}

              {showCreateAction ? (
                <Link className="navbar-drawer__create" to="/create-book" onClick={closeMenu}>
                  <FaMagic aria-hidden="true" />
                  יצירת ספר אישי
                </Link>
              ) : null}

              {resolvedVariant === 'checkout' ? (
                <span className="navbar-drawer__secure">
                  <FaLock aria-hidden="true" />
                  התשלום מאובטח ומוגן
                </span>
              ) : null}
            </div>
          </aside>
        </>
      ) : null}
    </header>
  );
}

export default Navbar;
