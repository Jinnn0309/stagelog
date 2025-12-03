import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MoreHorizontal } from 'lucide-react';
import { ShowRecord } from '../types';
import { getRecords } from '../services/storageService';

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<ShowRecord[]>([]);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ShowRecord | null>(null);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const changeYear = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setShowYearPicker(false);
  };

  const handleDayClick = (dateStr: string) => {
    const dayRecords = records.filter(r => r.date === dateStr && r.status === 'watched');
    if (dayRecords.length > 0) {
      setSelectedRecord(dayRecords[0]);
    }
  };

  const changeYear = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setShowYearPicker(false);
  };

  const handleDayClick = (dateStr: string) => {
    const dayRecords = records.filter(r => r.date === dateStr && r.status === 'watched');
    if (dayRecords.length > 0) {
      setSelectedRecord(dayRecords[0]);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      const dayRecords = records.filter(r => r.date === dateStr && r.status === 'watched');
      const hasRecord = dayRecords.length > 0;
      const primaryRecord = hasRecord ? dayRecords[0] : null;

      days.push(
        <div key={i} className="aspect-square p-[2px] relative">
          <div 
            className={`w-full h-full rounded-lg flex flex-col items-center justify-center overflow-hidden border transition-all cursor-pointer ${
              hasRecord 
              ? 'border-orange-200 dark:border-red-900 bg-orange-50 dark:bg-red-900/20 hover:scale-105' 
              : 'border-transparent bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10'
            }`}
            onClick={() => handleDayClick(dateStr)}
          >
            {primaryRecord?.posterImage ? (
              <img 
                src={primaryRecord.posterImage} 
                alt={primaryRecord.title} 
                className="w-full h-full object-cover"
              />
            ) : hasRecord ? (
              <div className="w-full h-full flex items-center justify-center text-[8px] text-orange-800 dark:text-red-300 font-bold p-1 text-center leading-tight">
                {primaryRecord?.title.slice(0, 4)}
              </div>
            ) : (
              <span className="text-gray-300 dark:text-gray-600 font-medium text-sm">{i}</span>
            )}
            
            {dayRecords.length > 1 && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></div>
            )}
          </div>
        </div>
      );
    }
    return days;
  };

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="pb-24 pt-4 px-4">
      <div className="glass dark:bg-dark-card rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-gray-900 dark:text-white font-mono">
              {currentDate.getFullYear()}.{String(currentDate.getMonth() + 1).padStart(2, '0')}
            </div>
            <button 
              onClick={() => setShowYearPicker(!showYearPicker)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-400"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-500">
            <ChevronRight size={24} />
          </button>
        </div>

        {showYearPicker && (
          <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto">
              {Array.from({length: 10}, (_, i) => {
                const year = new Date().getFullYear() - 5 + i;
                return (
                  <button
                    key={year}
                    onClick={() => changeYear(year)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentDate.getFullYear() === year 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          {weekDays.map(day => (
            <div key={day} className="text-[10px] font-bold text-gray-400 dark:text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>
      
      {/* Month Stats Summary - Quick Glance */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 flex justify-between items-center shadow-inner border border-gray-200 dark:border-gray-700">
         <div>
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Total Shows</p>
             <p className="text-2xl font-bold text-gray-900 dark:text-white">
                 {records.filter(r => {
                     const d = new Date(r.date);
                     return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear() && r.status === 'watched';
                 }).length}
             </p>
         </div>
         <div className="text-right">
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Spending</p>
             <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                 ¥{records.filter(r => {
                     const d = new Date(r.date);
                     return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear() && r.status === 'watched';
                 }).reduce((acc, curr) => acc + curr.price, 0)}
             </p>
         </div>
      </div>

      {/* Show Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedRecord.title}</h3>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              
              {selectedRecord.posterImage && (
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-4">
                  <img src={selectedRecord.posterImage} alt={selectedRecord.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-orange-500" />
                  <span className="text-gray-600 dark:text-gray-300">{selectedRecord.date}</span>
                  {selectedRecord.time && <span className="text-gray-400">• {selectedRecord.time}</span>}
                </div>
                
                {selectedRecord.location && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📍</span>
                    <span className="text-gray-600 dark:text-gray-300">{selectedRecord.location}</span>
                  </div>
                )}
                
                {selectedRecord.price > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">💰</span>
                    <span className="text-gray-600 dark:text-gray-300 font-mono">¥{selectedRecord.price}</span>
                  </div>
                )}
                
                {selectedRecord.cast && selectedRecord.cast.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">演员阵容</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.cast.map((cast, idx) => (
                        <div key={idx} className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-md text-xs">
                          {cast.actor}{cast.role && ` (${cast.role})`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedRecord.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">备注</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;