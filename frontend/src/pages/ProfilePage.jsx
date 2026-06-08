import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { LogOut, Calendar, BookOpen, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/checkins/history').then(res => setHistory(res.data));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
    };

    return (
        <div className="pb-24 pt-6 px-4 max-w-lg mx-auto">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10"></div>
                 <div className="relative z-10">
                    <img src={user?.avatar} alt={user?.name} className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h1>
                    <p className="text-gray-500 text-sm mb-6">加入时间: {new Date(user?.created_at).toLocaleDateString()}</p>
                    
                    <button 
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center mx-auto"
                    >
                        <LogOut size={16} className="mr-2" />
                        退出登录
                    </button>
                 </div>
            </div>


            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2">
                         <CheckCircle2 size={20} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{history.length}</span>
                    <span className="text-xs text-gray-400">累计打卡(天)</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-2">
                         <BookOpen size={20} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                        {new Set(history.map(h => h.book_name)).size}
                    </span>
                    <span className="text-xs text-gray-400">阅读卷数</span>
                </div>
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Calendar size={20} className="mr-2 text-blue-600" />
                我的打卡记录
            </h2>

            <div className="space-y-4">
                {history.length > 0 ? (
                    history.map(checkIn => (
                        <div key={checkIn.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900">{checkIn.book_name}</h3>
                                <span className="text-xs text-gray-400">{new Date(checkIn.created_at).toLocaleDateString()}</span>
                             </div>
                             <p className="text-sm text-gray-600 mb-2">
                                章节: {checkIn.chapters.join(', ')}
                             </p>
                             {checkIn.comment && (
                                 <p className="text-sm text-gray-500 italic bg-gray-50 p-2 rounded">"{checkIn.comment}"</p>
                             )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                        暂无打卡记录
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
