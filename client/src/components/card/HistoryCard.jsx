import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // เพิ่ม useNavigate
import { getOrder } from "../../api/user";
import useSabnuaStore from "../../store/SabnuaStore";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateFormat";

const HistoryCard = () => {
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง
  const token = useSabnuaStore((state) => state.token);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5; // จำนวนคำสั่งซื้อที่แสดงในแต่ละหน้า

  useEffect(() => {
    if (token) {
      handleGetOrders(token);
    }
  }, [token]);

  const handleGetOrders = async (token) => {
    try {
      const res = await getOrder(token);
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // ฟังก์ชันเพื่อเปลี่ยนเส้นทางไปที่หน้ารายละเอียด
  const handleCardClick = (orderId) => {
    navigate(`/user/history/${orderId}`);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📦 ประวัติการสั่งซื้อ</h1>

      {currentOrders.length > 0 ? (
        currentOrders.map((order, index) => {
          const shippingCost = order.deliveryMethod === "DELIVERY" ? 30 : 0;

          return (
            <div
              key={index}
              onClick={() => handleCardClick(order.id)} // เพิ่ม onClick เพื่อเปลี่ยนเส้นทาง
              className="cursor-pointer bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 mb-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* รหัสรายการสั่งซื้อ + วันที่สั่งซื้อ */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-2xl font-semibold text-gray-800"> รหัสคำสั่งซื้อ: {order.id}</p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      order.orderStatus === "รอดำเนินการ"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.orderStatus === "กำลังจัดส่ง"
                        ? "bg-blue-100 text-blue-800"
                        : order.orderStatus === "จัดส่งสำเร็จ"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* วันที่สั่งซื้อ */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">📅 วันที่สั่งซื้อ</p>
                <p className="text-lg font-semibold text-gray-800">
                  {dateFormat(order.updatedAt)}
                </p>
              </div>

              {/* วิธีจัดส่ง */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">🚚 วิธีจัดส่ง</p>
                <p className="text-lg font-semibold text-gray-800">
                  {order.deliveryMethod === "DELIVERY" ? "จัดส่งถึงบ้าน" : "รับที่ร้าน"}
                </p>
              </div>

              {/* ราคาสุทธิ */}
              <div className="flex justify-between items-center mt-4 border-t pt-4">
                <p className="text-sm text-gray-500">💰 ราคาสุทธิ</p>
                <p className="text-xl font-bold text-blue-600">
                  {numberFormat(order.cartTotal + shippingCost)}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500 text-lg">❌ ไม่มีคำสั่งซื้อ</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
            className="border p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-400 transition"
          >
            ก่อนหน้า
          </button>
          <span className="self-center text-gray-600 font-semibold">
            หน้า {currentPage} จาก {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
            className="border p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-400 transition"
          >
            ถัดไป
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryCard;
