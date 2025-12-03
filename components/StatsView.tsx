import React, { useEffect, useState } from 'react';
import { getRecords } from '../services/storageService';
import { ShowRecord } from '../types';
import { Award, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatsViewProps {
  onEdit?: (record: ShowRecord) => void;
}

const COLORS = ['#F97316', '#3B82F6', '#10B981', '#F59E0B', '#6366F1'];
const DARK_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

const StatsView: React.FC<StatsViewProps> = ({ onEdit }) => {
  const [timeRange, setTimeRange] = useState<'day' | 'month' | 'year'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState<{records: ShowRecord[], totalSpent: number, totalShows: number}>({records: [], totalSpent: 0, totalShows: 0});

  // Helper to filter records
  const filterRecords = () => {
    const allRecords = getRecords();
    const filtered = allRecords.filter(r => {
      // Typically stats are for watched shows, but we can include all if we want to track spending on future tickets too.
      // Let's stick to watched + future for "spending" maybe? But usually stats are "History".
      // Let's keep it strictly 'watched' for historical stats.
      if (r.status !== 'watched') return false;
      const d = new Date(r.date);
      
      if (timeRange === 'year') {
        return d.getFullYear() === currentDate.getFullYear();
      } else if (timeRange === 'month') {
        return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
      } else {
        return d.toDateString() === currentDate.toDateString();
      }
    });

    return {
      records: filtered,
      totalShows: filtered.length,
      totalSpent: filtered.reduce((acc, curr) => acc + curr.price, 0)
    };
  };

  useEffect(() => {
    setStats(filterRecords());
  }, [currentDate, timeRange]);

  const shiftDate = (delta: number) => {
    const newDate = new Date(currentDate);
    if (timeRange === 'year') newDate.setFullYear(newDate.getFullYear() + delta);
    else if (timeRange === 'month') newDate.setMonth(newDate.getMonth() + delta);
    else newDate.setDate(newDate.getDate() + delta);
    setCurrentDate(newDate);
  };

  // Charts
  const locationData = stats.records.reduce((acc: any, curr) => {
    const loc = curr.location || 'Unknown';
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.keys(locationData).map(key => ({
    name: key,
    value: locationData[key]
  }));

  const getDateLabel = () => {
    if (timeRange === 'year') return `${currentDate.getFullYear()}`;
    if (timeRange === 'month') return `${currentDate.getFullYear()}.${String(currentDate.getMonth() + 1).padStart(2,'0')}`;
    return `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
  };

  return (
    <div className="pb-24 px-4 pt-24 min-h-screen">
      
      {/* Tech Header */}
      <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-bold dark:text-white uppercase tracking-tighter">Analytics</h2>
          <div className="text-[10px] font-mono text-gray-400 dark:text-gray-500 mb-1">DATA VISUALIZATION</div>
      </div>

      {/* Time Range Toggle */}
      <div className="flex bg-gray-200 dark:bg-black/40 border border-gray-200 dark:border-white/10 p-1.5 rounded-2xl mb-8 shadow-inner">
        {['day', 'month', 'year'].map(t => (
          <button
            key={t}
            onClick={() => setTimeRange(t as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${timeRange === t ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-md scale-100' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 scale-95'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Date Selector */}
      <div className="flex justify-between items-center mb-8 px-2">
         <button onClick={() => shiftDate(-1)} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 rounded-full shadow-sm text-gray-500 border border-gray-100 dark:border-white/10 hover:scale-110 transition-transform">
           &lt;
         </button>
         <span className="text-3xl font-bold font-mono text-blue-900 dark:text-white tracking-tight">{getDateLabel()}</span>
         <button onClick={() => shiftDate(1)} className="w-10 h-10 flex items-center justify-center bg-white dark:bg-white/5 rounded-full shadow-sm text-gray-500 border border-gray-100 dark:border-white/10 hover:scale-110 transition-transform">
           &gt;
         </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass dark:bg-dark-card p-5 rounded-[2rem] shadow-sm flex flex-col justify-between h-36 relative overflow-hidden group border border-white/40 dark:border-white/5">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Award size={64}/>
            </div>
            <div className="flex items-center text-orange-500 dark:text-orange-400 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest border border-orange-200 dark:border-orange-800 px-2 py-0.5 rounded-full">Count</span>
            </div>
            <div>
                <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tighter">{stats.totalShows}</span>
                <span className="text-xs text-gray-400 ml-1 font-bold">SHOWS</span>
            </div>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-red-900 dark:to-black p-5 rounded-[2rem] shadow-xl text-white flex flex-col justify-between h-36 relative overflow-hidden">
             <div className="flex items-center text-white/60 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest border border-white/20 px-2 py-0.5 rounded-full">Spent</span>
            </div>
            <div>
                 <span className="text-3xl font-bold font-mono">¥{stats.totalSpent}</span>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Charts Section */}
      {stats.totalShows > 0 && (
        <div className="glass dark:bg-dark-card p-6 rounded-[2rem] shadow-sm mb-6 border border-white/40 dark:border-white/5">
          <h3 className="text-gray-900 dark:text-white font-bold mb-6 flex items-center text-sm uppercase tracking-wider">
            <MapPin size={16} className="mr-2 text-gray-400" />
            Venues
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DARK_COLORS[index % DARK_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#111', border:'1px solid #333', borderRadius: '12px', color:'#fff', padding: '8px'}} itemStyle={{fontSize: '12px'}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: DARK_COLORS[index % DARK_COLORS.length]}}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <div className="mt-10">
        <h3 className="text-gray-900 dark:text-white font-bold mb-4 ml-2 text-xs uppercase tracking-widest opacity-50">History Log</h3>
        <div className="space-y-3">
            {stats.records.map(record => (
                <div 
                    key={record.id} 
                    onClick={() => onEdit && onEdit(record)}
                    className="glass dark:bg-dark-card p-4 rounded-2xl flex items-center shadow-sm border border-gray-100 dark:border-white/5 group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                    <div className="w-10 h-14 bg-gray-200 dark:bg-gray-800 rounded-md overflow-hidden flex-shrink-0 mr-4 shadow-sm">
                        {record.posterImage ? (
                            <img src={record.posterImage} alt={record.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[8px]">IMG</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 dark:text-white truncate text-sm">{record.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{record.date} • {record.location}</div>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-mono font-bold">¥{record.price}</div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StatsView;