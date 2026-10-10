import React, { useState, useEffect } from 'react';
import {
  Coffee,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
  Database,
  RefreshCw,
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Users,
  Receipt,
  Scale,
  FileSpreadsheet,
} from 'lucide-react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('chaichukta_token'));
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiHealth, setApiHealth] = useState<{ status: string; service: string; timestamp: string } | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Check API health
  const checkHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setApiHealth(data);
    } catch (err: any) {
      console.error('Health check failed', err);
      setApiHealth(null);
    } finally {
      setCheckingHealth(false);
    }
  };

  // Check current user if token exists
  useEffect(() => {
    checkHealth();
    if (token) {
      fetchMe(token);
    }
  }, [token]);

  const fetchMe = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        // Token invalid or expired
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors && data.errors.length > 0) {
          setErrorMsg(data.errors.map((e: any) => e.message).join(', '));
        } else {
          setErrorMsg(data.error || 'Registration failed');
        }
        return;
      }

      localStorage.setItem('chaichukta_token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      setSuccessMsg('Account created successfully! Welcome to ChaiChukta.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setErrorMsg('Failed to connect to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Login failed. Please verify credentials.');
        return;
      }

      localStorage.setItem('chaichukta_token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      setSuccessMsg(`Welcome back, ${data.user.name}!`);
      setPassword('');
    } catch (err: any) {
      setErrorMsg('Failed to connect to server: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chaichukta_token');
    setToken(null);
    setCurrentUser(null);
    setSuccessMsg('You have been logged out.');
  };

  const fillQuickDemo = (demoType: 'aman' | 'rahul') => {
    if (demoType === 'aman') {
      setName('Aman Sharma');
      setEmail('aman@example.com');
      setPassword('password123');
    } else {
      setName('Rahul Verma');
      setEmail('rahul@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/40">
              <Coffee className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-amber-400 tracking-tight">ChaiChukta</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                  MERN Stack
                </span>
              </div>
              <p className="text-xs text-stone-400">Hisaab Barabar • Transparent Group Expenses</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-stone-300">Backend:</span>
              <span className={`font-medium ${apiHealth ? 'text-emerald-400' : 'text-amber-400'}`}>
                {apiHealth ? 'Connected (MongoDB)' : 'Checking...'}
              </span>
              <button
                onClick={checkHealth}
                disabled={checkingHealth}
                title="Refresh health check"
                className="hover:text-amber-400 ml-1 transition"
              >
                <RefreshCw className={`w-3 h-3 ${checkingHealth ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {currentUser && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-stone-200">{currentUser.name}</div>
                  <div className="text-xs text-stone-400">{currentUser.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full flex flex-col justify-center">
        {/* Banner Alert Messages */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm font-medium flex-1">{errorMsg}</div>
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-200 text-xs">
              ✕
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 flex items-start gap-3 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-sm font-medium flex-1">{successMsg}</div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-200 text-xs">
              ✕
            </button>
          </div>
        )}

        {!currentUser ? (
          /* Authentication Screen (Stage 1) */
          <div className="grid md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto w-full">
            {/* Left Hero Pitch */}
            <div className="md:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Stage 1 Live: Auth & MERN Infrastructure
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight leading-tight">
                No awkward reminders. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                  Just clean splits.
                </span>
              </h1>

              <p className="text-stone-300 text-base leading-relaxed">
                ChaiChukta is built for group trips, flatmates, and dinners. Everything is transparent:
                subsets of members, membership periods with joining/leaving dates, exact paise calculations, 
                and greedy debt simplification with the fewest payments possible.
              </p>

              {/* Feature Highlights Grid */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-1">
                    <Users className="w-4 h-4" /> Membership Periods
                  </div>
                  <p className="text-xs text-stone-400">
                    Friends can join or leave mid-trip. Past expenses stay intact; future expenses exclude departed members.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
                    <Scale className="w-4 h-4" /> Debt Simplification
                  </div>
                  <p className="text-xs text-stone-400">
                    Greedy algorithm resolves tangled IOUs into the minimum number of direct transfers.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-1">
                    <Receipt className="w-4 h-4" /> Zero-Float Precision
                  </div>
                  <p className="text-xs text-stone-400">
                    All money stored strictly in integer paise. No rounding errors or lost pennies.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80">
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-1">
                    <FileSpreadsheet className="w-4 h-4" /> Final Summary & WhatsApp
                  </div>
                  <p className="text-xs text-stone-400">
                    Instant shareable text summary for WhatsApp, printable breakdown, and audit log.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card: Login / Register Form */}
            <div className="md:col-span-5">
              <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-7 shadow-2xl relative">
                {/* Tabs */}
                <div className="flex p-1 rounded-xl bg-stone-900 border border-stone-800 mb-6">
                  <button
                    onClick={() => {
                      setActiveTab('login');
                      setErrorMsg(null);
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
                      activeTab === 'login'
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('register');
                      setErrorMsg(null);
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
                      activeTab === 'register'
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Create Account
                  </button>
                </div>

                <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister} className="space-y-4">
                  {activeTab === 'register' && (
                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1.5">Full Name</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Aman Sharma"
                          className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. aman@example.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                    {activeTab === 'register' && (
                      <p className="text-[11px] text-stone-500 mt-1">Must be at least 6 characters long.</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 mt-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {activeTab === 'login' ? 'Sign In to ChaiChukta' : 'Create My Account'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Demo Fill Buttons */}
                <div className="mt-6 pt-5 border-t border-stone-800/80">
                  <div className="text-[11px] font-medium text-stone-400 mb-2 uppercase tracking-wider">
                    Quick Demo Credentials:
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fillQuickDemo('aman')}
                      className="flex-1 py-1.5 px-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg text-xs text-amber-300 transition text-center"
                    >
                      Fill Aman
                    </button>
                    <button
                      type="button"
                      onClick={() => fillQuickDemo('rahul')}
                      className="flex-1 py-1.5 px-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-lg text-xs text-amber-300 transition text-center"
                    >
                      Fill Rahul
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Preview (Stage 1 Complete) */
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            {/* User Session Hero Card */}
            <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-stone-100">{currentUser.name}</h2>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Authenticated
                      </span>
                    </div>
                    <p className="text-sm text-stone-400">{currentUser.email}</p>
                    <p className="text-xs text-stone-500 mt-1 font-mono">User ID: {currentUser.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-xl text-sm font-medium flex items-center gap-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Stage 1 Verification Checklist */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-stone-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Stage 1: Auth & Architecture
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Verified
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-stone-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span><strong>Mongoose User Schema</strong>: password hashed with bcrypt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span><strong>JWT Auth</strong>: 7-day token signed and verified</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span><strong>Protected Route</strong>: <code>GET /api/auth/me</code> functioning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span><strong>Validation</strong>: <code>express-validator</code> handling malformed data</span>
                  </li>
                </ul>
              </div>

              {/* Ready for Stage 2 Card */}
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-amber-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" /> Next: Stage 2 Overview
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    Ready
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-stone-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Group model with <strong>membership periods</strong> (joinedAt, leftAt)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Expense model with <strong>integer paise shares</strong> & edit history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Active member validation based on expense date</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Soft-delete and audit trail for full transparency</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Token Inspector for Developers */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-300 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Active Session Token (JWT)
                </span>
                <span className="text-[11px] text-stone-500">Stored in localStorage</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-[11px] font-mono text-stone-400 break-all select-all">
                {token}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 py-4 text-center text-xs text-stone-500">
        ChaiChukta • Group Expense Splitter • Built on MERN (MongoDB, Express, React, Node.js)
      </footer>
    </div>
  );
}
