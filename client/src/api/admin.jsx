import axios from "axios";


export const getOrdersAdmin = async (token) => {
    try {
        const res = await axios.get('http://localhost:5004/api/admin/orders', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาดในการสร้างสินค้า:", error.response?.data || error.message);
        throw error;
    }
};

export const changeOrderStatus = async (token, orderId, orderStatus) => {
    try {
        const res = await axios.put('http://localhost:5004/api/admin/order-status', {
            orderId,
            orderStatus,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาดในการสร้างสินค้า:", error.response?.data || error.message);
        throw error;
    }
};