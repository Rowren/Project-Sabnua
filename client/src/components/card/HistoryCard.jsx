import React, { useEffect, useState } from "react";
import { getOrder } from "../../api/user";
import useSabnuaStore from "../../store/SabnuaStore";

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

  const numberFormat = (value) =>
    new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(value);

  return (
    <div className="space-y-4 p-3">
      <h1 className="text-2xl font-bold">ประวัติการสั่งซื้อ</h1>
      <div className="space-y-4 px-6 py-2">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md">
              {/* Header */}
              <div className="flex justify-between mb-2">
                <div>
                  <p className="text-sm">วันที่สั่งซื้อ</p>
                  <p className="font-bold">
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span>{order.orderStatus}</span>
                </div>
              </div>
              {/* Product Table */}
              <div>
                <table className="border w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th>สินค้า</th>
                      <th>ราคา</th>
                      <th>จำนวน</th>
                      <th>รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products?.map((product, idx) => (
                      <tr key={idx}>
                        <td>{product.product.title}</td>
                        <td>{numberFormat(product.product.price)}</td>
                        <td>{product.count}</td>
                        <td>{numberFormat(product.count * product.product.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Total */}
              <div className="text-right mt-4">
                <p className="font-bold">ราคาสุทธิ</p>
                <p className="text-lg">{numberFormat(order.cartTotal)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">ไม่มีคำสั่งซื้อ</p>
        )}
      </div>
    </div>
  );
};

export default HistoryCard;
