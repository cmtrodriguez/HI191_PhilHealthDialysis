import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  FileText, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut,
  Hospital,
  Bell,
  Menu, // The sidebar trigger icon
  X     // Close icon for inside the sidebar
} from 'lucide-react';

// Types and Component Imports
import { PDDRegistration } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import RegistrationForm from './components/RegistrationForm.tsx';
import RecordsList from './components/RecordsList.tsx';

type View = 'home' | 'apply' | 'my-records' | 'profile';

export default function App() {
  const [activeView, setActiveView] = useState<View>('home');
  const [registrations, setRegistrations] = useState<PDDRegistration[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Closed by default

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('pdd_registrations');
    if (saved) {
      try {
        setRegistrations(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load registrations", e);
      }
    }
  }, []);

  const saveRegistrations = (newRegs: PDDRegistration[]) => {
    setRegistrations(newRegs);
    localStorage.setItem('pdd_registrations', JSON.stringify(newRegs));
  };

  const addRegistration = (reg: PDDRegistration) => {
    saveRegistrations([reg, ...registrations]);
    setActiveView('my-records');
  };

  const deleteRegistration = (id: string) => {
    saveRegistrations(registrations.filter(r => r.id !== id));
  };

  const navItems = [
    { id: 'home', label: 'Home Portal', icon: LayoutDashboard },
    { id: 'apply', label: 'Apply for Registry', icon: PlusCircle },
    { id: 'my-records', label: 'My Applications', icon: FileText },
    { id: 'profile', label: 'Personal Profile', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative">
      
      {/* --- SIDEBAR --- */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 0,
          opacity: isSidebarOpen ? 1 : 0
        }}
        className="bg-emerald-900 text-white flex flex-col shadow-2xl z-40 overflow-hidden whitespace-nowrap"
      >
        {/* Sidebar Header with Close Button */}
        <div className="p-6 flex items-center justify-between border-b border-emerald-800/50 min-h-[80px]">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <Hospital className="w-5 h-5 text-emerald-900" />
            </div>
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg leading-tight">PhilHealth</h1>
              <p className="text-[10px] text-emerald-300 uppercase tracking-widest font-semibold">Patient Portal</p>
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
                // setIsSidebarOpen(false); // Optional: close sidebar when item is clicked
              }}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                ${activeView === item.id 
                  ? 'bg-emerald-800 text-yellow-400 shadow-inner' 
                  : 'hover:bg-emerald-800/50 text-emerald-100'}
              `}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeView === item.id ? 'text-yellow-400' : 'text-emerald-400 group-hover:text-emerald-200'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Bottom */}
        <div className="p-4 border-t border-emerald-800/50">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-emerald-300 hover:text-white transition-colors">
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
            {/* THIS IS THE ICON BESIDE THE VIEW NAME */}
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
                <p className="text-[10px] text-slate-400 uppercase font-black">Patient</p>
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
              {activeView === 'apply' && <RegistrationForm onSubmit={addRegistration} />}
              {activeView === 'my-records' && <RecordsList registrations={registrations} onDelete={deleteRegistration} />}
              {activeView === 'profile' && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="text-2xl font-bold mb-4 text-slate-800">Personal Profile</h3>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-slate-600">Account settings and security management.</p>
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