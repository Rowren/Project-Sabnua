import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSabnuaStore from '../../store/SabnuaStore'; 
import { updateUser, getUser } from '../../api/user'; 
import Swal from 'sweetalert2';

const FormEditUser = ({ id }) => {  // รับ id เป็น props
  const token = useSabnuaStore((state) => state.token); 
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    tell: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await getUser(token, id); // ดึงข้อมูลผู้ใช้จาก backend
        if (res.data) {
          setUser(res.data); 
        }
      } catch (err) {
        console.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้:', err);
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถดึงข้อมูลผู้ใช้ กรุณาลองใหม่',
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, token]);  // เพิ่ม id ใน dependencies

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value, 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name || !user.tell) {
      Swal.fire({
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน!',
        text: 'กรุณากรอกข้อมูลทุกช่องในฟอร์ม',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
      return;
    }

    setLoading(true);

    try {
      await updateUser(token, id, user); 
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });
      navigate('/'); // ไปที่หน้าโปรไฟล์ผู้ใช้หลังอัปเดต
    } catch (err) {
      console.error('ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้:', err);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถอัปเดตข้อมูลผู้ใช้ กรุณาลองใหม่',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
        แก้ไขข้อมูลผู้ใช้งาน
      </h1>
      {loading ? (
        <div className="flex justify-center items-center py-6">
          <div className="loader"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                ชื่อ
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name || ''}  
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                required
                placeholder='ชื่อ-นามสกุล'
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label
                htmlFor="tell"
                className="block text-sm font-medium text-gray-700"
              >
                เบอร์โทรศัพท์
              </label>
              <input
                type="text"
                id="tell"
                name="tell"
                value={user.tell || ''} 
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                required
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                รหัสผ่าน (ถ้าต้องการเปลี่ยน)
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password || ''}  
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                placeholder='รหัสผ่านใหม่'
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              disabled={loading}
            >
              {loading ? 'กำลังอัปเดตข้อมูล...' : 'อัปเดตข้อมูลผู้ใช้'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FormEditUser;
