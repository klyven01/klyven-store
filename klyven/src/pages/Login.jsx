import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, signUp, enabled } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Enter your email above first, then tap "Forgot password?".');
      return;
    }
    setError('');
    const { supabase } = await import('../lib/supabaseClient');
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (error) setError(error.message);
    else setInfo('Password reset email sent — check your inbox.');
  };

  if (!enabled) {
    return (
      <div className="max-w-sm mx-auto px-5 py-24 text-center">
        <SEO title="Login — KLYVEN" />
        <p className="spec-tag text-steel">
          Customer accounts aren't set up yet — connect Supabase to enable login (see README).
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);
    const { error } = mode === 'login' ? await signIn(email, password) : await signUp(email, password);
    setSubmitting(false);
    if (error) return setError(error.message);
    if (mode === 'signup') {
      setInfo('Account created. Check your email if verification is required, then log in.');
      setMode('login');
      return;
    }
    navigate('/account');
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-16 md:py-24">
      <SEO title="Login — KLYVEN" description="Log in to your KLYVEN account." />
      <h1 className="font-display text-3xl text-bone mb-8">{mode === 'login' ? 'Log In' : 'Create Account'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="spec-tag text-steel block mb-1.5">Email</span>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="spec-tag text-steel block mb-1.5">Password</span>
          <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
        </label>
        {error && <p className="text-signal spec-tag">{error}</p>}
        {info && <p className="text-signal spec-tag normal-case text-sm">{info}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full spec-tag bg-bone text-void px-6 py-3 hover:bg-signal hover:text-white transition-colors disabled:opacity-50"
        >
          {submitting ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>
      </form>

      {mode === 'login' && (
        <button onClick={handleForgotPassword} className="spec-tag text-steel hover:text-bone mt-4">
          Forgot password?
        </button>
      )}

      <button
        onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setInfo(''); }}
        className="spec-tag text-steel hover:text-bone mt-6"
      >
        {mode === 'login' ? "New here? Create an account →" : 'Already have an account? Log in →'}
      </button>

      <Link to="/track-order" className="block spec-tag text-steel hover:text-bone mt-4">
        Just tracking an order? →
      </Link>
    </div>
  );
}
