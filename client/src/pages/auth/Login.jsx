import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useSabnuaStore from '../../store/SabnuaStore';

const Login = () => {

  const navigate = useNavigate();

  const { actionLogin } = useSabnuaStore();  // เรียกใช้ actionLogin จาก store
  const user = useSabnuaStore((state) => state.user);
  console.log('user zustand', user);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false); // ใช้ในการ toggle การแสดงรหัสผ่าน

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // เรียกใช้ actionLogin และรอผลลัพธ์
      const res = await actionLogin(formData.email, formData.password); 
      const role = res.data.payload.role;
      roleRedirect(role);

      // ถ้าการ login สำเร็จ
      Swal.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ!',
        text: 'ยินดีต้อนรับเข้าสู่ระบบ',
      });

    } catch (err) {
      console.error('Error:', err.response?.data?.message || 'Login failed');
      Swal.fire({
        icon: 'error',
        title: 'เข้าสู่ระบบล้มเหลว',
        text: err.response?.data?.message || 'กรุณาตรวจสอบข้อมูลอีกครั้ง',
      });
    }
  };

  const roleRedirect = (role) => {
    if(role === 'admin'){
      navigate('/admin');
    }else{
      navigate(-1);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-lg p-10">
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-8">
          เข้าสู่ระบบ
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700">
              อีเมล
            </label>
            <input
              type="email"
              name="email"
              className="w-full p-4 border rounded-md focus:ring-2 focus:ring-orange-500"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium text-gray-700">
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="w-full p-4 border rounded-md focus:ring-2 focus:ring-orange-500"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'ซ่อน' : 'แสดง'}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
