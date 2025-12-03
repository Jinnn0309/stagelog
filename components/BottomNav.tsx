import React from 'react';
import { Calendar, PlusCircle, BarChart2, User, Home } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={22} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={22} /> },
    { id: 'add', label: 'Add', icon: <PlusCircle size={30} />, isPrimary: true },
    { id: 'stats', label: 'Stats', icon: <BarChart2 size={22} /> },
    { id: 'settings', label: 'Me', icon: <User size={22} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 dark:bg-dark-bg/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 pb-safe pt-2 px-6 flex justify-between items-end z-50 h-20">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center justify-center pb-2 transition-all duration-300 ${
            activeTab === item.id 
              ? 'text-orange-500 dark:text-red-500 transform -translate-y-1' 
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          } ${item.isPrimary ? 'text-orange-500 dark:text-red-500' : ''}`}
        >
          {item.isPrimary ? (
             <div className="bg-gradient-to-tr from-orange-400 to-pink-500 dark:from-red-600 dark:to-red-800 text-white p-3 rounded-full shadow-lg shadow-orange-200 dark:shadow-red-900/40 mb-3 transform hover:scale-110 transition-transform active:scale-95">
               <PlusCircle size={26} />
             </div>
          ) : (
            <>
              {item.icon}
              <span className="text-[9px] mt-1 font-bold uppercase tracking-wide opacity-80">{item.label}</span>
            </>
          )}
        </button>
      ))}
    </div>
  );
};

export default BottomNav;