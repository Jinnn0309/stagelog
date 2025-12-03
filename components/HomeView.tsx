import React, { useState } from 'react';
import ShowList from './ShowList';
import { List, CheckCircle } from 'lucide-react';
import { ShowRecord } from '../types';

interface HomeViewProps {
  onEdit?: (record: ShowRecord) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onEdit }) => {
  const [activeTab, setActiveTab] = useState<'towatch' | 'watched'>('towatch');

  return (
    <div>
      {/* Immersive Banner - Shorter Height */}
      <div className="relative w-full h-[320px] overflow-hidden rounded-b-[2.5rem] shadow-2xl z-0 border-b border-gray-800">
        <div className="absolute inset-0 bg-black">
          <img 
            src="https://images.unsplash.com/photo-1514306191717-452ec28c7c31?q=80&w=1920&auto=format&fit=crop" 
            alt="Theater Hall" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent"></div>
        
        {/* Tech/Grid Overlay Effect */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        {/* Banner Content */}
        <div className="absolute bottom-12 left-0 right-0 px-8 z-20 text-white">
          <div className="flex items-center gap-2 mb-3">
             <div className="px-2 py-0.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-[9px] font-mono tracking-widest uppercase text-orange-300">
               THEATER LOG
             </div>
          </div>
          
          <h1 className="text-3xl font-bold leading-tight mb-2 tracking-tight font-serif shadow-black drop-shadow-lg">
            Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-orange-500">Sanctuary</span>
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-8 bg-orange-500"></div>
            <p className="text-gray-300 text-xs font-light tracking-widest uppercase opacity-90 text-shadow">
              心之所向，身之所往
            </p>
          </div>
        </div>
      </div>

      {/* Content Below Banner */}
      <div className="-mt-8 relative z-30 px-3 min-h-[50vh]">
         <div className="glass dark:bg-black/80 dark:border-white/10 backdrop-blur-xl rounded-t-3xl p-2 pt-6 min-h-[500px] border-t border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            
            {/* Tab Switcher */}
            <div className="flex justify-center mb-6">
                <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-full flex relative border border-gray-200 dark:border-white/5">
                    <button
                        onClick={() => setActiveTab('towatch')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'towatch' ? 'bg-white dark:bg-gray-800 text-orange-600 dark:text-white shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <List size={14} className={activeTab === 'towatch' ? 'text-orange-500' : ''} />
                        待看清单
                    </button>
                    <button
                        onClick={() => setActiveTab('watched')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'watched' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-white shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <CheckCircle size={14} className={activeTab === 'watched' ? 'text-blue-500' : ''}/>
                        已看存档
                    </button>
                </div>
            </div>

            <ShowList filter={activeTab} onEdit={onEdit} />
         </div>
      </div>
    </div>
  );
};

export default HomeView;