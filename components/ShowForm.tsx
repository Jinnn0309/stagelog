import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Calendar, DollarSign, Users, X, Image as ImageIcon, Sparkles, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { ShowRecord } from '../types';
import { saveRecord, updateRecord } from '../services/storageService';

interface ShowFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ShowRecord | null;
}

const CITIES = ['上海', '北京', '广州', '深圳', '杭州', '南京', '武汉', '成都'];
const VENUES: Record<string, string[]> = {
  '上海': ['上海文化广场', '上海大剧院', '美琪大戏院', '上音歌剧院', '1862时尚艺术中心', '人民大舞台', '云峰剧院', '共舞台', '上海大舞台', '东方艺术中心'],
  '北京': ['天桥艺术中心', '保利剧院', '二七剧场', '世纪剧院', '展览馆剧场', '国家大剧院', '喜剧院'],
  '广州': ['广州大剧院', '广东艺术剧院', '友谊剧院'],
  '深圳': ['深圳保利剧院', '滨海艺术中心', '南山文体中心'],
  '杭州': ['杭州大剧院', '余杭大剧院', '蝴蝶剧场', '临平大剧院'],
  '南京': ['南京保利大剧院', '江苏大剧院'],
  '武汉': ['武汉琴台大剧院', '武汉剧院'],
  '成都': ['四川大剧院', '城市音乐厅']
};

const ShowForm: React.FC<ShowFormProps> = ({ onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState<Partial<ShowRecord>>({
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    cast: [],
    price: 0
  });
  const [smartText, setSmartText] = useState('');
  const [showSmartParse, setShowSmartParse] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedCity, setSelectedCity] = useState('上海');
  const [castInput, setCastInput] = useState({ role: '', actor: '' });
  const [errors, setErrors] = useState<{title?: boolean, date?: boolean}>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Simple heuristic parser
  const parseSmartText = () => {
    if (!smartText) return;
    
    let newData: Partial<ShowRecord> = { ...formData };
    
    // Date: 2024.10.20 or 10月20日
    const dateMatch = smartText.match(/(\d{4})[-年.](\d{1,2})[-月.](\d{1,2})/);
    if (dateMatch) {
       newData.date = `${dateMatch[1]}-${dateMatch[2].padStart(2,'0')}-${dateMatch[3].padStart(2,'0')}`;
    } else {
        const shortDate = smartText.match(/(\d{1,2})月(\d{1,2})日/);
        if (shortDate) {
            const year = new Date().getFullYear();
            newData.date = `${year}-${shortDate[1].padStart(2,'0')}-${shortDate[2].padStart(2,'0')}`;
        }
    }

    // Time: 19:30
    const timeMatch = smartText.match(/(\d{1,2}:\d{2})/);
    if (timeMatch) newData.time = timeMatch[1];

    // Price: 580元
    const priceMatch = smartText.match(/(?:票价|￥|¥)\s*(\d+)/);
    if (priceMatch) newData.price = parseInt(priceMatch[1]);

    // Location: Heuristic - look for common words
    const locKeywords = ['大剧院', '文化广场', '艺术中心', '体育馆', '剧场'];
    // Split by lines or spaces
    const parts = smartText.split(/[\s\n]+/);
    for (const part of parts) {
        if (locKeywords.some(k => part.includes(k))) {
            newData.location = part;
            break;
        }
    }

    newData.notes = smartText;

    setFormData(newData);
    setShowSmartParse(false);
  };

  const handleInputChange = (key: keyof ShowRecord, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error if typing
    if (errors[key as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'posterImage' | 'seatImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCastMember = () => {
    if (castInput.actor) {
      const newCast = [...(formData.cast || []), castInput];
      handleInputChange('cast', newCast);
      setCastInput({ role: '', actor: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {
        title: !formData.title,
        date: !formData.date
    };
    setErrors(newErrors);

    if (newErrors.title || newErrors.date) {
        // Shake or notify
        return;
    }

    // Auto-determine status based on time
    const showDate = new Date(formData.date!);
    const today = new Date();
    today.setHours(0,0,0,0);
    // If date is strictly before today, it is watched.
    // If date is today or future, it is towatch.
    const status = showDate < today ? 'watched' : 'towatch';

    const recordToSave: ShowRecord = {
      id: initialData?.id || Date.now().toString(),
      title: formData.title!,
      date: formData.date!,
      time: formData.time || '',
      location: formData.location || '',
      price: Number(formData.price) || 0,
      cast: formData.cast || [],
      status: status,
      posterImage: formData.posterImage,
      seatImage: formData.seatImage,
      notes: formData.notes
    };

    if (initialData?.id) {
        updateRecord(recordToSave);
    } else {
        saveRecord(recordToSave);
    }
    
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-dark-bg z-50 overflow-y-auto pb-20 animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-dark-bg/90 backdrop-blur-md p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center z-20">
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X size={24} />
        </button>
        <div className="flex flex-col items-center">
             <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide uppercase">{initialData ? 'Edit Record' : 'New Record'}</h2>
             <span className="text-[10px] text-gray-400 font-mono tracking-widest">{initialData ? 'UPDATE SHOW' : 'ADD SHOW'}</span>
        </div>
        <button 
          onClick={handleSubmit}
          className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg shadow-orange-900/20 transition-all active:scale-95"
        >
          Save
        </button>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Smart Parse Toggle - Only show if new record */}
        {!initialData && (
          <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10 transition-all">
             <button 
               onClick={() => setShowSmartParse(!showSmartParse)}
               className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide mb-2"
             >
               <Sparkles size={14} className="mr-2" />
               {showSmartParse ? 'Close Smart Parser' : 'Smart Parse Ticket'}
             </button>
             
             {showSmartParse && (
               <div className="animate-in fade-in zoom-in-95 duration-200 mt-3">
                 <textarea
                   className="w-full bg-white dark:bg-black border-2 border-blue-100 dark:border-blue-900/30 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-300 focus:border-blue-500 outline-none mb-3 font-mono"
                   rows={4}
                   placeholder="Paste ticket info here..."
                   value={smartText}
                   onChange={(e) => setSmartText(e.target.value)}
                 />
                 <button 
                   onClick={parseSmartText}
                   className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg"
                 >
                   Auto Fill
                 </button>
               </div>
             )}
          </div>
        )}

        {/* Poster Upload (Big) */}
        <div className="flex justify-center">
            <label className="w-40 h-56 bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 dark:hover:border-orange-500 transition-colors overflow-hidden relative group">
                {formData.posterImage ? (
                    <img src={formData.posterImage} alt="Poster" className="w-full h-full object-cover" />
                ) : (
                    <>
                        <div className="p-4 bg-white dark:bg-white/10 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
                            <ImageIcon className="text-gray-400 dark:text-gray-400" size={24} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Upload Poster</span>
                    </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'posterImage')} />
            </label>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
            <div className="group relative">
                <input 
                    type="text" 
                    placeholder="请输入剧目名称" 
                    className={`block w-full text-2xl font-bold bg-transparent border-b-2 py-2 outline-none transition-colors peer text-gray-900 dark:text-white ${errors.title ? 'border-red-500 placeholder-red-500' : 'border-gray-200 dark:border-gray-800 focus:border-orange-500 dark:focus:border-orange-500'}`}
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                />
                <label className={`absolute left-0 top-3 text-lg transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-orange-500 peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs ${errors.title ? 'text-red-500' : 'text-gray-400'}`}>
                    Show Title {errors.title && '* Required'}
                </label>
            </div>

            <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${errors.date ? 'text-red-500' : 'text-gray-400'}`}><Calendar size={12}/> Date {errors.date && '*'}</label>
                    <input 
                        type="date" 
                        className={`w-full bg-gray-50 dark:bg-white/5 border focus:border-orange-500 dark:focus:border-orange-500 rounded-lg px-3 py-2 outline-none text-gray-800 dark:text-gray-200 font-mono text-sm h-12 ${errors.date ? 'border-red-500' : 'border-transparent'}`}
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Clock size={12}/> Time</label>
                    <input 
                        type="time" 
                        className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-orange-500 dark:focus:border-orange-500 rounded-lg px-3 py-2 outline-none text-gray-800 dark:text-gray-200 font-mono text-sm h-12"
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                    />
                </div>
            </div>

            {/* Location with Quick Select */}
             <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><MapPin size={12}/> Location</label>
                    <button 
                        type="button"
                        onClick={() => setShowLocationPicker(!showLocationPicker)}
                        className="text-[10px] text-blue-500 font-bold uppercase tracking-wider flex items-center hover:text-blue-600 transition-colors"
                    >
                        {showLocationPicker ? 'Hide Options' : 'Quick Select'}
                        {showLocationPicker ? <ChevronUp size={12} className="ml-1"/> : <ChevronDown size={12} className="ml-1"/>}
                    </button>
                </div>
                
                <input 
                    type="text" 
                    placeholder="请输入剧院名称" 
                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-orange-500 dark:focus:border-orange-500 rounded-lg px-4 py-3 outline-none text-gray-800 dark:text-gray-200 text-sm h-12"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                />

                {/* Location Picker */}
                {showLocationPicker && (
                    <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Cities */}
                        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
                            {CITIES.map(city => (
                                <button
                                    key={city}
                                    type="button"
                                    onClick={() => setSelectedCity(city)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedCity === city ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                        {/* Venues */}
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                            {VENUES[selectedCity]?.map(venue => (
                                <button
                                    key={venue}
                                    type="button"
                                    onClick={() => {
                                        handleInputChange('location', venue);
                                        setShowLocationPicker(false);
                                    }}
                                    className="px-2 py-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md text-[10px] text-gray-700 dark:text-gray-300 hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
                                >
                                    {venue}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

             <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><DollarSign size={12}/> Price</label>
                <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400">¥</span>
                    <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full bg-gray-50 dark:bg-white/5 border border-transparent focus:border-orange-500 dark:focus:border-orange-500 rounded-lg pl-8 pr-4 py-3 outline-none text-gray-800 dark:text-gray-200 font-mono text-lg h-12"
                        value={formData.price || ''}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                    />
                </div>
            </div>
        </div>

        {/* Cast */}
        <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
             <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-4 block flex items-center gap-1"><Users size={12}/> Cast & Crew</label>
             <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
                 {formData.cast?.map((c, idx) => (
                     <div key={idx} className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 pl-3 pr-2 py-1 rounded-md text-xs border border-orange-100 dark:border-orange-800/30 flex items-center gap-2">
                         <span className="font-bold">{c.actor}</span>
                         {c.role && <span className="text-orange-400 opacity-70 text-[10px] uppercase border-l border-orange-200 dark:border-orange-700 pl-2">{c.role}</span>}
                     </div>
                 ))}
                 {(!formData.cast || formData.cast.length === 0) && <span className="text-gray-400 text-xs italic">No cast added yet</span>}
             </div>
             
             <div className="flex gap-2">
                 <input 
                    type="text" 
                    placeholder="请输入演员姓名" 
                    className="flex-[2] px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black text-sm outline-none focus:border-orange-500 dark:text-white h-12"
                    value={castInput.actor}
                    onChange={(e) => setCastInput({...castInput, actor: e.target.value})}
                 />
                 <input 
                    type="text" 
                    placeholder="角色" 
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black text-sm outline-none focus:border-orange-500 dark:text-white h-12"
                    value={castInput.role}
                    onChange={(e) => setCastInput({...castInput, role: e.target.value})}
                 />
                 <button type="button" onClick={addCastMember} className="bg-gray-900 dark:bg-white text-white dark:text-black p-2 rounded-lg hover:opacity-80 transition-opacity">
                     <Users size={18} />
                 </button>
             </div>
        </div>

        {/* Perspective Photo */}
         <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Camera size={12}/> Seat View / Ticket</label>
            <label className="w-full h-32 bg-gray-50 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 dark:hover:border-orange-500 transition-colors overflow-hidden relative">
                {formData.seatImage ? (
                    <img src={formData.seatImage} alt="Seat view" className="w-full h-full object-cover" />
                ) : (
                    <>
                        <Camera className="text-gray-300 dark:text-gray-600 mb-2" size={24} />
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">Add Photo</span>
                    </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'seatImage')} />
            </label>
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default ShowForm;