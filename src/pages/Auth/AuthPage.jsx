import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
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
          <button type="submit" disabled={submitting}>
            {submitting ? 'רק רגע...' : isRegister ? 'יצירת חשבון' : 'התחברות'}
          </button>
        </form>

        <div className="auth-divider"><span>או</span></div>
        <button type="button" className="google-login" onClick={() => window.location.assign(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google`)}>
          <span>G</span> המשך עם Google
        </button>

        <p className="auth-switch">
          {isRegister ? 'כבר יש לכם חשבון?' : 'עדיין אין לכם חשבון?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'להתחברות' : 'ליצירת חשבון'}</Link>
        </p>
      </section>
    </main>
  );
}

export default AuthPage;
