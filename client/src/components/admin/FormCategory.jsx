import React, { useEffect, useState } from 'react';
import { createCategory, listCategory, removeCategory } from '../../api/Category'; // API Function สำหรับสร้างและดึงหมวดหมู่
import useSabnuaStore from '../../store/SabnuaStore'; // Import Zustand Store
import Swal from 'sweetalert2'; // Import SweetAlert2

const FormCategory = () => {
  const token = useSabnuaStore((state) => state.token); // ใช้ Zustand Store
  const [name, setName] = useState('');
  // const [category, setCategory] = useState([]);
const  category = useSabnuaStore((state) => state.categories)

const getCategory = useSabnuaStore((state)=>state.getCategory)

  useEffect(() => {
    getCategory();
  }, [getCategory]);

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      Swal.fire({
        title: 'คำเตือน!',
        text: 'กรุณากรอกชื่อหมวดหมู่',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
      return;
    }
    try {
      const res = await createCategory(token, { name }); // ส่ง token และ name
      Swal.fire({
        title: 'สำเร็จ!',
        text: `เพิ่มหมวดหมู่ "${res.data.name}" สำเร็จ!`,
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });
      setName(''); // รีเซ็ตฟอร์ม
      getCategory(); // เรียกข้อมูลใหม่หลังเพิ่มหมวดหมู่
    } catch (err) {
      Swal.fire({
        title: 'ล้มเหลว!',
        text: 'การเพิ่มหมวดหมู่ล้มเหลว กรุณาลองอีกครั้ง',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      // ลบหมวดหมู่ด้วยการเรียก API
      await removeCategory(token, id);
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'ลบหมวดหมู่สำเร็จ!',
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });
      // รีเฟรชรายการหมวดหมู่หลังลบ
      getCategory(token);
    } catch (err) {
      Swal.fire({
        title: 'ล้มเหลว!',
        text: 'การลบหมวดหมู่ล้มเหลว กรุณาลองอีกครั้ง',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">จัดการหมวดหมู่</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            ชื่อหมวดหมู่
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="กรอกชื่อหมวดหมู่"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
        >
          เพิ่มหมวดหมู่
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6">รายการหมวดหมู่</h2>
      <ul className="mt-4">
      {category && category.length > 0 ? (
  category.map((cat) => (
    <li
      key={cat.id}
      className="p-2 border-b last:border-none flex justify-between items-center"
    >
      <span>{cat.name}</span>
      <button
        onClick={() => handleRemove(cat.id)}
        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
      >
        ลบ
      </button>
    </li>
  ))
) : (
  <p>ไม่มีหมวดหมู่ในระบบ</p>
)}

      </ul>
    </div>
  );
};

export default FormCategory;
