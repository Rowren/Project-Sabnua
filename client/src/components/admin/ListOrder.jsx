import React, { useEffect, useState } from 'react';
import useSabnuaStore from '../../store/SabnuaStore';
import { getOrdersAdmin, changeOrderStatus } from '../../api/admin';
import Swal from 'sweetalert2';
import { numberFormat } from '../../utils/number';
import { dateFormat } from '../../utils/dateFormat';

const ListOrder = () => {
  const token = useSabnuaStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // Default sorting
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleGetOrder(token, statusFilter, deliveryFilter, sortOrder);
  }, [statusFilter, deliveryFilter, sortOrder]);

  const handleGetOrder = async (token, statusFilter, deliveryFilter, sortOrder) => {
    setLoading(true);
    try {
      const res = await getOrdersAdmin(token, statusFilter, deliveryFilter);
      let sortedOrders = res.data;
      if (sortOrder === 'newest') {
        sortedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        sortedOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      setOrders(sortedOrders);
    } catch (err) {
      console.error('เกิดข้อผิดพลาด', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeOrderStatus = async (token, orderId, orderStatus) => {
    try {
      const res = await changeOrderStatus(token, orderId, orderStatus);
      Swal.fire({
        icon: 'success',
        title: 'สถานะคำสั่งซื้อถูกเปลี่ยนเรียบร้อยแล้ว',
        text: `สถานะคำสั่งซื้อ ${orderId} เปลี่ยนเป็น ${orderStatus}`,
        confirmButtonText: 'ตกลง',
      });
      handleGetOrder(token, statusFilter, deliveryFilter);
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

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">รายการคำสั่งซื้อทั้งหมด</h2>

      {/* ฟิลเตอร์สถานะ */}
      <div className="flex gap-4 mb-6 flex-wrap justify-between lg:flex-nowrap">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">สถานะคำสั่งซื้อ</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
          >
            <option value="">ทั้งหมด</option>
            <option value="รอดำเนินการ">รอดำเนินการ</option>
            <option value="กำลังจัดส่ง">กำลังจัดส่ง</option>
            <option value="จัดส่งสำเร็จ">จัดส่งสำเร็จ</option>
            <option value="ยกเลิก">ยกเลิก</option>
          </select>
        </div>

        {/* ฟิลเตอร์วิธีการจัดส่ง */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="deliveryFilter" className="block text-sm font-medium text-gray-700">วิธีการจัดส่ง</label>
          <select
            id="deliveryFilter"
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
          >
            <option value="">ทั้งหมด</option>
            <option value="PICKUP">รับที่ร้าน</option>
            <option value="DELIVERY">จัดส่งถึงบ้าน</option>
          </select>
        </div>

        {/* ฟิลเตอร์เรียงลำดับ */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">เรียงลำดับ</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
          >
            <option value="newest">ล่าสุด - เก่าสุด</option>
            <option value="oldest">เก่าสุด - ล่าสุด</option>
          </select>
        </div>
      </div>

      {/* สถานะการโหลด */}
      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin h-8 w-8 border-t-4 border-blue-500 border-solid rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-2">กำลังโหลดข้อมูล...</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">รหัสรายการ</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">ผู้ใช้งาน</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">วันที่</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">รายการอาหาร</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">รวม</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">สถานะ</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">วิธีการจัดส่ง</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">ที่อยู่จัดส่ง</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50">
              {orders?.map((order, index) => (
                <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm text-gray-700 text-center">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <p className="font-medium text-gray-900">{order.orderedBy.name}</p>
                    <p className="text-sm text-gray-600">{order.orderedBy.email}</p>
                    <p className="text-sm text-gray-600">{order.orderedBy.tell}</p>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">{dateFormat(order.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <ul className="list-disc pl-6 space-y-1">
                      {order.products?.map((pd, index) => (
                        <li key={index} className="text-gray-700">
                          {pd.product.title} <span className="text-sm text-gray-500">{pd.count} x {pd.product.price}</span>
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">{calculateTotalWithShipping(order)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${order.orderStatus === 'รอดำเนินการ'
                        ? 'bg-yellow-200 text-yellow-800'
                        : order.orderStatus === 'กำลังจัดส่ง'
                          ? 'bg-blue-200 text-blue-800'
                          : order.orderStatus === 'จัดส่งสำเร็จ'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.deliveryType === 'PICKUP' ? 'รับที่ร้าน' : 'จัดส่งถึงบ้าน'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.deliveryAddress ? order.deliveryAddress : 'รับที่ร้าน'}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleChangeOrderStatus(token, order.id, e.target.value)}
                      className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>รอดำเนินการ</option>
                      <option>กำลังจัดส่ง</option>
                      <option>จัดส่งสำเร็จ</option>
                      <option>ยกเลิก</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListOrder;
