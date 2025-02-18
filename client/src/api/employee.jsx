import axios from "axios";

export const getAllUser = async (token) => {
    try {
        const res = await axios.get('http://localhost:5004/api/employee/users', {
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

// ฟังก์ชันสำหรับอัปเดตข้อมูลผู้ใช้
export const updateUserEmp = async (token, id, form) => {
    try {
        const res = await axios.put(
            `http://localhost:5004/api/employee/update-user/${id}`,
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

export const getUserById = async (token, id) => {
    try {
        const res = await axios.get(
            `http://localhost:5004/api/employee/user/${id}`, // ใช้ id ที่ส่งมา
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

// ปรับ getDashboardData ให้รองรับปี
export const getDashboardData = async (token, year) => {
    console.log("Token used for request:", token); // Debug token
    try {
        const response = await axios.get(`http://localhost:5004/api/employee/dashboard?year=${year}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard data:", error.response?.data || error);
        throw error;
    }
};

export const changeOrderStatus = async (token, orderId, orderStatus) => {
    try {
        const res = await axios.put('http://localhost:5004/api/employee/order-status', {
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

export const getOrdersEmp = async (token, statusFilter, deliveryFilter, sortOrder) => {
    try {
        const res = await axios.get('http://localhost:5004/api/employee/order', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                statusFilter,      // ฟิลเตอร์สถานะ
                deliveryFilter,    // ฟิลเตอร์วิธีการจัดส่ง
                sortOrder,         // การเรียงลำดับ
            },
        });
        return res;
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ:", error.response?.data || error.message);
        throw error;
    }
};

export const getOrderUser = async (token, orderId) => {
    try {
        const res = await axios.get(
            `http://localhost:5004/api/employee/order/${orderId}`, // ใช้ orderId ที่ส่งมา
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ:", error.response?.data || error.message);
        throw error;
    }
};
