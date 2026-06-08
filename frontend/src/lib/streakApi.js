import api from './api';

export const getStreakStatus = async () => {
    const response = await api.get('/streak');
    return response.data;
};

export const checkInStreak = async () => {
    const response = await api.post('/streak/checkin');
    return response.data;
};

export const getMonthlyStreak = async (year, month) => {
    const params = {};
    if (year) params.year = year;
    if (month) params.month = month;
    const response = await api.get('/streak/monthly', { params });
    return response.data;
};

export const getUserStreak = async (userId) => {
    const response = await api.get(`/streak/user/${userId}`);
    return response.data;
};
