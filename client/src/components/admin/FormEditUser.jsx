import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../../api/admin';
import useSabnuaStore from '../../store/SabnuaStore';
import Swal from 'sweetalert2';

const FormEditUser = () => {
    const { id } = useParams();
    const token = useSabnuaStore((state) => state.token);
    const [user, setUser] = useState({
        name: '',
        email: '',
        tell: '',
        role: '',
        enabled: true,
    });
    const [newPassword, setNewPassword] = useState(''); // เพิ่ม state สำหรับรหัสผ่านใหม่
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const res = await getUserById(token, id);
                setUser(res.data);
            } catch (err) {
                console.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้', err);
                Swal.fire({
                    title: 'ผิดพลาด!',
                    text: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้ กรุณาลองใหม่',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id, token]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser({
            ...user,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user.name || !user.email || !user.tell || !user.role) {
            Swal.fire({
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน!',
                text: 'กรุณากรอกข้อมูลทุกช่องในฟอร์ม',
                icon: 'warning',
                confirmButtonText: 'ตกลง',
            });
            return;
        }

        if (newPassword && newPassword.length < 6) {
            Swal.fire({
                title: 'รหัสผ่านสั้นเกินไป!',
                text: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
                icon: 'warning',
                confirmButtonText: 'ตกลง',
            });
            return;
        }

        setLoading(true);

        try {
            const updatedData = { ...user };
            if (newPassword) {
                updatedData.password = newPassword;
            }

            await updateUser(token, id, updatedData);
            Swal.fire({
                title: 'สำเร็จ!',
                text: 'อัปเดตข้อมูลผู้ใช้เรียบร้อยแล้ว',
                icon: 'success',
                confirmButtonText: 'ตกลง',
            });
            navigate('/admin/manage');
        } catch (err) {
            console.error('ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้', err);
            Swal.fire({
                title: 'ผิดพลาด!',
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
            <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center">แก้ไขข้อมูลผู้ใช้งาน</h1>
            {loading ? (
                <div className="flex justify-center items-center py-6">
                    <div className="loader"></div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                        <div className="flex-1">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อ</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={user.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                        <div className="flex-1">
                            <label htmlFor="tell" className="block text-sm font-medium text-gray-700">เบอร์โทร</label>
                            <input
                                type="text"
                                id="tell"
                                name="tell"
                                value={user.tell}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">สิทธิ์</label>
                            <select
                                id="role"
                                name="role"
                                value={user.role}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                                required
                            >
                                <option value="admin">ผู้ดูแลระบบ</option>
                                <option value="employee">พนักงาน</option>
                                <option value="user">ผู้ใช้งาน</option>
                            </select>
                        </div>
                    </div>

                    {/* ช่องกรอกรหัสผ่านใหม่ */}
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">รหัสผ่านใหม่ (เว้นว่างหากไม่ต้องการเปลี่ยน)</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="enabled" className="block text-sm font-medium text-gray-700">สถานะ</label>
                        <input
                            type="checkbox"
                            id="enabled"
                            name="enabled"
                            checked={user.enabled}
                            onChange={handleInputChange}
                            className="mt-1"
                        />
                        <span className="ml-2">{user.enabled ? 'เปิดการใช้งาน' : 'ปิดการใช้งาน'}</span>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            disabled={loading}
                        >
                            {loading ? 'กำลังอัปเดต...' : 'อัปเดตข้อมูลผู้ใช้'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default FormEditUser;
