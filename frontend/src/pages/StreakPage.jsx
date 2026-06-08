import React, { useEffect, useState } from 'react';
import { Flame, Trophy, Calendar, Target, Medal, Crown, Loader2, CheckCircle2 } from 'lucide-react';
import { fetchMyStreak, fetchStreakRankings } from '../lib/streakApi';

const StreakPage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [streak, setStreak] = useState(null);
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [streakData, rankingsData] = await Promise.all([
                    fetchMyStreak(),
                    fetchStreakRankings(),
                ]);
                setStreak(streakData);
                setRankings(rankingsData);
            } catch (error) {
                console.error('Failed to fetch streak data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const buildCalendarDays = () => {
        const days = [];
        const today = new Date();
        const recentDates = new Set(streak?.recent_dates || []);
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            days.push({
                date: dateStr,
                day: d.getDate(),
                isToday: i === 0,
                checkedIn: recentDates.has(dateStr),
            });
        }
        return days;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen pb-20 pt-6 px-4 max-w-lg mx-auto">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
        );
    }

    const calendarDays = buildCalendarDays();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    return (
        <div className="pb-24 pt-6 px-4 max-w-lg mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Flame className="w-7 h-7 mr-2 text-orange-500" />
                    连续打卡
                </h1>
                <p className="text-gray-500 text-sm mt-1">坚持每日读经，让神的话语充满生命</p>
            </div>

            <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-20">
                    <Flame size={140} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium opacity-90 uppercase tracking-wider">当前连续</span>
                        {streak?.checked_in_today && (
                            <span className="bg-white/25 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                <CheckCircle2 size={12} className="mr-1" /> 今日已打卡
                            </span>
                        )}
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-7xl font-bold tracking-tight">{streak?.current_streak || 0}</span>
                        <span className="text-2xl ml-2 opacity-80">天</span>
                    </div>
                    <p className="text-sm opacity-90 mt-2">
                        {streak?.current_streak > 0
                            ? `继续加油！你已经连续读经 ${streak.current_streak} 天了`
                            : '开始你的第一次打卡，开启连续之旅！'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 mb-3">
                        <Trophy size={24} />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{streak?.longest_streak || 0}</span>
                    <span className="text-xs text-gray-400 mt-1">最长连续纪录(天)</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-3">
                        <Target size={24} />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{streak?.total_check_in_days || 0}</span>
                    <span className="text-xs text-gray-400 mt-1">累计打卡天数</span>
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar size={18} className="mr-2 text-blue-600" />
                    近 30 天打卡记录
                </h2>
                <div className="grid grid-cols-7 gap-1.5 mb-2">
                    {weekDays.map((wd) => (
                        <div key={wd} className="text-center text-[10px] text-gray-400 font-medium">
                            {wd}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                    {calendarDays.map((d) => (
                        <div
                            key={d.date}
                            title={d.date}
                            className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-medium transition-all ${
                                d.checkedIn
                                    ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-sm'
                                    : 'bg-gray-50 text-gray-300'
                            } ${d.isToday ? 'ring-2 ring-orange-300 ring-offset-1' : ''}`}
                        >
                            {d.day}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center">
                    <Medal size={18} className="mr-2 text-purple-600" />
                    连续打卡排行
                </h2>
                <div className="space-y-3">
                    {rankings.length > 0 ? (
                        rankings.map((r, idx) => {
                            const isMe = r.user_id === user?.id;
                            const rankIcon =
                                idx === 0 ? (
                                    <Crown size={18} className="text-yellow-500" />
                                ) : idx === 1 ? (
                                    <Medal size={18} className="text-gray-400" />
                                ) : idx === 2 ? (
                                    <Medal size={18} className="text-amber-600" />
                                ) : (
                                    <span className="w-[18px] text-center text-sm font-bold text-gray-400">{idx + 1}</span>
                                );
                            return (
                                <div
                                    key={r.id}
                                    className={`flex items-center p-3 rounded-xl transition-colors ${
                                        isMe ? 'bg-orange-50 border border-orange-100' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="w-8 flex justify-center">{rankIcon}</div>
                                    <img
                                        src={r.user?.avatar}
                                        alt={r.user?.name}
                                        className="w-9 h-9 rounded-full mx-3 bg-gray-100"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900 truncate">
                                            {r.user?.name}
                                            {isMe && <span className="text-orange-500 text-xs ml-1">(我)</span>}
                                        </p>
                                        <p className="text-xs text-gray-400">最长 {r.longest_streak} 天</p>
                                    </div>
                                    <div className="flex items-baseline">
                                        <span className="text-lg font-bold text-orange-500">{r.current_streak}</span>
                                        <span className="text-xs text-gray-400 ml-0.5">天</span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-sm">暂无排行数据</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StreakPage;
