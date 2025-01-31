import React, { useEffect, useState } from 'react';
import { getAllUser, deleteUser } from '../../api/admin';
import { Link } from 'react-router-dom';
import useSabnuaStore from '../../store/SabnuaStore';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ListUserManages = () => {
    const token = useSabnuaStore((state) => state.token);
    const [users, setUsers] = useState([]);

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

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
            <h1 className="text-3xl font-semibold text-yellow-700 mb-6 text-center">ข้อมูลผู้ใช้งาน</h1>
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
