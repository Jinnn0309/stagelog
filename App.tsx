import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import BottomNav from './components/BottomNav';
import CalendarView from './components/CalendarView';
import StatsView from './components/StatsView';
import ShowForm from './components/ShowForm';
import HomeView from './components/HomeView';
import { User, ShowRecord } from './types';
import { Moon, Sun, Award, LogOut, Ticket, Star, Crown, Zap } from 'lucide-react';
import { getRecords } from './services/storageService';

const App: React.FC = () => {
  const [user, setUser] = useState<User>({ username: '', isLoggedIn: false });
  const [activeTab, setActiveTab] = useState('home');
  const [showForm, setShowForm] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [records, setRecords] = useState<ShowRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<ShowRecord | null>(null);

  // Refresh records for badges
  useEffect(() => {
    if (activeTab === 'settings') {
        setRecords(getRecords());
    }
  }, [activeTab]);

  useEffect(() => {
    // User session
    const savedUser = localStorage.getItem('stagelog_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Theme init
    const savedTheme = localStorage.getItem('stagelog_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('stagelog_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogin = (username: string) => {
    const newUser = { username, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem('stagelog_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('stagelog_user');
    setUser({ username: '', isLoggedIn: false });
  };

  const handleEditRecord = (record: ShowRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  if (!user.isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  // Calculate Badges
  const watchedCount = records.filter(r => r.status === 'watched').length;
  const totalSpent = records.reduce((a,c) => a + c.price, 0);
  const badges = [
      { id: 'first', name: '初入剧场', desc: '记录第1部剧', earned: watchedCount >= 1, icon: <Ticket size={18} />, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
      { id: 'fan', name: '资深剧迷', desc: '看过10部剧', earned: watchedCount >= 10, icon: <Star size={18} />, color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' },
      { id: 'rich', name: '黄金座席', desc: '消费超2000元', earned: totalSpent >= 2000, icon: <Crown size={18} />, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
      { id: 'night', name: '夜猫子', desc: '看22点后剧目', earned: records.some(r => parseInt(r.time.split(':')[0]) >= 22), icon: <Moon size={18} />, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
      { id: 'early', name: '早鸟', desc: '记录未来剧目', earned: records.some(r => r.status === 'towatch'), icon: <Zap size={18} />, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onEdit={handleEditRecord} />;
      case 'calendar':
        return <CalendarView />;
      case 'stats':
        return <StatsView onEdit={handleEditRecord} />;
      case 'settings':
        return (
          <div className="p-6 pt-24 min-h-screen">
             <div className="glass dark:bg-dark-card rounded-3xl p-6 shadow-xl mb-6 border border-white/20 dark:border-white/5 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
                
                <div className="flex items-center space-x-5 mb-8 relative z-10">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 dark:from-white dark:to-gray-400 flex items-center justify-center text-white dark:text-black text-3xl font-bold shadow-lg ring-4 ring-white/10">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold dark:text-white tracking-tight">{user.username}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono tracking-widest uppercase">StageLog Member</p>
                  </div>
                </div>

                {/* Badge Grid */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                        <Award size={14} className="mr-2"/> Achievements
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {badges.map(badge => (
                            <div key={badge.id} className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${badge.earned ? 'border-transparent bg-white dark:bg-white/5 shadow-sm' : 'border-dashed border-gray-200 dark:border-gray-700 opacity-50 grayscale'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${badge.color}`}>
                                    {badge.icon}
                                </div>
                                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{badge.name}</span>
                                <span className="text-[9px] text-gray-400 text-center mt-0.5">{badge.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center p-4 bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                     <span className="text-gray-700 dark:text-gray-300 font-bold text-sm">Dark Mode</span>
                     <button onClick={toggleTheme} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
                       {theme === 'light' ? <Sun size={18} className="text-orange-500"/> : <Moon size={18} className="text-blue-400"/>}
                     </button>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
             </div>
          </div>
        );
      default:
        return <HomeView onEdit={handleEditRecord} />;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 max-w-md mx-auto z-40 px-6 py-4 flex justify-between items-center transition-all duration-500 ${activeTab === 'home' ? 'bg-transparent text-white pt-6' : 'bg-white/80 dark:bg-dark-bg/90 backdrop-blur-md text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800'}`}>
        <h1 className={`text-lg font-bold tracking-widest uppercase font-mono ${activeTab === 'home' ? 'text-white/80' : ''}`}>StageLog</h1>
      </header>

      <main className="min-h-screen pb-20">
        {renderContent()}
      </main>

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          if (tab === 'add') {
            setEditingRecord(null); // Clear editing state for new record
            setShowForm(true);
          } else {
            setActiveTab(tab);
          }
        }} 
      />

      {showForm && (
        <ShowForm 
          onClose={() => {
            setShowForm(false);
            setEditingRecord(null);
          }} 
          onSuccess={() => {
            setShowForm(false);
            setEditingRecord(null);
          }}
          initialData={editingRecord}
        />
      )}
    </div>
  );
};

export default App;