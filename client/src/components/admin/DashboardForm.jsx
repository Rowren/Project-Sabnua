import React, { useEffect, useState } from "react";
import { getDashboardData } from "../../api/admin";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import useSabnuaStore from "../../store/SabnuaStore";
import { dateFormat } from "../../utils/dateFormat";

// ลงทะเบียน Chart.js Elements
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

const DashboardFrom = () => {
  const [dashboard, setDashboard] = useState(null);
  const [selectedChart, setSelectedChart] = useState("topProducts");
  const token = useSabnuaStore((state) => state.token);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData(token);
        setDashboard(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  useEffect(() => {
    const charts = document.querySelectorAll('canvas');
    charts.forEach((canvas) => {
      const chartInstance = ChartJS.getChart(canvas);
      if (chartInstance) {
        chartInstance.destroy();  // ทำลายกราฟเก่า
      }
    });
  }, [selectedChart]);  // ทำลายกราฟเมื่อเลือกกราฟใหม่

  if (!dashboard) {
    return <div className="text-center text-lg font-semibold p-4">⏳ กำลังโหลดข้อมูล...</div>;
  }

  // ฟังก์ชันสร้างข้อมูลกราฟ
  const createChartData = (type) => {
    switch (type) {
      case "orderStatus":
        return {
          labels: ["รอดำเนินการ", "กำลังจัดส่ง", "จัดส่งสำเร็จ", "ยกเลิก"],
          datasets: [
            {
              data: [
                dashboard.pendingOrders,
                dashboard.shippingOrders,
                dashboard.completedOrders,
                dashboard.canceledOrders,
              ],
              backgroundColor: ["#FFA500", "#3498DB", "#2ECC71", "#E74C3C"],
            },
          ],
        };
      case "topProducts":
        return {
          labels: dashboard.topSellingProducts.map((product) => product.title || "ไม่มีชื่อ"),
          datasets: [
            {
              label: "จำนวนขาย",
              data: dashboard.topSellingProducts.map((product) => product.sold),
              backgroundColor: "#FF5733",
            },
          ],
        };
      case "revenue":
        return {
          labels: [
            "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
            "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
          ],
          datasets: [
            {
              label: "รายได้ต่อเดือน (บาท)",
              data: dashboard.monthlyRevenue,
              borderColor: "#FF5733",
              fill: false,
              tension: 0.4,
            },
          ],
        };
      default:
        return {};
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📊 รายงาน</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="📦 คำสั่งซื้อทั้งหมด" value={dashboard.totalOrders} color="from-blue-400 to-blue-600" />
        <DashboardCard title="👥 ผู้ใช้งานทั้งหมด" value={dashboard.totalUsers} color="from-green-400 to-green-600" />
        <DashboardCard title="🍔 เมนูทั้งหมด" value={dashboard.totalMenus} color="from-purple-400 to-purple-600" />
        <DashboardCard title="💰 ยอดขายรวมทั้งหมด" value={dashboard.totalSales.toLocaleString()} color="from-yellow-400 to-yellow-600" />
      </div>

      {/* แถบเลือกกราฟ */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          className={`px-6 py-2 text-lg font-semibold text-white ${selectedChart === "revenue" ? "bg-blue-600 border-b-4 border-blue-800" : "bg-gray-400 border-b-4 border-transparent hover:border-blue-500"} rounded-t-md transition-all duration-300`}
          onClick={() => setSelectedChart("revenue")}
        >
          กราฟยอดขาย
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold text-white ${selectedChart === "topProducts" ? "bg-blue-600 border-b-4 border-blue-800" : "bg-gray-400 border-b-4 border-transparent hover:border-blue-500"} rounded-t-md transition-all duration-300`}
          onClick={() => setSelectedChart("topProducts")}
        >
          สินค้าขายดี
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold text-white ${selectedChart === "orderStatus" ? "bg-blue-600 border-b-4 border-blue-800" : "bg-gray-400 border-b-4 border-transparent hover:border-blue-500"} rounded-t-md transition-all duration-300`}
          onClick={() => setSelectedChart("orderStatus")}
        >
          กราฟสถานะคำสั่งซื้อ
        </button>
      </div>


      {/* แสดงกราฟตามตัวเลือก */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 transition-transform">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {selectedChart === "revenue" ? "💰 รายได้ต่อเดือน" : selectedChart === "topProducts" ? "🔥 สินค้าขายดี" : "📊 สถานะคำสั่งซื้อ"}
        </h2>
        <div className="flex justify-center">
          {selectedChart === "revenue" ? (
            <Line data={createChartData("revenue")} options={{ responsive: true }} />
          ) : selectedChart === "topProducts" ? (
            <Bar data={createChartData("topProducts")} />
          ) : (
            <Doughnut data={createChartData("orderStatus")} />
          )}
        </div>
      </div>

      <div className="text-center text-gray-600 mt-4">
        อัปเดตล่าสุด: {dateFormat(dashboard.lastUpdate)}
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-md text-white bg-gradient-to-r ${color} transition-transform`}>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default DashboardFrom;
