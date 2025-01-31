import axios from 'axios';

export const currentUser = async (Token) => {
    try {
        const res = await axios.post('http://localhost:5004/api/current-user', {}, {
            headers: {
                Authorization: `Bearer ${Token}`
            }
        });
        return res.data;
    } catch (err) {
        console.error('Error fetching current user:', err.response?.data || err.message);
        throw err;
    }
};

export const currentAdmin = async (Token) => {
    try {
        const res = await axios.post('http://localhost:5004/api/current-admin', {}, {
            headers: {
                Authorization: `Bearer ${Token}`
            }
        });
        return res.data;
    } catch (err) {
        console.error('Error fetching current admin:', err.response?.data || err.message);
        throw err;
    }
};

