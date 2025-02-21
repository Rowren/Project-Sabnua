import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSabnuaStore from '../../store/SabnuaStore';
import { updateUser, getUser } from '../../api/user';  
import Swal from 'sweetalert2';

const EditProfile = () => {
  const { id } = useParams();
  const token = useSabnuaStore((state) => state.token);
  const [user, setUser] = useState({
    email: '',
    name: '',
    tell: '',
    address: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressFields, setAddressFields] = useState({
    houseNo: '',
    subdistrict: '',
    district: '',
    province: '',
    country: '',
    postalCode: '',
    landmark: ''
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        setLoading(true);
        try {
          const res = await getUser(token, id);
          setUser({
            ...res.user,
            password: '',
          });
        } catch (err) {
          console.error('Error fetching user data:', err);
          Swal.fire({
            title: 'Error!',
            text: 'ไม่สามารถดึงข้อมูลผู้ใช้',
            icon: 'error',
            confirmButtonText: 'ตกลง',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmNewPassword') {
      setConfirmNewPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!user.name || !user.tell || !user.address) {
      Swal.fire({
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน!',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
      return;
    }
  
    if (newPassword && currentPassword === '') {
      Swal.fire({
        title: 'กรุณากรอกรหัสผ่านเดิม!',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
      return;
    }
  
    if (newPassword && currentPassword) {
      if (newPassword !== confirmNewPassword) {
        Swal.fire({
          title: 'รหัสผ่านใหม่ไม่ตรงกัน!',
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
        return;
      }
    }
  
    setLoading(true);
    try {
      const updatedUser = { ...user };
  
      if (newPassword) {
        updatedUser.password = newPassword;
      }
  
      if (currentPassword) {
        updatedUser.currentPassword = currentPassword;
      }
  
      await updateUser(token, id, updatedUser);
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });
      navigate('/');
    } catch (err) {
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
  
  

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // ✅ เพิ่มฟังก์ชันแก้ไขที่อยู่
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressFields({
      ...addressFields,
      [name]: value,
    });
  };
  
  const handleSaveAddress = () => {
    const address = `${addressFields.houseNo}, ${addressFields.subdistrict}, ${addressFields.district}, ${addressFields.province}, ${addressFields.country}, ${addressFields.postalCode}, ${addressFields.landmark}`;
    setUser({
      ...user,
      address,
    });
    toggleModal();
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                placeholder="ชื่อ-นามสกุล"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label htmlFor="tell" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                ที่อยู่
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={user.address || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  disabled
                />
                <button
                  type="button"
                  onClick={toggleModal}
                  className="ml-2 text-sm text-yellow-600"
                >
                  แก้ไขที่อยู่
                </button>
              </div>
            </div>
          </div>

          {/* ฟิลด์รหัสผ่าน */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                รหัสผ่านเดิม
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="กรอกรหัสผ่านเดิม"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                รหัสผ่านใหม่
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="กรอกรหัสผ่านใหม่"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1">
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                ยืนยันรหัสผ่านใหม่
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="ยืนยันรหัสผ่านใหม่"
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-yellow-600 mb-4">กรอกข้อมูลที่อยู่</h2>

            <div className="space-y-4">
              <input
                type="text"
                name="houseNo"
                value={addressFields.houseNo}
                onChange={handleAddressChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="บ้านเลขที่"
              />
              <input
                type="text"
                name="subdistrict"
                value={addressFields.subdistrict}
                onChange={handleAddressChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="ตำบล"
              />
              <input
                type="text"
                name="district"
                value={addressFields.district}
                onChange={handleAddressChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="อำเภอ"
              />
              <input
                type="text"
                name="province"
                value={addressFields.province}
                onChange={handleAddressChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="จังหวัด"
              />

              <input
                type="text"
                name="postalCode"
                value={addressFields.postalCode}
                onChange={handleAddressChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="รหัสไปรษณีย์"
              />
              <input
                type="text"
                name="landmark"
                value={addressFields.landmark}
                onChange={handleAddressChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="ลักษณะสังเกตของที่อยู่"
              />
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={toggleModal}
                className="bg-gray-400 text-white py-2 px-4 rounded-md"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveAddress}
                className="bg-yellow-500 text-white py-2 px-4 rounded-md"
              >
                บันทึกที่อยู่
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
