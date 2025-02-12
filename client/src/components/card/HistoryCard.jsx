import React, { useEffect, useState } from "react";
import { getOrder } from "../../api/user";
import useSabnuaStore from "../../store/SabnuaStore";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateFormat";

const HistoryCard = () => {
  const token = useSabnuaStore((state) => state.token);
  const [orders, setOrders] = useState([]);

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

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📦 ประวัติการสั่งซื้อ</h1>
      
      {orders.length > 0 ? (
        orders.map((order, index) => {
          const shippingCost = order.deliveryMethod === "DELIVERY" ? 30 : 0;

          return (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 mb-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">📅 วันที่สั่งซื้อ</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {dateFormat(order.updatedAt)}
                  </p>
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

              {/* วิธีจัดส่ง */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">🚚 วิธีจัดส่ง</p>
                <p className="text-lg font-semibold text-gray-800">
                  {order.deliveryMethod === "DELIVERY" ? "จัดส่งถึงบ้าน" : "รับที่ร้าน"}
                </p>
              </div>

              {/* Product Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600">
                      <th className="px-4 py-2 text-left text-sm font-semibold border">สินค้า</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold border">ราคา</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold border">จำนวน</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold border">รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products?.map((product, idx) => (
                      <tr key={idx} className="text-gray-800 hover:bg-gray-100 transition">
                        <td className="px-4 py-2 border">{product.product.title}</td>
                        <td className="px-4 py-2 border">{numberFormat(product.product.price)}</td>
                        <td className="px-4 py-2 border text-center">{product.count}</td>
                        <td className="px-4 py-2 border font-semibold">
                          {numberFormat(product.count * product.product.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ค่าจัดส่ง */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">🚛 ค่าจัดส่ง</p>
                <p className="text-lg font-semibold text-gray-800">
                  {numberFormat(shippingCost)}
                </p>
              </div>

              {/* Total */}
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
    </div>
  );
};

export default HistoryCard;
