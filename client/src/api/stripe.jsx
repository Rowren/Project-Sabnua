import axios from 'axios';

export const payment = async (token) => {
    try {
        const res = await axios.post('http://localhost:5004/api/user/create-payment-intent', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (err) {
        console.err('Error fetching current user:', err.res?.data || err.message);
        throw err;
    }
};