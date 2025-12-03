import React, { useState } from 'react';

interface AuthProps {
  onLogin: (username: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col justify-center items-center p-6 transition-colors">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-800">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-2 tracking-tighter">StageLog</h1>
        <p className="text-center text-gray-400 mb-8 text-sm uppercase tracking-widest">Digital Theater Journal</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-red-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              placeholder="Enter your name"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black dark:bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            {isLogin ? 'Enter' : 'Join'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            {isLogin ? 'Create an account' : 'Already have an account?'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;