import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailOrder } from "../../api/user"; // นำเข้า api จากไฟล์ api
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateFormat";
import useSabnuaStore from "../../store/SabnuaStore";

const DetailHistoryCard = () => {
  const { id } = useParams(); // ดึง id จาก URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSabnuaStore((state) => state.token);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await getDetailOrder(token, id);
        if (res.ok) {
          setOrder(res.order);
        } else {
          setError("ไม่พบข้อมูลคำสั่งซื้อ");
        }
      } catch (err) {
        console.error("Error fetching order detail:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">⏳ กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📦 รายละเอียดคำสั่งซื้อ</h1>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        {/* รหัสคำสั่งซื้อ + วันที่สั่งซื้อ */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-semibold text-gray-800"> รหัสคำสั่งซื้อ: {order.id}</p>
            <p className="text-sm text-gray-500">📅 วันที่สั่งซื้อ: {dateFormat(order.createdAt)}</p>
          </div>
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

        {/* รายละเอียดผู้สั่งซื้อ */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">👤 ผู้สั่งซื้อ</p>
          <p className="text-lg font-semibold text-gray-800">{order.orderedBy}</p>
          <p className="text-sm text-gray-500">📞 เบอร์โทร: {order.tell}</p>
        </div>

        {/* วิธีจัดส่ง + ที่อยู่ */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">🚚 วิธีจัดส่ง</p>
          <p className="text-lg font-semibold text-gray-800">
            {order.deliveryMethod === "DELIVERY" ? "จัดส่งถึงบ้าน" : "รับที่ร้าน"}
          </p>
          {order.deliveryMethod === "DELIVERY" && (
            <>
              <p className="text-sm text-gray-500">📍 ที่อยู่จัดส่ง</p>
              <p className="text-lg font-semibold text-gray-800">{order.deliveryAddress}</p>
            </>
          )}
        </div>

        {/* รายการสินค้า - เปลี่ยนเป็นตาราง */}
        <div className="mb-4">
          <p className="text-xl font-bold text-gray-800">🛒 รายการสินค้า</p>
          <table className="min-w-full table-auto mt-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">ชื่อสินค้า</th>
                <th className="px-4 py-2 text-left text-gray-600">จำนวน</th>
                <th className="px-4 py-2 text-left text-gray-600">ราคา/ชิ้น</th>
                <th className="px-4 py-2 text-left text-gray-600">รวม</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.count} ชิ้น</td>
                  <td className="px-4 py-2">{numberFormat(item.price)}</td>
                  <td className="px-4 py-2 font-semibold text-blue-600">
                    {numberFormat(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ราคารวมทั้งหมด */}
        <div className="flex justify-between items-center mt-4 border-t pt-4">
          <p className="text-sm text-gray-500">💰 ราคารวมทั้งหมด</p>
          <p className="text-2xl font-bold text-blue-600">{numberFormat(order.total)}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailHistoryCard;
