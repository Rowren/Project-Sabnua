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

  const handleGetOrders = (token) => {
    getOrder(token)
      .then((res) => {
        console.log(res.data); // ตรวจสอบข้อมูล API
        setOrders(res.data.orders);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      });
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold text-gray-800">ประวัติการสั่งซื้อ</h1>
      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-md shadow-md border border-gray-200"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">วันที่สั่งซื้อ</p>
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
              {/* Product Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600">
                      <th className="px-4 py-2 text-left text-sm font-semibold border">
                        สินค้า
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold border">
                        ราคา
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold border">
                        จำนวน
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold border">
                        รวม
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products?.map((product, idx) => (
                      <tr key={idx} className="text-gray-800">
                        <td className="px-4 py-2 border">
                          {product.product.title}
                        </td>
                        <td className="px-4 py-2 border">
                          {numberFormat(product.product.price)}
                        </td>
                        <td className="px-4 py-2 border">{product.count}</td>
                        <td className="px-4 py-2 border">
                          {numberFormat(
                            product.count * product.product.price
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Total */}
              <div className="text-right mt-4">
                <p className="text-sm text-gray-500">ราคาสุทธิ</p>
                <p className="text-xl font-bold text-gray-800">
                  {numberFormat(order.cartTotal)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg">
            ไม่มีคำสั่งซื้อ
          </p>
        )}
      </div>
    </div>
  );
};

export default HistoryCard;
