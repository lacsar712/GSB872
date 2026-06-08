import React, { useState, useEffect } from 'react';
import { getStreakStatus, checkInStreak } from '../lib/streakApi';
import { Flame, Trophy, Calendar, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const StreakPage = () => {
    const [streakData, setStreakData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkingIn, setCheckingIn] = useState(false);

    useEffect(() => {
        loadStreakData();
    }, []);

    const loadStreakData = async () => {
        try {
            setLoading(true);
            const data = await getStreakStatus();
            setStreakData(data);
        } catch (error) {
            console.error('Failed to load streak data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            setCheckingIn(true);
            await checkInStreak();
            await loadStreakData();
        } catch (error) {
            console.error('Check-in failed:', error);
            if (error.response?.status === 422) {
                alert(error.response.data.message || '今日已打卡');
            } else {
                alert('打卡失败，请重试');
            }
        } finally {
            setCheckingIn(false);
        }
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month - 1, 1).getDay();
    };

    const renderCalendar = () => {
        if (!streakData) return null;

        const { year, month, monthly_check_ins } = streakData;
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
        const todayDate = today.getDate();

        const days = [];
        
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isCheckedIn = monthly_check_ins.includes(day);
            const isToday = isCurrentMonth && day === todayDate;
            const isFuture = isCurrentMonth && day > todayDate;

            days.push(
                <div
                    key={day}
                    className={clsx(
                        'h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                        isCheckedIn && 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md',
                        isToday && !isCheckedIn && 'ring-2 ring-orange-400 ring-offset-2',
                        !isCheckedIn && !isToday && !isFuture && 'bg-gray-100 text-gray-400',
                        !isCheckedIn && !isToday && isFuture && 'text-gray-300'
                    )}
                >
                    {isCheckedIn ? <CheckCircle className="w-5 h-5" /> : day}
                </div>
            );
        }

        return days;
    };

    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">加载中...</div>
            </div>
        );
    }

    return (
        <div className="pb-24 pt-6 px-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Flame className="mr-3 text-orange-500" />
                连续打卡
            </h1>

            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl shadow-lg p-6 mb-6 text-white">
                <div className="text-center">
                    <p className="text-sm opacity-80 mb-2">当前连续打卡</p>
                    <div className="flex items-center justify-center mb-2">
                        <Flame className="w-12 h-12 mr-2" />
                        <span className="text-6xl font-bold">{streakData?.current_streak || 0}</span>
                        <span className="text-xl ml-2 mt-4">天</span>
                    </div>
                    <p className="text-sm opacity-80">
                        {streakData?.has_checked_in_today ? '今日已打卡，继续保持！' : '今日还未打卡，快去打卡吧！'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center mb-2">
                        <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="text-sm text-gray-500">最长连续</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        {streakData?.longest_streak || 0}
                        <span className="text-sm font-normal text-gray-400 ml-1">天</span>
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="text-sm text-gray-500">累计打卡</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        {streakData?.total_days || 0}
                        <span className="text-sm font-normal text-gray-400 ml-1">天</span>
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-700 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                        {streakData?.year}年{streakData?.month}月
                    </h2>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-7 gap-2 mb-3">
                        {weekDays.map((day) => (
                            <div key={day} className="h-8 flex items-center justify-center text-xs text-gray-400 font-medium">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {renderCalendar()}
                    </div>
                </div>
            </div>

            <button
                onClick={handleCheckIn}
                disabled={streakData?.has_checked_in_today || checkingIn}
                className={clsx(
                    'w-full font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center',
                    streakData?.has_checked_in_today
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transform hover:scale-[1.02] active:scale-[0.98]'
                )}
            >
                {checkingIn ? (
                    '打卡中...'
                ) : streakData?.has_checked_in_today ? (
                    <>
                        <CheckCircle className="mr-2 w-5 h-5" />
                        今日已打卡
                    </>
                ) : (
                    <>
                        <Flame className="mr-2 w-5 h-5" />
                        立即打卡
                    </>
                )}
            </button>
        </div>
    );
};

export default StreakPage;
