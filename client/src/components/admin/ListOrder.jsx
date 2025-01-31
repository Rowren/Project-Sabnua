import React, { useEffect, useState } from 'react'
import useSabnuaStore from '../../store/SabnuaStore'
import { getOrdersAdmin, changeOrderStatus } from '../../api/admin'
import Swal from 'sweetalert2';
import { numberFormat } from '../../utils/number';
import { dateFormat } from '../../utils/dateFormat';

const ListOrder = () => {
    const token = useSabnuaStore((state) => state.token)
    const [orders, setOrders] = useState([])

    useEffect(() => {
        handleGetOrder(token)
    }, [])

    const handleGetOrder = async (token) => {
        try {
            const res = await getOrdersAdmin(token)
            setOrders(res.data)
        } catch (err) {
            console.error("เกิดข้อผิดพลาด", err)
        }
    }

    const handleChangeOrderStatus = async (token, orderId, orderStatus) => {
        try {
            const res = await changeOrderStatus(token, orderId, orderStatus);
            Swal.fire({
                icon: 'success',
                title: 'สถานะคำสั่งซื้อถูกเปลี่ยนเรียบร้อยแล้ว',
                text: `สถานะคำสั่งซื้อ ${orderId} เปลี่ยนเป็น ${orderStatus}`,
                confirmButtonText: 'ตกลง',
            });
            handleGetOrder(token)
        } catch (err) {
            console.error("เกิดข้อผิดพลาด", err);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเปลี่ยนสถานะคำสั่งซื้อได้',
                confirmButtonText: 'ตกลง',
            });
        }
    }

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">

            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">รายการคำสั่งซื้อทั้งหมด</h2>

            <div className="overflow-x-auto">
                {/* Table */}
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-red-600 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">ลำดับ</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">ผู้ใช้งาน</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">วันที่</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">รายการอาหาร</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">รวม</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">สถานะ</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-50">
                        {orders?.map((order, index) => {
                            return (
                                <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                                    <td className="px-6 py-4 text-center text-sm text-gray-700">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <p className="font-medium text-gray-900">{order.orderedBy.name}</p>
                                        <p className="text-sm text-gray-600">{order.orderedBy.email}</p>
                                        <p className="text-sm text-gray-600">{order.orderedBy.address}</p>
                                        <p className="text-sm text-gray-600">{order.orderedBy.tell}</p>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {dateFormat(order.createdAt)}
                                     </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <ul className="list-disc pl-6 space-y-1">
                                            {order.products?.map((pd, index) => (
                                                <li key={index} className="text-gray-700">
                                                    {pd.product.title}
                                                    <span className="text-sm text-gray-500"> {pd.count} x {pd.product.price}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-700">{ numberFormat(order.cartTotal)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.orderStatus === 'รอดำเนินการ' ? 'bg-yellow-200 text-yellow-800' : 
                                            order.orderStatus === 'กำลังจัดส่ง' ? 'bg-blue-200 text-blue-800' :
                                            order.orderStatus === 'จัดส่งสำเร็จ' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) =>
                                                handleChangeOrderStatus(token, order.id, e.target.value)
                                            }
                                            className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm focus:ring-red-500 focus:border-red-500"
                                        >
                                            <option> รอดำเนินการ </option>
                                            <option> กำลังจัดส่ง </option>
                                            <option> จัดส่งสำเร็จ </option>
                                            <option> ยกเลิก </option>
                                        </select>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListOrder;
