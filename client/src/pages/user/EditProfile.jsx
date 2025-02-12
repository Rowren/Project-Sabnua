import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSabnuaStore from '../../store/SabnuaStore';
import { updateUser, getUser } from '../../api/user';
import Swal from 'sweetalert2';

const EditProfile = () => {
  const { id } = useParams(); // ใช้ useParams เพื่อดึง id จาก URL
  const token = useSabnuaStore((state) => state.token); // ดึง token จาก store
  const [user, setUser] = useState({
    email: '',
    name: '',
    tell: '',
    address: '', // รวมที่อยู่ทั้งหมด
    password: '', // เพิ่ม state สำหรับรหัสผ่านใหม่
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // ใช้เพื่อเปิด/ปิด Modal
  const [addressFields, setAddressFields] = useState({
    houseNo: '',
    subdistrict: '',
    district: '',
    province: '',
    country: '',
    postalCode: '',
    landmark: ''
  }); // สำหรับเก็บข้อมูลที่อยู่

  const navigate = useNavigate(); // ใช้ navigate เพื่อไปยังหน้าอื่น

  // ดึงข้อมูลผู้ใช้เมื่อโหลดหน้า
  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        setLoading(true);
        try {
          const res = await getUser(token, id); // เรียก API ดึงข้อมูลผู้ใช้
          setUser({
            ...res.user, // ไม่ดึงรหัสผ่านมา
            password: '', // ตั้งค่าสถานะรหัสผ่านให้เป็นค่าว่าง
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
      } else {
        console.error('User ID is undefined');
      }
    };

    fetchUserData();
  }, [id, token]); // เมื่อ id หรือ token เปลี่ยน จะดึงข้อมูลใหม่

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value, // อัปเดตข้อมูลตามชื่อของ input
    });
  };

  // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลที่อยู่ใน Modal
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressFields({
      ...addressFields,
      [name]: value, // อัปเดตข้อมูลที่อยู่ตามชื่อของ input
    });
  };

  // ฟังก์ชันจัดการการส่งข้อมูลเมื่อกดปุ่ม Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name || !user.tell || !user.address) {
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
      // หากกรอกรหัสผ่านใหม่, ใช้รหัสผ่านใหม่ในข้อมูลที่จะอัปเดต
      const updatedUser = { ...user };
      if (!updatedUser.password) {
        delete updatedUser.password; // ลบรหัสผ่านที่เป็นค่าว่างออก
      }

      await updateUser(token, id, updatedUser); // เรียก API อัปเดตข้อมูลผู้ใช้
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });
      navigate('/'); // ไปที่หน้าโปรไฟล์หลังจากอัปเดต
    } catch (err) {
      console.error('Error updating user:', err);
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

  // ฟังก์ชันเปิด/ปิด Modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // ฟังก์ชันจัดการการบันทึกที่อยู่
  const handleSaveAddress = () => {
    // รวมข้อมูลที่อยู่ทั้งหมดเป็นสตริงเดียว
    const address = `${addressFields.houseNo}, ${addressFields.subdistrict}, ${addressFields.district}, ${addressFields.province}, ${addressFields.country}, ${addressFields.postalCode}, ${addressFields.landmark}`;
    setUser({
      ...user,
      address, // อัปเดตที่อยู่ใน state หลัก
    });
    toggleModal(); // ปิด Modal
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

          {/* แสดงที่อยู่ */}
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

      {/* Modal สำหรับกรอกที่อยู่ */}
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
                name="country"
                value={addressFields.country}
                onChange={handleAddressChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="ประเทศ"
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
