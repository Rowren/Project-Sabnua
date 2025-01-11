import axios from "axios";

export const createUserCart= async (token, cart) => {
    try {
        const res = await axios.post('http://localhost:5004/api/user/cart', cart, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาด:", error.res?.data || error.message);
        throw error; 
    }
};

export const listUserCart= async (token) => {
    try {
        const res = await axios.get('http://localhost:5004/api/user/cart', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาด:", error.res?.data || error.message);
        throw error; 
    }
};

export const saveAddress= async (token, address) => {
    try {
        const res = await axios.post('http://localhost:5004/api/user/address', {address}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาด:", error.res?.data || error.message);
        throw error; 
    }
};

export const saveOrder= async (token, payload) => {
    try {
        const res = await axios.post('http://localhost:5004/api/user/order', {payload}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาด:", error.res?.data || error.message);
        throw error; 
    }
};