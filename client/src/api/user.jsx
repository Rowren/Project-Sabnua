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

export const saveOrder = async (token, paymentIntent, deliveryMethod) => {
    try {
        const payload = { paymentIntent, deliveryMethod };
        const res = await axios.post('http://localhost:5004/api/user/order', { payload }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาด:", error.response?.data || error.message);
        throw error; 
    }
};


export const getOrder = async (token) => {
    try {
        console.log("Token being sent:", token); // ตรวจสอบ token
        const res = await axios.get('http://localhost:5004/api/user/order', {
            headers: {
                Authorization: `Bearer ${token}`, // ตรวจสอบ Authorization header
            },
        });
        console.log("API Response Data:", res.data); // ตรวจสอบการตอบกลับของ API
        return res;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message); // ตรวจสอบข้อผิดพลาดจาก API
        throw error;
    }
};

export const getDetailOrder = async (token, id) => {
    try {
        const res = await axios.get(`http://localhost:5004/api/user/order/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Order Detail fetched successfully:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching order detail:", error.response?.data || error.message);
        throw error;
    }
};



export const updateUser = async (token, id, form) => {
    try {
        const res = await axios.put(`http://localhost:5004/api/users/${id}`, form, {
            headers: {
                Authorization: `Bearer ${token}`, // ส่ง token ไปใน header
            },
        });
        console.log("User updated successfully:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error updating user:", error.response?.data || error.message);
        throw error;
    }
};



export const getUser = async (token, id) => {
    try {
        const res = await axios.get(`http://localhost:5004/api/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("User fetched successfully:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching user:", error.response?.data || error.message);
        throw error;
    }
};


// ฟังก์ชัน getAddress
export const getAddress = async (token, id) => {
    try {
      const res = await axios.get(`http://localhost:5004/api/users/${id}/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User fetched successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching user:", error.response?.data || error.message);
      throw error;
    }
  };
  


