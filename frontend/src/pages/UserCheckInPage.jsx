import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeft, BookOpen, Calendar, CheckCircle2 } from 'lucide-react';

const UserCheckInPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
             try {
                 const res = await api.get(`/checkins/user/${userId}`);
                 // Helper to handle both paginated and non-paginated responses just in case, 
                 // though we know it is paginated now.
                 const data = res.data.data ? res.data.data : res.data;
                 setHistory(data);
                 
                 // Extract user info from the first record if available
                 if (data.length > 0 && data[0].user) {
                     setUserInfo(data[0].user);
                 }
             } catch (error) {
                 console.error("Failed to fetch user history", error);
             } finally {
                 setLoading(false);
             }
        };
        fetchHistory();
    }, [userId]);

    return (
        <div className="pb-24 pt-6 px-4 max-w-lg mx-auto">
             <button 
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-gray-500 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={20} className="mr-1" />
                返回
            </button>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-2xl"></div>
                    <div className="h-20 bg-gray-200 rounded-xl"></div>
                    <div className="h-20 bg-gray-200 rounded-xl"></div>
                </div>
            ) : (
                <>
                    {userInfo && (
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-10"></div>
                            <div className="relative z-10">
                                <img src={userInfo.avatar} alt={userInfo.name} className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md mb-4" />
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">{userInfo.name}</h1>
                                <p className="text-gray-500 text-sm">此页显示该用户的打卡记录</p>
                            </div>
                        </div>
                    )}
                    
                     {/* Stats Cards - Simplified for public view */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2">
                                <CheckCircle2 size={20} />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{history.length}</span>
                            <span className="text-xs text-gray-400">近期打卡(次)</span>
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
                        打卡记录
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
                                        章节: {checkIn.chapters.filter(Boolean).join(', ')}
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
                </>
            )}
        </div>
    );
};

export default UserCheckInPage;
