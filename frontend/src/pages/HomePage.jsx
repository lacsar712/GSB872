import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { ArrowRight, Quote, Calendar, BookOpen, Star, CheckCircle2, Activity, Heart, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [verse, setVerse] = useState(null);
    const [checkIns, setCheckIns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [verseRes, checkInsRes] = await Promise.all([
                    api.get('/bible/daily_verse'),
                    api.get('/checkins?page=1')
                ]);
                setVerse(verseRes.data);
                
                // Handle paginated response
                if (checkInsRes.data.data && Array.isArray(checkInsRes.data.data)) {
                    setCheckIns(checkInsRes.data.data);
                    setHasMore(checkInsRes.data.next_page_url !== null);
                } else {
                    // Fallback for non-paginated (e.g. search or old API)
                    setCheckIns(checkInsRes.data);
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const res = await api.get(`/checkins?page=${nextPage}`);
            if (res.data.data && Array.isArray(res.data.data)) {
                setCheckIns(prev => [...prev, ...res.data.data]);
                setPage(nextPage);
                setHasMore(res.data.next_page_url !== null);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleLike = async (id) => {
        try {
            const res = await api.post(`/checkins/${id}/like`);
            setCheckIns(checkIns.map(item => 
                item.id === id ? { ...item, likes_count: res.data.likes_count } : item
            ));
        } catch (error) {
            console.error("Like failed", error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(!searchQuery.trim()){
             const res = await api.get('/checkins');
             if (res.data.data && Array.isArray(res.data.data)) {
                 setCheckIns(res.data.data);
                 setHasMore(res.data.next_page_url !== null);
             } else {
                 setCheckIns(res.data);
                 setHasMore(false);
             }
             setLoading(false);
             return;
        }
        try {
            const res = await api.get(`/checkins/search?q=${searchQuery}`);
            setCheckIns(res.data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-24 pt-8 px-4 max-w-lg mx-auto">
            {loading && !checkIns.length && !verse ? (
                <div className="flex justify-center items-center h-screen fixed inset-0 bg-white z-50">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
            ) : (
                <>
            {/* Header with Search */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">你好, {user?.name} 👋</h1>
                        <p className="text-gray-500 text-sm">愿神的话语成为你脚前的灯。</p>
                    </div>
                    <img src={user?.avatar} alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                </div>
                
                <form onSubmit={handleSearch} className="relative">
                    <input 
                        type="text" 
                        placeholder="搜索打卡记录、经卷..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                </form>
            </div>

            {/* Daily Verse Card */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20">
                    <BookOpen size={100} />
                </div>
                <h2 className="text-sm font-medium uppercase tracking-wider mb-3 opacity-90 flex items-center">
                    <Star className="w-4 h-4 mr-2" /> 每日金句
                </h2>
                {verse ? (
                    <div className="relative z-10">
                        <p className="text-xl font-medium leading-relaxed mb-4 font-serif">"{verse.content}"</p>
                        <p className="text-right text-sm font-bold opacity-80">— {verse.reference}</p>
                    </div>
                ) : (
                    <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-white/30 rounded w-3/4"></div>
                        <div className="h-4 bg-white/30 rounded w-1/2"></div>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <Link to="/checkin" className="block w-full bg-white border-2 border-blue-50 hover:border-blue-100 rounded-xl p-4 mb-8 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mr-4 group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">开始今日打卡</h3>
                            <p className="text-xs text-gray-500">记录你的读经进度</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-full text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        <svg className="w-5 h-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </Link>

            {/* Today's Feed */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="bg-orange-100 text-orange-600 p-1.5 rounded-lg mr-2">
                        <Activity size={16} />
                    </span>
                    今日动态
                </h2>
                
                <div className="space-y-4">
                    {checkIns.length > 0 ? (
                        checkIns.map(checkIn => (
                            <div key={checkIn.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start">
                                <Link to={`/user/${checkIn.user.id}`}>
                                    <img src={checkIn.user.avatar} alt={checkIn.user.name} className="w-10 h-10 rounded-full mr-4 bg-gray-100 hover:opacity-80 transition-opacity" />
                                </Link>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <Link to={`/user/${checkIn.user.id}`} className="font-bold text-sm text-gray-900 hover:text-blue-600 transition-colors">
                                            {checkIn.user.name}
                                        </Link>
                                        <span className="text-xs text-gray-400">{new Date(checkIn.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        完成了 <span className="text-blue-600 font-medium">{checkIn.book_name}</span> 的打卡
                                        {checkIn.chapters && checkIn.chapters.length > 0 && (
                                            <span className="text-gray-500 text-xs ml-1">({checkIn.chapters.length} 章)</span>
                                        )}
                                    </p>
                                    {checkIn.comment && (
                                        <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg italic">
                                            "{checkIn.comment}"
                                        </div>
                                    )}
                                    <div className="mt-2 flex items-center justify-end">
                                        <button 
                                            onClick={() => handleLike(checkIn.id)}
                                            className="flex items-center text-gray-400 hover:text-red-500 transition-colors text-xs"
                                        >
                                            <Heart size={14} className="mr-1" />
                                            {checkIn.likes_count || 0}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p>还没人打卡，快来做第一个！</p>
                        </div>
                    )}
                </div>
                
                {hasMore && !searchQuery && (
                    <div className="mt-6 text-center">
                        <button 
                            onClick={loadMore} 
                            disabled={loadingMore}
                            className="text-blue-600 font-medium text-sm flex items-center justify-center w-full py-2 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            {loadingMore ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    加载中...
                                </>
                            ) : (
                                <>
                                    加载更多动态
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
            </>
            )}
        </div>
    );
};

export default HomePage;
