import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, signup, loading, isAuthenticated, user } = useAuth();
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'teacher',
  });
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(loginForm.email, loginForm.password);
      navigate(data.role === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await signup(signupForm);
      navigate(data.role === 'teacher' ? '/teacher' : '/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const activeTabStyle = 'bg-brand-500 text-white border-brand-500';
  const tabStyle = 'border border-slate-300 bg-white text-slate-700';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-slate-800">AssignFlow Portal</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Login or create your account in one place</p>

        <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === 'login' ? activeTabStyle : tabStyle}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === 'signup' ? activeTabStyle : tabStyle}`}
          >
            Sign Up
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="mx-auto mt-6 max-w-md space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-lg bg-brand-500 py-2 font-medium text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="mx-auto mt-6 max-w-2xl space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                required
                placeholder="Name"
                value={signupForm.name}
                onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={signupForm.email}
                onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>

            <input
              type="password"
              required
              placeholder="Password"
              value={signupForm.password}
              onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">How are you joining?</p>
              <div className="grid gap-3 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setSignupForm((prev) => ({ ...prev, role: 'teacher' }))}
                  className={`rounded-xl border p-4 text-left transition ${
                    signupForm.role === 'teacher'
                      ? 'border-brand-500 bg-indigo-50 ring-2 ring-brand-500/30'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <p className="text-lg font-semibold">👨‍🏫 Teacher</p>
                  <p className="mt-1 text-sm text-slate-600">Create &amp; manage assignments</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSignupForm((prev) => ({ ...prev, role: 'student' }))}
                  className={`rounded-xl border p-4 text-left transition ${
                    signupForm.role === 'student'
                      ? 'border-brand-500 bg-indigo-50 ring-2 ring-brand-500/30'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <p className="text-lg font-semibold">👨‍🎓 Student</p>
                  <p className="mt-1 text-sm text-slate-600">View &amp; submit assignments</p>
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-lg bg-brand-500 py-2 font-medium text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
