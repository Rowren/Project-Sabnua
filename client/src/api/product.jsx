import axios from "axios";

// สร้างสินค้าใหม่
export const createProduct = async (token, form) => {
    try {
        const res = await axios.post('http://localhost:5004/api/product', form, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        console.error("ข้อผิดพลาดในการสร้างสินค้า:", error.response?.data || error.message);
        throw error;  // โยนข้อผิดพลาดออกไปเพื่อให้จัดการต่อที่อื่น
    }
};


// ดึงรายการสินค้าตามจำนวนที่กำหนด
export const listProduct = async (count = 20) => {
    return await axios.get(`http://localhost:5004/api/products/${count}`);
};

// ฟังก์ชันตรวจสรอบสินค้าตามid
export const readProduct = async (token, id) => {
    return await axios.get(`http://localhost:5004/api/product/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// ฟังก์ชันลบสินค้า
export const deleteProduct = async (token, id) => {
    try {
        const response = await axios.delete(`http://localhost:5004/api/product/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data; // ส่งผลลัพธ์กลับ
    } catch (error) {
        console.error("Error deleting product:", error.response?.data || error.message);
        throw error; // โยนข้อผิดพลาดออกไป
    }
};


// ฟังก์ชันอัพเดตข้อมูลสินค้า
export const updateProduct = async (token, id, form) => {
    try {
        const res = await axios.put(`http://localhost:5004/api/product/${id}`, form, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};





// อัพโหลดไฟล์รูปภาพ
export const uploadFiles = async (token, form) => {
    return await axios.post('http://localhost:5004/api/images', { image: form }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// ลบไฟล์จาก Cloudinary หรือที่เซิร์ฟเวอร์
export const removeFile = async (token, public_id) => {
    try {
        const res = await axios.delete('http://localhost:5004/api/remove-image', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: { public_id }, // ส่ง public_id ใน body
        });
        return res; // ส่งผลลัพธ์ที่ได้กลับไป
    } catch (error) {
        console.error("Error deleting file:", error.res?.data || error.message);
        throw error; // ถ้ามีข้อผิดพลาดก็โยนออกไป
    }
};


// ฟังก์ชันค้นหาสินค้าตามฟิลเตอร์
export const searchFilter = async ({ query, category }) => { // ลบ price ออกถ้าไม่ใช้
    try {
        const res = await axios.post("http://localhost:5004/api/search/filters", {
            query,
            category
        });
        console.log("Search result:", res.data);
        return res;  // เพิ่ม return เพื่อให้ใช้ผลลัพธ์จากการค้นหาได้
    } catch (error) {
        console.error("Search error:", error.message);
    }
};

export const listProductBy = async (sort,order,limit) => { 
    try {
        const res = await axios.post("http://localhost:5004/api/productby", {
            sort,
            order,
            limit
        });
        console.log("Search result:", res.data);
        return res;  // เพิ่ม return เพื่อให้ใช้ผลลัพธ์จากการค้นหาได้
    } catch (error) {
        console.error("Search error:", error.message);
    }
};


  





