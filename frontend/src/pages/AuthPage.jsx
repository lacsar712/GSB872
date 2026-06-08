import React, { useState } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { User, Camera } from 'lucide-react';

const AuthPage = () => {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'); // Default
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateRandomAvatar = () => {
        setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Try to login first (if user exists), else register logic might handle it or we use split logic
            // The instruction says "Register... Auto Login".
            // I'll try register endpoint first.
            const res = await api.post('/auth/register', { name, avatar });
            localStorage.setItem('token', res.data.access_token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (error) {
           // If register fails (e.g. name taken), try login
           try {
               const loginRes = await api.post('/auth/login', { name });
               localStorage.setItem('token', loginRes.data.access_token);
               localStorage.setItem('user', JSON.stringify(loginRes.data.user));
               navigate('/');
           } catch (loginError) {
               setError('Authentication failed. Please try again.');
           }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900 opacity-90 z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070&auto=format&fit=crop" 
                    alt="Bible Study" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-20 flex flex-col justify-center px-12 text-white">
                    <h1 className="text-5xl font-bold mb-6">SDA 读经打卡</h1>
                    <p className="text-xl text-blue-100 max-w-md">每天坚持读经，记录灵程，与神同行。加入我们的读经计划，开启您的属灵成长之旅。</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gray-50">
                <div className="w-full h-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">SDA 读经打卡</h1>
                        <p className="text-gray-500 mt-2">开启您的属灵旅程</p>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2 hidden lg:block">欢迎回来</h2>
                    <p className="text-gray-500 mb-8 hidden lg:block">请输入您的名字开始打卡</p>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                选择头像
                            </label>
                            <div className="flex justify-center mb-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 cursor-pointer hover:border-blue-100 transition-colors bg-gray-100">
                                        <img 
                                            src={avatar} 
                                            alt="Avatar" 
                                            className="w-full h-full object-cover"
                                            onClick={generateRandomAvatar}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateRandomAvatar}
                                        className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border hover:bg-gray-50 text-xs"
                                        title="更换头像"
                                    >
                                        🎲
                                    </button>
                                </div>
                            </div>
                            <p className="text-center text-xs text-gray-400 mb-4">点击图片随机更换头像</p>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                您的名字
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="请输入名字 (用于记录打卡)"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg flex items-center">
                                <span className="mr-2">⚠️</span> {error === 'Authentication failed. Please try again.' ? '认证失败，请重试' : error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    处理中...
                                </>
                            ) : '立即开始'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
