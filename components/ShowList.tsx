import React, { useEffect, useState } from 'react';
import { getRecords, deleteRecord } from '../services/storageService';
import { ShowRecord } from '../types';
import { Trash2, MapPin, Calendar, Clock, Edit3 } from 'lucide-react';

interface ShowListProps {
  filter: 'watched' | 'towatch';
  onEdit?: (record: ShowRecord) => void;
}

const ShowList: React.FC<ShowListProps> = ({ filter, onEdit }) => {
  const [items, setItems] = useState<ShowRecord[]>([]);

  useEffect(() => {
    const all = getRecords();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = all.filter(i => {
        // Ensure date parsing works for "YYYY-MM-DD"
        const showDate = new Date(i.date);
        showDate.setHours(0, 0, 0, 0);

        if (filter === 'towatch') {
            // Future or Today
            return showDate >= today;
        } else {
            // Past
            return showDate < today;
        }
    });

    // Sort: To Watch (Nearest first), Watched (Newest first)
    if (filter === 'towatch') {
         filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
         filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    setItems(filtered);
  }, [filter, getRecords()]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定删除这条记录吗？')) {
      deleteRecord(id);
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleEdit = (record: ShowRecord) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  return (
    <div className="pb-24 px-1">
      <div className="flex items-center justify-between mb-4 px-2">
         <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 flex items-center gap-2 uppercase tracking-widest">
           {filter === 'watched' ? 'History' : 'Upcoming'}
         </h2>
         <span className="text-[10px] text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
           {items.length} SHOWS
         </span>
      </div>
      
      <div className="space-y-4">
        {items.map(item => (
          <div 
            key={item.id} 
            onClick={() => handleEdit(item)}
            className="glass dark:bg-dark-card rounded-2xl p-3 flex gap-4 transition-all hover:scale-[1.01] active:scale-[0.99] group cursor-pointer border border-white/40 dark:border-white/5 shadow-sm"
          >
            {/* Poster */}
            <div className="w-24 h-32 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 shadow-md relative">
               {item.posterImage ? (
                 <img src={item.posterImage} className="w-full h-full object-cover" alt={item.title}/>
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-xs text-gray-400 p-2 text-center bg-gray-100 dark:bg-gray-800">
                    <span className="text-2xl mb-1">🎭</span>
                    <span>No Poster</span>
                 </div>
               )}
            </div>
            
            {/* Info */}
            <div className="flex-1 flex flex-col relative justify-between py-1">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-2 line-clamp-2 tracking-tight">
                  {item.title}
                </h3>
                
                <div className="space-y-2">
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <Calendar size={12} className="mr-1.5 text-orange-500"/> 
                        <span className="font-mono font-medium">{item.date}</span>
                        <div className="w-px h-3 bg-gray-300 dark:bg-gray-700 mx-2"></div>
                        <span className="font-mono">{item.time}</span>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                        <MapPin size={12} className="mr-1.5"/> 
                        {item.location}
                    </div>
                </div>
              </div>

              <div className="flex justify-between items-end mt-2">
                <span className="text-gray-900 dark:text-white font-bold font-mono text-lg">
                  {item.price > 0 ? `¥${item.price}` : <span className="text-xs text-gray-400 font-sans font-normal">--</span>}
                </span>
                <div className="flex gap-2 opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                      className="p-1.5 rounded-full text-gray-400 hover:text-blue-500 bg-gray-50 dark:bg-white/5 transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-white/5 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-16 rounded-3xl border-dashed border-2 border-gray-200 dark:border-white/10 flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-3 text-2xl opacity-50">
                {filter === 'towatch' ? '📅' : '🎬'}
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                {filter === 'towatch' ? 'No upcoming shows' : 'No history yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowList;