import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';

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

  const activeTabStyle = 'bg-flux-blue text-white shadow-md transform scale-105 transition-all duration-300';
  const tabStyle = 'bg-flux-lightgray text-flux-darkgray hover:bg-slate-200 transition-all duration-300';

  return (
    <div className="flex min-h-screen bg-flux-lightgray font-sans">
      {/* Left Pane - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-flux-navy p-12 text-white relative overflow-hidden">
        {/* Subtle background abstract shape/gradient */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-flux-blue rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-flux-green rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 text-flux-green font-black text-3xl tracking-tighter">
              <span className="text-flux-darkgray">&gt;</span>
              <span className="text-flux-blue">&gt;</span>
              <span className="text-flux-green">&gt;</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">FLUX</h1>
          </div>
          <p className="mt-2 text-slate-400 font-medium tracking-wide text-sm uppercase">Assignment Workflow Portal</p>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-flux-blue to-flux-green">Learning Workflow</span>.
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Elevate the way you manage assignments. Whether you're seamlessly assigning tasks or submitting work, FLUX streamlines the entire educational process.
          </p>
          
          <div className="mt-10 flex gap-4">
             <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 flex items-center gap-4">
                <div className="bg-flux-blue/20 p-3 rounded-full text-flux-blue">
                   <Briefcase size={24} />
                </div>
                <div>
                   <h4 className="font-semibold">For Teachers</h4>
                   <p className="text-sm text-slate-400">Streamline grading</p>
                </div>
             </div>
             <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 flex items-center gap-4">
                <div className="bg-flux-green/20 p-3 rounded-full text-flux-green">
                   <GraduationCap size={24} />
                </div>
                <div>
                   <h4 className="font-semibold">For Students</h4>
                   <p className="text-sm text-slate-400">Track deadlines</p>
                </div>
             </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-slate-800/50">
          <p className="text-sm text-slate-500">© 2024 FLUX Education. All rights reserved.</p>
        </div>
      </div>

      {/* Right Pane - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 background-pattern">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-200/50 relative z-10 border border-slate-100">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <div className="flex gap-1 text-flux-green font-black text-2xl tracking-tighter">
                <span className="text-flux-darkgray">&gt;</span>
                <span className="text-flux-blue">&gt;</span>
                <span className="text-flux-green">&gt;</span>
              </div>
              <h1 className="text-2xl font-bold text-flux-navy tracking-tight">FLUX</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium">Assignment Workflow Portal</p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-flux-navy">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {mode === 'login' ? 'Enter your details to access your dashboard' : 'Join FLUX to transform your educational experience'}
            </p>
          </div>

          <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${mode === 'login' ? activeTabStyle : tabStyle}`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold ${mode === 'signup' ? activeTabStyle : tabStyle}`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="you@school.edu"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-flux-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-flux-blue/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-flux-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-flux-blue/10 transition-all"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-flux-blue py-3.5 mt-2 font-semibold text-white shadow-lg shadow-flux-blue/30 hover:bg-flux-navy hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 transition-all cursor-pointer group"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-flux-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-flux-blue/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="you@school.edu"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-flux-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-flux-blue/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-flux-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-flux-blue/10 transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="mb-3 text-sm font-semibold text-slate-700 ml-1">I am joining as a:</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setSignupForm((prev) => ({ ...prev, role: 'teacher' }))}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                      signupForm.role === 'teacher'
                        ? 'border-flux-blue bg-blue-50/50 shadow-md transform -translate-y-1'
                        : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 ${signupForm.role === 'teacher' ? 'border-flux-blue bg-flux-blue' : 'border-slate-300'}`}>
                      {signupForm.role === 'teacher' && <div className="w-full h-full rounded-full border-2 border-white"></div>}
                    </div>
                    <div className={`mb-3 p-2 rounded-lg inline-block ${signupForm.role === 'teacher' ? 'bg-flux-blue/10 text-flux-blue' : 'bg-slate-100 text-slate-500'}`}>
                      <Briefcase size={20} />
                    </div>
                    <p className="font-bold text-flux-navy">Teacher</p>
                    <p className="mt-1 text-xs text-slate-500 font-medium">Manage classes</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSignupForm((prev) => ({ ...prev, role: 'student' }))}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                      signupForm.role === 'student'
                        ? 'border-flux-green bg-green-50/50 shadow-md transform -translate-y-1'
                        : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 ${signupForm.role === 'student' ? 'border-flux-green bg-flux-green' : 'border-slate-300'}`}>
                      {signupForm.role === 'student' && <div className="w-full h-full rounded-full border-2 border-white"></div>}
                    </div>
                    <div className={`mb-3 p-2 rounded-lg inline-block ${signupForm.role === 'student' ? 'bg-flux-green/10 text-flux-green' : 'bg-slate-100 text-slate-500'}`}>
                      <GraduationCap size={20} />
                    </div>
                    <p className="font-bold text-flux-navy">Student</p>
                    <p className="mt-1 text-xs text-slate-500 font-medium">Submit work</p>
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-flux-navy py-3.5 mt-4 font-semibold text-white shadow-lg shadow-flux-navy/20 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 transition-all cursor-pointer group"
              >
                {loading ? 'Creating...' : 'Create Account'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
