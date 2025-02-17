import React, { useEffect, useState } from 'react';
import { createCategory, listCategory, removeCategory } from '../../api/Category'; // API Function สำหรับสร้างและดึงหมวดหมู่
import useSabnuaStore from '../../store/SabnuaStore'; // Import Zustand Store
import Swal from 'sweetalert2'; // Import SweetAlert2

const FormCategory = () => {
  const token = useSabnuaStore((state) => state.token); // ใช้ Zustand Store
  const [name, setName] = useState('');
  const category = useSabnuaStore((state) => state.categories);
  const getCategory = useSabnuaStore((state) => state.getCategory);

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
      const res = await createCategory(token, { name });
      Swal.fire({
        title: 'สำเร็จ!',
        text: `เพิ่มหมวดหมู่ "${res.data.name}" สำเร็จ!`,
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });
      setName('');
      getCategory();
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
      await removeCategory(token, id);
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'ลบหมวดหมู่สำเร็จ!',
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });
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
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center">จัดการหมวดหมู่</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-yellow-600 mb-4 text-center" htmlFor="name">
            ชื่อหมวดหมู่
          </h2>
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
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
        >
          เพิ่มหมวดหมู่
        </button>
      </form>

      <h2 className="text-xl font-semibold text-yellow-600 mb-4 text-center">รายการหมวดหมู่</h2>
      <ul className="mt-4 space-y-2">
        {category && category.length > 0 ? (
          category.map((cat) => (
            <li
              key={cat.id}
              className="p-2 border-b last:border-none flex justify-between items-center"
            >
              <span className="text-sm">{cat.name}</span>
              <button
                onClick={() => handleRemove(cat.id)}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300"
              >
                ลบ
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">ไม่มีหมวดหมู่ในระบบ</p>
        )}
      </ul>
    </div>
  );
};

export default FormCategory;
