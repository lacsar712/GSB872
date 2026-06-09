import React, { useEffect, useState } from 'react';
import { Flame, Trophy, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchStreak } from '../lib/streakApi';

const StreakPage = () => {
    const [streak, setStreak] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const data = await fetchStreak();
                if (mounted) setStreak(data);
            } catch (e) {
                if (mounted) setError('获取连续打卡数据失败');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-4 pt-8 text-center text-red-500">{error}</div>
        );
    }

    const current = streak?.current_streak ?? 0;
    const longest = streak?.longest_streak ?? 0;
    const lastDate = streak?.last_check_in_date;
    const checkedToday = streak?.checked_in_today;

    return (
        <div className="pt-8 pb-24 px-4 max-w-lg mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">连续打卡</h1>
                <p className="text-gray-500 text-sm">坚持每日读经，神的话语点亮人生。</p>
            </div>

            {/* Hero Card */}
            <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 rounded-3xl p-8 text-white shadow-xl mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-20">
                    <Flame size={140} />
                </div>
                <div className="relative z-10">
                    <p className="text-sm uppercase tracking-wider opacity-90 mb-2">当前连续天数</p>
                    <div className="flex items-end mb-4">
                        <span className="text-6xl font-extrabold leading-none">{current}</span>
                        <span className="ml-2 mb-2 text-lg font-medium opacity-90">天</span>
                    </div>
                    <p className="text-sm opacity-90">
                        {checkedToday ? '今日已打卡，明天继续保持！' : '今日尚未打卡，去完成今天的读经吧。'}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center text-amber-500 mb-2">
                        <Trophy size={18} />
                        <span className="ml-2 text-xs font-medium text-gray-500 uppercase">最长记录</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{longest} <span className="text-sm font-medium text-gray-500">天</span></p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center text-blue-500 mb-2">
                        <Calendar size={18} />
                        <span className="ml-2 text-xs font-medium text-gray-500 uppercase">最近打卡</span>
                    </div>
                    <p className="text-base font-bold text-gray-900">{lastDate ?? '—'}</p>
                </div>
            </div>

            {/* User */}
            {user?.name && (
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center mb-6">
                    {user.avatar && (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                    )}
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">愿你坚持每一天</p>
                    </div>
                </div>
            )}

            {/* CTA */}
            <Link
                to="/checkin"
                className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors"
            >
                <CheckCircle2 size={18} />
                {checkedToday ? '继续添加打卡记录' : '立即去打卡'}
            </Link>

            <p className="text-xs text-gray-400 text-center mt-6">
                同一天内多次打卡不会重复累加；错过一天连续天数将重新计数。
            </p>
        </div>
    );
};

export default StreakPage;
