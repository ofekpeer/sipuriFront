import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { getGoogleLoginUrl, warmAuthApi } from '../../services/authApi';
import Navbar from '../../components/navbar/Navbar';
import './AuthPage.css';

function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { login, register, completeGoogleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [serverState, setServerState] = useState('checking');

  useEffect(() => {
    let active = true;
    const wakingTimer = window.setTimeout(() => {
      if (active) setServerState('waking');
    }, 1_200);

    warmAuthApi()
      .then(() => {
        if (active) setServerState('ready');
      })
      .catch(() => {
        if (active) setServerState('idle');
      })
      .finally(() => window.clearTimeout(wakingTimer));

    return () => {
      active = false;
      window.clearTimeout(wakingTimer);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const googleToken = params.get('googleToken');
    const authError = params.get('authError');

    if (authError) setError(authError);
    if (!googleToken) return;

    completeGoogleLogin(googleToken)
      .then(() => navigate(location.state?.from || '/library', { replace: true }))
      .catch((requestError) => setError(requestError.message || 'ההתחברות עם Google נכשלה'));
  }, [completeGoogleLogin, location.search, location.state, navigate]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      setServerState('waking');
      await warmAuthApi();
      setServerState('ready');

      if (isRegister) {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }

      navigate(location.state?.from || '/library', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'לא הצלחנו להשלים את הפעולה');
    } finally {
      setSubmitting(false);
    }
  }

  async function startGoogleLogin() {
    setError('');
    setGoogleSubmitting(true);
    setServerState('waking');

    try {
      await warmAuthApi();
      setServerState('ready');
      window.location.assign(getGoogleLoginUrl());
    } catch (requestError) {
      setError(requestError.message || 'לא הצלחנו להכין את ההתחברות עם Google');
      setServerState('idle');
      setGoogleSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <Navbar variant="auth" />
      <section className="auth-panel">
        <Link to="/" className="auth-brand">סיפורי</Link>
        <span className="auth-kicker">הספרים שלך, במקום אחד</span>
        <h1>{isRegister ? 'בואו ניצור חשבון' : 'ברוכים שחזרתם'}</h1>
        <p>{isRegister ? 'שמרו את כל הספרים האישיים שלכם בספרייה אחת.' : 'התחברו כדי להמשיך לקרוא את הספרים שלכם.'}</p>

        <form onSubmit={submit}>
          {isRegister && (
            <label>
              שם מלא
              <input name="name" value={form.name} onChange={updateField} required autoComplete="name" />
            </label>
          )}
          <label>
            אימייל
            <input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" />
          </label>
          <label>
            סיסמה
            <input name="password" type="password" value={form.password} onChange={updateField} required minLength="6" autoComplete={isRegister ? 'new-password' : 'current-password'} />
          </label>

          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={submitting || googleSubmitting}>
            {submitting
              ? serverState === 'waking' ? 'מעירים את השרת...' : 'רק רגע...'
              : isRegister ? 'יצירת חשבון' : 'התחברות'}
          </button>
        </form>

        <div className="auth-divider"><span>או</span></div>
        <button
          type="button"
          className="google-login"
          onClick={startGoogleLogin}
          disabled={submitting || googleSubmitting}
        >
          <span className="google-login__icon">G</span>
          <span>{googleSubmitting ? 'מכינים התחברות עם Google...' : 'המשך עם Google'}</span>
        </button>

        {serverState === 'waking' && (
          <p className="auth-server-status" role="status">
            <span className="auth-server-spinner" aria-hidden="true" />
            השרת מתעורר לאחר זמן ללא שימוש. זה עשוי לקחת עד כדקה, אין צורך לצאת מהעמוד.
          </p>
        )}

        <p className="auth-switch">
          {isRegister ? 'כבר יש לכם חשבון?' : 'עדיין אין לכם חשבון?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'להתחברות' : 'ליצירת חשבון'}</Link>
        </p>
      </section>
    </main>
  );
}

export default AuthPage;
