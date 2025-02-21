import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSabnuaStore from '../../store/SabnuaStore';
import { getOrderUser, changeOrderStatus } from '../../api/employee';
import Swal from 'sweetalert2';
import { numberFormat } from '../../utils/number';
import { dateFormat } from '../../utils/dateFormat';
import { useNavigate } from 'react-router-dom';

const DetailOrder = () => {
    const { orderId } = useParams(); // ดึง orderId จาก URL
    const token = useSabnuaStore((state) => state.token);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Order ID:", orderId); // ตรวจสอบค่า orderId ที่ได้รับจาก URL
        if (orderId) {  // เช็คว่า orderId ไม่เป็น undefined
            handleGetOrder(token, orderId);
        } else {
            console.log("ไม่มี orderId ที่ได้รับจาก URL");
        }
    }, [token, orderId]);

    const handleGetOrder = async (token, orderId) => {
        setLoading(true);
        try {
            const res = await getOrderUser(token, orderId);
            console.log("Data received from API:", res.data); // ตรวจสอบข้อมูลที่ได้รับจาก API
            setOrder(res.data); // บันทึกข้อมูลคำสั่งซื้อใน state
        } catch (err) {
            console.error('เกิดข้อผิดพลาด', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeOrderStatus = async (token, orderId, orderStatus) => {
        try {
            await changeOrderStatus(token, orderId, orderStatus);
            setOrder(prevOrder => ({
                ...prevOrder,
                orderStatus,
            }));

            Swal.fire({
                icon: 'success',
                title: 'สถานะคำสั่งซื้อถูกเปลี่ยนเรียบร้อยแล้ว',
                text: `สถานะคำสั่งซื้อ ${orderId} เปลี่ยนเป็น ${orderStatus}`,
                confirmButtonText: 'ตกลง',
            });
            navigate("/employee/orders")

        } catch (err) {
            console.error('เกิดข้อผิดพลาด', err);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเปลี่ยนสถานะคำสั่งซื้อได้',
                confirmButtonText: 'ตกลง',
            });
        }
    };

    const calculateTotalWithShipping = (order) => {
        let total = order.cartTotal;
        if (order.deliveryType === 'DELIVERY') {
            total += 30; // เพิ่มค่าจัดส่ง 30 บาท
        }
        return numberFormat(total);
    };

    if (!orderId) {
        return (
            <div className="text-center py-6">
                <h2 className="text-2xl text-red-600">ไม่พบข้อมูล orderId</h2>
                <p className="text-lg">กรุณาตรวจสอบ URL หรือกลับไปยังหน้าก่อนหน้า</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6"> 
                        <h1 className="text-3xl font-semibold text-yellow-700 mb-6 text-center">รายละเอียดของรายการคำสั่งซื้อ</h1>


            {loading ? (
                <div className="text-center py-6">
                    <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 border-solid rounded-full mx-auto"></div>
                    <p className="text-gray-600 mt-2 text-lg">กำลังโหลดข้อมูล...</p>
                </div>
            ) : order ? (
                <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-semibold text-gray-800">รหัสรายการ: {order.id}</h3>
                        {/* วิธีจัดส่ง ในแถวเดียวกัน */}
                        <p className={`text-xl font-semibold ${order.deliveryType === 'PICKUP' ? 'text-green-600' : 'text-blue-600'} flex items-center`}>
                            {order.deliveryType === 'PICKUP' ? 'รับที่ร้าน' : 'จัดส่งถึงบ้าน'} 
                            {order.deliveryType === 'PICKUP' ? '🏠' : '🚚'}
                        </p>
                    </div>
                    
                    <p className="text-gray-700 text-lg mb-3">ผู้สั่งซื้อ: <span className="font-semibold">{order.orderedBy.name}</span></p>
                    <p className="text-gray-700 text-lg mb-3">เบอร์โทร: {order.orderedBy.tell}</p>
                    <p className="text-gray-700 text-lg mb-3">อีเมล: {order.orderedBy.email}</p>
                    <p className="text-gray-700 text-lg mb-6">วันที่สั่งซื้อ: {dateFormat(order.createdAt)}</p>

                    <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-800">รายการอาหาร:</h4>
                        <table className="min-w-full table-auto mt-2">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">ชื่อสินค้า</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">จำนวน</th>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-700">ราคา</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.products?.map((pd, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="px-4 py-2 text-gray-700">{pd.product.title}</td>
                                        <td className="px-4 py-2 text-gray-500">{pd.count}</td>
                                        <td className="px-4 py-2 text-gray-500">{pd.product.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="text-2xl text-gray-900 font-semibold mb-4">รวมทั้งหมด: {calculateTotalWithShipping(order)}</p>

                    <p className="text-lg text-gray-700 mb-3">สถานะ:
                        <span className={`px-3 py-2 text-xs font-medium rounded-full ${order.orderStatus === 'รอดำเนินการ'
                            ? 'bg-yellow-200 text-yellow-800'
                            : order.orderStatus === 'กำลังจัดส่ง'
                                ? 'bg-blue-200 text-blue-800'
                                : order.orderStatus === 'จัดส่งสำเร็จ'
                                    ? 'bg-green-200 text-green-800'
                                    : 'bg-red-200 text-red-800'
                            } ml-2`}>
                            {order.orderStatus}
                        </span>
                    </p>

                    <p className="text-lg text-gray-700 mb-6">ที่อยู่จัดส่ง: {order.deliveryAddress ? order.deliveryAddress : 'รับที่ร้าน'}</p>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">เปลี่ยนสถานะคำสั่งซื้อ:</label>
                        <select
                            value={order.orderStatus}
                            onChange={(e) => handleChangeOrderStatus(token, order.id, e.target.value)}
                            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option>รอดำเนินการ</option>
                            <option>กำลังจัดส่ง</option>
                            <option>จัดส่งสำเร็จ</option>
                            <option>ยกเลิก</option>
                        </select>
                    </div>
                </div>
            ) : (
                <div className="text-center py-6">
                    <h2 className="text-2xl text-red-600">ไม่พบข้อมูลคำสั่งซื้อ</h2>
                </div>
            )}
        </div>
    );
};

export default DetailOrder;
