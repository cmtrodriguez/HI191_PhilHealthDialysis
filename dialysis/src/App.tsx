import { useState, useEffect, type FormEvent } from 'react';
import philhealthLogo from './assets/philhealth-logo.png';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  FileText,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Bell,
  Menu,
  X,
  LogIn,
  UserPlus,
  ShieldCheck,
  Activity,
  ArrowRight,
  Hospital,
  Mail,
  LockKeyhole,
} from 'lucide-react';

// Types and Component Imports
import { PDDRegistration } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import RegistrationForm from './components/RegistrationForm.tsx';
import RecordsList from './components/RecordsList.tsx';

type View = 'home' | 'apply' | 'my-records' | 'profile';
type PublicView = 'landing' | 'login' | 'signup' | 'portal';

function getViewFromPath(): PublicView {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/login') return 'login';
  if (path === '/signup') return 'signup';
  if (path === '/portal') return 'portal';

  return 'landing';
}

function PublicHomePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img
              src={philhealthLogo}
              alt="PhilHealth Logo"
              className="w-11 h-11 rounded-xl object-contain bg-white border border-slate-200 p-1 shadow-sm"
            />
            <div>
              <h1 className="text-lg font-black text-emerald-900 leading-tight">
                PhilHealth
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                Patient Portal
              </p>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#features" className="hover:text-emerald-700 transition-colors">
              Features
            </a>
            <a href="/login" className="hover:text-emerald-700 transition-colors">
              Login
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-50 transition-all"
            >
              Login
            </a>
            <a
              href="/signup"
              className="inline-flex px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-800 transition-all"
            >
              Sign Up
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="pt-28">
        <section className="relative bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-yellow-300 text-xs font-black uppercase tracking-widest mb-6">
                <ShieldCheck className="w-4 h-4" />
                Secure PhilHealth Dialysis Access
              </div>

              <h2 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                Manage your PhilHealth dialysis registration online.
              </h2>

              <p className="mt-6 text-lg text-emerald-50 leading-relaxed max-w-xl">
                A simple patient homepage for login, signup, application tracking,
                and PhilHealth Dialysis Database records.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-4">
                <a
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-yellow-400 text-emerald-950 font-black shadow-xl hover:bg-white transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  Login to Account
                </a>

                <a
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/10 border border-white/25 text-white font-black hover:bg-white/20 transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-[2rem] p-6 shadow-2xl border border-emerald-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Portal Preview
                    </p>
                    <h3 className="text-2xl font-black text-slate-800">
                      Patient Dashboard
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-emerald-700" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <p className="font-black text-emerald-900">
                        Latest Application Status
                      </p>
                      <span className="px-3 py-1 rounded-full bg-yellow-300 text-emerald-950 text-[10px] font-black uppercase">
                        Pending
                      </span>
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-emerald-100 overflow-hidden">
                      <div className="h-full w-2/3 bg-emerald-600 rounded-full" />
                    </div>
                    <p className="mt-3 text-sm text-emerald-800">
                      Your registration is being reviewed by the Medical Evaluation Team.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-3xl font-black text-slate-800">24/7</p>
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        Online Access
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-3xl font-black text-slate-800">Z</p>
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        Benefit Support
                      </p>
                    </div>
                  </div>

                  <a
                    href="/portal"
                    className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-900 text-yellow-300 font-black hover:bg-black transition-all"
                  >
                    Open Demo Portal
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-black text-emerald-700 uppercase tracking-[0.2em]">
              Portal Features
            </p>
            <h2 className="mt-3 text-4xl font-black text-slate-900">
              Simple tools for patients
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Login, register, track your dialysis application, and view your records
              in one patient-friendly homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
                <LogIn className="w-7 h-7 text-emerald-700" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Patient Login</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Access your account using your email or PhilHealth information.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center mb-5">
                <UserPlus className="w-7 h-7 text-yellow-700" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Signup Page</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Create a new patient account before using the dialysis portal.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">
                <Hospital className="w-7 h-7 text-blue-700" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Application Portal</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Submit and monitor PhilHealth Dialysis Database registrations.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-emerald-950 text-white">
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={philhealthLogo}
                alt="PhilHealth Logo"
                className="w-10 h-10 rounded-lg object-contain bg-white p-1"
              />
              <div>
                <p className="font-black">PhilHealth Patient Portal</p>
                <p className="text-xs text-emerald-300">
                  Dialysis registration homepage
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5 text-sm font-bold text-emerald-100">
              <a href="/" className="hover:text-yellow-300">
                Home
              </a>
              <a href="/login" className="hover:text-yellow-300">
                Login
              </a>
              <a href="/signup" className="hover:text-yellow-300">
                Sign Up
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700 font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <a href="/" className="flex items-center justify-center gap-3 mb-8">
          <img
            src={philhealthLogo}
            alt="PhilHealth Logo"
            className="w-14 h-14 rounded-2xl bg-white object-contain p-2 shadow-xl"
          />
          <div>
            <h1 className="text-2xl font-black text-white">PhilHealth</h1>
            <p className="text-xs font-bold text-yellow-300 uppercase tracking-widest">
              Patient Login
            </p>
          </div>
        </a>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-[2rem] p-8 shadow-2xl border border-emerald-100"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-7 h-7 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Login to your account
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Enter your patient login details to continue.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Email or PhilHealth PIN
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="juan@email.com or 00-000000000-0"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Password
              </label>
              <div className="relative mt-2">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-emerald-800 text-white font-black shadow-lg shadow-emerald-100 hover:bg-emerald-900 transition-all"
            >
              Login
            </button>
          </div>

          <div className="mt-7 text-center text-sm">
            <p className="text-slate-500">
              No account yet?{' '}
              <a href="/signup" className="font-black text-emerald-700 hover:underline">
                Sign up here
              </a>
            </p>
            <a
              href="/"
              className="inline-block mt-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-emerald-700"
            >
              Back to homepage
            </a>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

function SignupPage({ onSignup }: { onSignup: () => void }) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSignup();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <a href="/" className="flex items-center justify-center gap-3 mb-8">
          <img
            src={philhealthLogo}
            alt="PhilHealth Logo"
            className="w-14 h-14 rounded-2xl bg-white object-contain p-2 shadow-xl border border-slate-200"
          />
          <div>
            <h1 className="text-2xl font-black text-emerald-950">PhilHealth</h1>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Patient Signup
            </p>
          </div>
        </a>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-7 h-7 text-yellow-700" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              Create your patient account
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Sign up to access the PhilHealth Dialysis Patient Portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                First Name
              </label>
              <input
                type="text"
                required
                placeholder="Juan"
                className="mt-2 w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Last Name
              </label>
              <input
                type="text"
                required
                placeholder="Dela Cruz"
                className="mt-2 w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="juan@email.com"
                className="mt-2 w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                PhilHealth PIN
              </label>
              <input
                type="text"
                required
                placeholder="00-000000000-0"
                className="mt-2 w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Create password"
                className="mt-2 w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="Confirm password"
                className="mt-2 w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-7 w-full py-4 rounded-2xl bg-emerald-800 text-white font-black shadow-lg shadow-emerald-100 hover:bg-emerald-900 transition-all"
          >
            Create Account
          </button>

          <div className="mt-7 text-center text-sm">
            <p className="text-slate-500">
              Already have an account?{' '}
              <a href="/login" className="font-black text-emerald-700 hover:underline">
                Login here
              </a>
            </p>
            <a
              href="/"
              className="inline-block mt-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-emerald-700"
            >
              Back to homepage
            </a>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default function App() {
  const [publicView, setPublicView] = useState<PublicView>(() => getViewFromPath());
  const [activeView, setActiveView] = useState<View>('home');
  const [registrations, setRegistrations] = useState<PDDRegistration[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

useEffect(() => {
  const syncRoute = () => {
    setPublicView(getViewFromPath());
  };

  window.addEventListener('popstate', syncRoute);
  syncRoute();

  return () => window.removeEventListener('popstate', syncRoute);
}, []);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('pdd_registrations');
    if (saved) {
      try {
        setRegistrations(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load registrations', e);
      }
    }
  }, []);

const navigateTo = (view: PublicView) => {
  const routes: Record<PublicView, string> = {
    landing: '/',
    login: '/login',
    signup: '/signup',
    portal: '/portal',
  };

  setPublicView(view);
  window.history.pushState(null, '', routes[view]);
  window.scrollTo(0, 0);
};

  const saveRegistrations = (newRegs: PDDRegistration[]) => {
    setRegistrations(newRegs);
    localStorage.setItem('pdd_registrations', JSON.stringify(newRegs));
  };

  const addRegistration = (reg: PDDRegistration) => {
    saveRegistrations([reg, ...registrations]);
    setActiveView('my-records');
  };

  const deleteRegistration = (id: string) => {
    saveRegistrations(registrations.filter((r) => r.id !== id));
  };

  const navItems = [
    { id: 'home', label: 'Home Portal', icon: LayoutDashboard },
    { id: 'apply', label: 'Apply for Registry', icon: PlusCircle },
    { id: 'my-records', label: 'My Applications', icon: FileText },
    { id: 'profile', label: 'Personal Profile', icon: Users },
  ];

  if (publicView === 'landing') {
    return <PublicHomePage />;
  }

  if (publicView === 'login') {
    return (
      <LoginPage
        onLogin={() => {
          setActiveView('home');
          navigateTo('portal');
        }}
      />
    );
  }

  if (publicView === 'signup') {
    return (
      <SignupPage
        onSignup={() => {
          setActiveView('home');
          navigateTo('portal');
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      {/* --- SIDEBAR --- */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 280 : 0,
          opacity: isSidebarOpen ? 1 : 0,
        }}
        className="bg-emerald-900 text-white flex flex-col shadow-2xl z-40 overflow-hidden whitespace-nowrap"
      >
        {/* Sidebar Header with Close Button */}
        <div className="p-6 flex items-center justify-between border-b border-emerald-800/50 min-h-[80px]">
          <div className="flex items-center gap-3">
            <img
              src={philhealthLogo}
              alt="PhilHealth Logo"
              className="w-10 h-10 rounded-lg object-contain bg-white p-1"
            />
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg leading-tight">PhilHealth</h1>
              <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-semibold">
                Patient Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 hover:bg-emerald-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-emerald-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as View);
              }}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  activeView === item.id
                    ? 'bg-emerald-800 text-yellow-400 shadow-inner'
                    : 'hover:bg-emerald-800/50 text-emerald-100'
                }
              `}
            >
              <item.icon
                className={`w-5 h-5 shrink-0 ${
                  activeView === item.id
                    ? 'text-yellow-400'
                    : 'text-emerald-400 group-hover:text-emerald-200'
                }`}
              />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Bottom */}
        <div className="p-4 border-t border-emerald-800/50">
          <button
            onClick={() => {
              setIsSidebarOpen(false);
              navigateTo('landing');
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-emerald-300 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header with the ONLY sidebar button */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all active:scale-95"
              aria-label="Toggle Sidebar"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 capitalize tracking-tight">
              {activeView.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full relative">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">Juan Dela Cruz</p>
                <p className="text-[10px] text-slate-400 uppercase font-black">
                  Patient
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-700 font-black shadow-sm">
                JC
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto"
            >
              {activeView === 'home' && <Dashboard registrations={registrations} />}

              {activeView === 'apply' && (
                <RegistrationForm onSubmit={addRegistration} />
              )}

              {activeView === 'my-records' && (
                <RecordsList
                  registrations={registrations}
                  onDelete={deleteRegistration}
                />
              )}

              {activeView === 'profile' && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">
                    Personal Profile
                  </h3>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-slate-600">
                      Account settings and security management.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Optional: Dark overlay when sidebar is open on smaller screens */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </div>
  );
}