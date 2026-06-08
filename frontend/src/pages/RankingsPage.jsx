import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import clsx from 'clsx';
import { Medal, Trophy } from 'lucide-react';

const RankingsPage = () => {
    const [period, setPeriod] = useState('weekly');
    const [data, setData] = useState({ weekly: [], monthly: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/checkins/rankings').then(res => {
            setData(res.data);
            setLoading(false);
        });
    }, []);

    const rankings = data[period];

    return (
        <div className="pb-24 pt-6 px-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Trophy className="mr-3 text-yellow-500" />
                排行榜
            </h1>

            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                <button 
                    onClick={() => setPeriod('weekly')}
                    className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                        period === 'weekly' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    本周
                </button>
                <button 
                    onClick={() => setPeriod('monthly')}
                    className={clsx(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                        period === 'monthly' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    本月
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {rankings.length > 0 ? (
                    rankings.map((item, index) => (
                        <div key={item.user_id} className="flex items-center p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <div className="w-8 flex justify-center font-bold text-gray-400 mr-4">
                                {index + 1 <= 3 ? (
                                    <span className={clsx(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs",
                                        index === 0 ? "bg-yellow-400" : index === 1 ? "bg-gray-300" : "bg-yellow-700"
                                    )}>
                                        {index + 1}
                                    </span>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <img src={item.user?.avatar} alt={item.user?.name} className="w-10 h-10 rounded-full mr-4 bg-gray-100" />
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900">{item.user?.name}</h3>
                            </div>
                            <div className="text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full text-xs">
                                {item.total}次打卡
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-400">
                        暂无数据
                    </div>
                )}
            </div>
        </div>
    );
};

export default RankingsPage;
