import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import Logo from '../../assets/images/LogoSabnua.png'; // นำเข้ารูปภาพ


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    tell: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // State for showing password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for showing confirm password

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, tell } = formData;

    // Basic validation
    if (!name || !email || !password || !confirmPassword || !tell) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        text: 'กรุณากรอกข้อมูลทุกช่องให้ครบถ้วน'
      });
    } else if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      Swal.fire({
        icon: 'error',
        title: 'รหัสผ่านไม่ตรงกัน',
        text: 'กรุณาตรวจสอบรหัสผ่านและยืนยันรหัสผ่านอีกครั้ง'
      });
    } else {
      setError('');
      Swal.fire({
        icon: 'success',
        title: 'ลงทะเบียนสำเร็จ!',
        text: 'คุณได้ลงทะเบียนเป็นสมาชิกแล้ว'
      });
      console.log('ลงทะเบียนสำเร็จ', formData);

      // Sending the data via axios to the server
      try {
        const res = await axios.post('http://localhost:5004/api/register', formData);
        console.log(res);
      } catch (err) {
        console.error('Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่'
        });
      }
    }
  };

  // Toggle show password
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        {/* โลโก้และชื่อร้าน */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">

            <img 
              src={Logo}
              alt="logo"
              className="h-20 w-28  rounded-full border-4 border-yellow-300 "
            />
          </div>
          <h1 className="text-3xl font-bold text-orange-500 ">
            สมัครสมาชิกแซ่บนัวครัวยินดี
          </h1>

        </div>

        {/* ฟอร์มการลงทะเบียน */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ชื่อ */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700">ชื่อ</label>
            <input
              className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* อีเมล */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">อีเมล</label>
            <input
              className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* รหัสผ่าน */}
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">รหัสผ่าน</label>
            <div className="relative">
              <input
                className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                name="password"
                type={showPassword ? "text" : "password"}  // toggle the password visibility
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={toggleShowPassword} // Toggle password visibility
              >
                {showPassword ? 'ซ่อน' : 'แสดง'}
              </button>
            </div>
          </div>

          {/* ยืนยันรหัสผ่าน */}
          <div>
            <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">ยืนยันรหัสผ่าน</label>
            <div className="relative">
              <input
                className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}  // toggle the confirm password visibility
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={toggleShowConfirmPassword} // Toggle confirm password visibility
              >
                {showConfirmPassword ? 'ซ่อน' : 'แสดง'}
              </button>
            </div>
          </div>

          {/* เบอร์โทรศัพท์ */}
          <div>
            <label htmlFor="tell" className="block text-lg font-medium text-gray-700">เบอร์โทรศัพท์</label>
            <input
              className="border p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              name="tell"
              type="tel"
              value={formData.tell}
              onChange={handleChange}
              placeholder="xxx-xxx-xxxx"
              required
            />
          </div>

          {/* ข้อความแสดงข้อผิดพลาด */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* ปุ่มส่งข้อมูล */}
          <div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              ลงทะเบียน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
