import React, { useState, useEffect } from 'react';
import { getStreak, checkInStreak } from '../lib/streakApi';
import { Flame, Trophy, Calendar, CheckCircle2, Loader2 } from 'lucide-react';

const StreakPage = () => {
    const [streakData, setStreakData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const fetchStreak = async () => {
        try {
            const res = await getStreak();
            setStreakData(res.data);
        } catch (error) {
            console.error('Failed to fetch streak', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStreak();
    }, []);

    const handleCheckIn = async () => {
        setSubmitting(true);
        setMessage('');
        try {
            const res = await checkInStreak();
            setStreakData(res.data);
            setMessage(res.data.message);
        } catch (error) {
            const data = error.response?.data;
            if (data?.message) {
                setMessage(data.message);
                if (data.current_streak !== undefined) {
                    setStreakData(data);
                }
            } else {
                setMessage('打卡失败，请重试');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    const currentStreak = streakData?.current_streak ?? 0;
    const longestStreak = streakData?.longest_streak ?? 0;
    const checkedInToday = streakData?.checked_in_today ?? false;
    const lastCheckInDate = streakData?.last_check_in_date ?? null;

    const streakDays = Array.from({ length: 7 }, (_, i) => i < currentStreak % 7 || (currentStreak >= 7 && i < 7));

    return (
        <div className="pb-24 pt-8 px-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Flame className="mr-3 text-orange-500" />
                连续打卡
            </h1>

            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-8 text-white shadow-lg mb-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 opacity-10">
                    <Flame size={140} />
                </div>
                <div className="relative z-10">
                    <p className="text-sm font-medium uppercase tracking-wider mb-2 opacity-90">当前连续天数</p>
                    <p className="text-7xl font-extrabold mb-2">{currentStreak}</p>
                    <p className="text-lg font-medium opacity-80">天</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-2">
                        <Trophy size={20} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{longestStreak}</span>
                    <span className="text-xs text-gray-400">最长连续天数</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-2">
                        <Calendar size={20} />
                    </div>
                    <span className="text-sm font-bold text-gray-900 mt-1">
                        {lastCheckInDate ? new Date(lastCheckInDate).toLocaleDateString() : '暂无'}
                    </span>
                    <span className="text-xs text-gray-400">上次打卡日期</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                <h3 className="font-semibold text-gray-700 mb-4 text-sm">本周进度</h3>
                <div className="flex justify-between">
                    {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => {
                        const active = i < (currentStreak % 7 || (currentStreak > 0 ? 7 : 0));
                        return (
                            <div key={day} className="flex flex-col items-center gap-1.5">
                                <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        active
                                            ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-400'
                                    }`}
                                >
                                    {active ? <CheckCircle2 size={16} /> : day}
                                </div>
                                <span className="text-[10px] text-gray-400">{day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {message && (
                <div
                    className={`mb-4 p-3 rounded-xl text-sm text-center font-medium ${
                        message.includes('成功')
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}
                >
                    {message}
                </div>
            )}

            <button
                onClick={handleCheckIn}
                disabled={checkedInToday || submitting}
                className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center text-lg ${
                    checkedInToday
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                }`}
            >
                {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : checkedInToday ? (
                    <>
                        <CheckCircle2 className="mr-2 w-5 h-5" />
                        今日已打卡
                    </>
                ) : (
                    <>
                        <Flame className="mr-2 w-5 h-5" />
                        连续打卡
                    </>
                )}
            </button>

            {currentStreak >= 7 && (
                <div className="mt-4 text-center">
                    <span className="inline-block bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                        🎉 已连续 {currentStreak} 天，继续保持！
                    </span>
                </div>
            )}
        </div>
    );
};

export default StreakPage;
