import React, { useEffect, useState } from 'react';
import { getAllUser, deleteUser, createUser } from '../../api/admin';
import { Link } from 'react-router-dom';
import useSabnuaStore from '../../store/SabnuaStore';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ListUserManages = () => {
    const token = useSabnuaStore((state) => state.token);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        tell: '',
        password: '',  // Add password field to formData
        role: 'user',  // Default role
        enabled: true, // Default status
    });

    useEffect(() => {
        handleGetUsers(token);
    }, [token]);

    const handleGetUsers = async (token) => {
        try {
            const res = await getAllUser(token);
            setUsers(res.data);
        } catch (err) {
            console.error('เกิดข้อผิดพลาด', err);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: 'หากลบแล้วจะไม่สามารถกู้คืนข้อมูลได้!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(token, id);
                Swal.fire('สำเร็จ!', 'ลบผู้ใช้สำเร็จ', 'success');
                setUsers(users.filter((user) => user.id !== id));
            } catch (err) {
                console.error('เกิดข้อผิดพลาดในการลบผู้ใช้', err);
                Swal.fire('ผิดพลาด!', 'ไม่สามารถลบผู้ใช้งาน กรุณาลองใหม่', 'error');
            }
        }
    };

    const handleCreateUser = async () => {
        try {
            await createUser(token, formData);
            Swal.fire('สำเร็จ!', 'สร้างผู้ใช้ใหม่สำเร็จ', 'success');
            handleGetUsers(token); // รีเฟรชข้อมูลผู้ใช้
            setFormData({
                name: '',
                email: '',
                tell: '',
                password: '', // Reset password
                role: 'user',
                enabled: true,
            }); // รีเซ็ตฟอร์ม
        } catch (err) {
            console.error('เกิดข้อผิดพลาดในการสร้างผู้ใช้', err);
            Swal.fire('ผิดพลาด!', 'ไม่สามารถสร้างผู้ใช้ กรุณาลองใหม่', 'error');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
            <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center">ข้อมูลผู้ใช้งาน</h1>

            {/* Form for creating user */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-yellow-600 mb-4 text-center">สร้างผู้ใช้ใหม่</h2>
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                        <div className="w-full sm:w-1/2">
                            <label className="block text-gray-700 font-semibold mb-1">ชื่อ</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="ชื่อ"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label className="block text-gray-700 font-semibold mb-1">อีเมล</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="อีเมล"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                        <div className="w-full sm:w-1/2">
                            <label className="block text-gray-700 font-semibold mb-1">เบอร์โทร</label>
                            <input
                                type="text"
                                name="tell"
                                value={formData.tell}
                                onChange={handleChange}
                                placeholder="เบอร์โทร"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label className="block text-gray-700 font-semibold mb-1">รหัสผ่าน</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="รหัสผ่าน"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                        <div className="w-full sm:w-1/2">
                            <label className="block text-gray-700 font-semibold mb-1">สิทธิ์</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="user">ผู้ใช้งาน</option>
                                <option value="employee">พนักงาน</option>
                                <option value="admin">ผู้ดูแลระบบ</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleCreateUser}
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        สร้างผู้ใช้
                    </button>
                </div>
            </div>

            {/* User List Table */}
            <h2 className="text-xl font-semibold text-yellow-600 mb-4 text-center ">ตารางผู้ใช้งาน</h2>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full border border-gray-200">
                    <thead>
                        <tr className="bg-yellow-500 text-white">
                            <th className="px-4 py-2 text-center">ลำดับ</th>
                            <th className="px-4 py-2 text-center">ชื่อ</th>
                            <th className="px-4 py-2 text-center">อีเมล</th>
                            <th className="px-4 py-2 text-center">เบอร์โทร</th>
                            <th className="px-4 py-2 text-center">สิทธิ์</th>
                            <th className="px-4 py-2 text-center">สถานะ</th>
                            <th className="px-4 py-2 text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id} className="border-t hover:bg-gray-100">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.tell}</td>
                                    <td className="px-4 py-2">
                                        {user.role === 'admin' && 'ผู้ดูแลระบบ'}
                                        {user.role === 'employee' && 'พนักงาน'}
                                        {user.role === 'user' && 'ผู้ใช้งาน'}
                                    </td>
                                    <td className="px-4 py-2">{user.enabled ? 'เปิดการใช้งาน' : 'ปิดการใช้งาน'}</td>
                                    <td className="px-4 py-2 flex space-x-2 justify-center">
                                        <Link
                                            to={`/admin/user/${user.id}`}
                                            className="text-white bg-green-500 px-4 py-2 rounded-md shadow-md hover:bg-green-600 text-sm sm:text-base flex items-center gap-1"
                                        >
                                            <FaEdit /> แก้ไข
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-white bg-red-600 px-4 py-2 rounded-md shadow-md hover:bg-red-700 text-sm sm:text-base flex items-center gap-1"
                                        >
                                            <FaTrash /> ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    className="px-4 py-2 text-center text-gray-500"
                                    colSpan="7"
                                >
                                    ไม่มีข้อมูลผู้ใช้งาน
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListUserManages;
