import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSabnuaStore from "../../store/SabnuaStore";
import { getOrdersEmp } from "../../api/employee";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateFormat";
import { FaStore, FaTruck, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ListOrderManage = () => {
  const token = useSabnuaStore((state) => state.token);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleGetOrder(token, statusFilter, deliveryFilter, sortOrder);
  }, [statusFilter, deliveryFilter, sortOrder, token]); // เพิ่ม token ใน dependency array

  const handleGetOrder = async (token, statusFilter, deliveryFilter, sortOrder) => {
    setLoading(true);
    try {
      const res = await getOrdersEmp(token, statusFilter, deliveryFilter);
      let sortedOrders = res.data;
      sortedOrders.sort((a, b) =>
        sortOrder === "newest"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6"> 
            <h1 className="text-3xl font-semibold text-yellow-700 mb-6 text-center">รายการคำสั่งซื้อ</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="border p-2 rounded w-full"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">ทุกสถานะ</option>
          <option value="รอดำเนินการ">รอดำเนินการ</option>
          <option value="กำลังจัดส่ง">กำลังจัดส่ง</option>
          <option value="จัดส่งสำเร็จ">จัดส่งสำเร็จ</option>
          <option value="ยกเลิก">ยกเลิก</option>
        </select>
        <select
          className="border p-2 rounded w-full"
          value={deliveryFilter}
          onChange={(e) => setDeliveryFilter(e.target.value)}
        >
          <option value="">ทุกวิธีการจัดส่ง</option>
          <option value="PICKUP">รับที่ร้าน</option>
          <option value="DELIVERY">จัดส่ง</option>
        </select>
        <select
          className="border p-2 rounded w-full"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">ใหม่ที่สุด → เก่าที่สุด</option>
          <option value="oldest">เก่าที่สุด → ใหม่ที่สุด</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin h-8 w-8 border-t-4 border-blue-500 border-solid rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-2">กำลังโหลดคำสั่งซื้อ...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-600">ไม่มีคำสั่งซื้อที่ตรงกับเงื่อนไข</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-100 p-6 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center"
              onClick={() => navigate(`/employee/order/${order.id}`)}
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">รหัสคำสั่งซื้อ: {order.id}</h3>
                <p className="text-sm text-gray-600">วันที่: {dateFormat(order.createdAt)}</p>
                <p className="text-sm text-gray-600">ลูกค้า: {order.orderedBy.name}</p>
                <p className="text-sm text-gray-600">เบอร์โทร: {order.orderedBy.phone}</p>
                <p className="text-sm text-gray-600">
                  ที่อยู่: {order.deliveryAddress ? order.deliveryAddress : "รับที่ร้าน"}
                </p>
                <p className="text-sm text-gray-600">ยอดรวม: {numberFormat(order.cartTotal)}</p>
                <p
                  className={`text-sm font-bold flex items-center ${
                    order.orderStatus === "รอดำเนินการ"
                      ? "text-yellow-500"
                      : order.orderStatus === "กำลังจัดส่ง"
                      ? "text-blue-500"
                      : order.orderStatus === "จัดส่งสำเร็จ"
                      ? "text-green-500"
                      : order.orderStatus === "ยกเลิก"
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  สถานะ:
                  {order.orderStatus === "รอดำเนินการ" && <FaClock className="text-yellow-500 mr-2" />}
                  {order.orderStatus === "กำลังจัดส่ง" && <FaTruck className="text-blue-500 mr-2" />}
                  {order.orderStatus === "จัดส่งสำเร็จ" && <FaCheckCircle className="text-green-500 mr-2" />}
                  {order.orderStatus === "ยกเลิก" && <FaTimesCircle className="text-red-500 mr-2" />}
                  <span>{order.orderStatus}</span>
                </p>
              </div>
              <div
                className={`text-sm font-semibold flex items-center ${
                  order.deliveryMethod === "PICKUP" ? "text-blue-600" : "text-green-600"
                }`}
              >
                {order.deliveryMethod === "PICKUP" ? <FaStore className="mr-2" /> : <FaTruck className="mr-2" />}
                {order.deliveryMethod === "PICKUP" ? "รับที่ร้าน" : "จัดส่งถึงบ้าน"}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          setStatusFilter("");
          setDeliveryFilter("");
          setSortOrder("newest");
        }}
        className="border p-2 rounded bg-gray-300 text-black mt-4"
      >
        รีเซ็ต
      </button>
    </div>
  );
};

export default ListOrderManage;
