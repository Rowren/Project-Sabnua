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

export const getAllUser = async (token) => {
    try {
        const res = await axios.get('http://localhost:5004/api/admin/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาด:", error.response?.data || error.message);
        throw error;
    }
};

export const getUserById = async (token, id) => {
    try {
        const res = await axios.get(
            `http://localhost:5004/api/admin/user/${id}`, // ใช้ id ที่ส่งมา
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาด:", error.response?.data || error.message);
        throw error;
    }
};


// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
export const updateUser = async (token, id, form) => {
    try {
        const res = await axios.put(
            `http://localhost:5004/api/admin/update-user/${id}`, 
            form, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาด:", error.response?.data || error.message);
        throw error;
    }
};

// ฟังก์ชันสำหรับลบผู้ใช้
export const deleteUser = async (token, id) => {
    try {
        const res = await axios.delete(
            `http://localhost:5004/api/admin/remove-user/${id}`, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาด:", error.response?.data || error.message);
        throw error;
    }
};
