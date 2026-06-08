import api from './api';

export const getStreak = () => api.get('/streaks');

export const checkInStreak = () => api.post('/streaks/check-in');
