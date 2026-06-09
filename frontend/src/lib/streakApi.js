import api from './api';

/**
 * Fetch the current authenticated user's streak summary.
 * @returns {Promise<{current_streak:number,longest_streak:number,last_check_in_date:string|null,checked_in_today:boolean}>}
 */
export const fetchStreak = async () => {
    const res = await api.get('/streak');
    return res.data;
};
