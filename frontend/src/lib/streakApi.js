import api from './api';

export const fetchMyStreak = async () => {
    const res = await api.get('/streak');
    return res.data;
};

export const fetchStreakRankings = async () => {
    const res = await api.get('/streak/rankings');
    return res.data;
};
