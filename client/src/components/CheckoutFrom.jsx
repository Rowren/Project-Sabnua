import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { saveOrder } from "../api/user";
import useSabnuaStore from "../store/SabnuaStore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับเปลี่ยนเส้นทาง
  const token = useSabnuaStore((state) => state.token);
  const clearCart = useSabnuaStore((state) => state.clearCart);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ระบบชำระเงินไม่พร้อมใช้งานในขณะนี้",
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const payload = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });
  
      if (payload.error) {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: payload.error.message,
        });
      } else if (payload.paymentIntent.status === "succeeded") {
        try {
          const deliveryMethod = "DELIVERY"; // หรือ "PICKUP" ตามค่าที่ต้องการ
          await saveOrder(token, payload.paymentIntent, deliveryMethod);
          clearCart();
          Swal.fire({
            icon: "success",
            title: "สำเร็จ!",
            text: "ชำระเงินสำเร็จ และบันทึกคำสั่งซื้อแล้ว!",
          }).then(() => {
            navigate("/user/history");
          });
        } catch (err) {
          console.error("Error saving order:", err);
          Swal.fire({
            icon: "error",
            title: "ข้อผิดพลาด",
            text: "ชำระเงินสำเร็จ แต่เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ",
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "ชำระเงินไม่สำเร็จ",
          text: "โปรดลองอีกครั้งในภายหลัง",
        });
      }
    } catch (err) {
      console.error("Error confirming payment:", err);
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการดำเนินการชำระเงิน",
      });
    }
  
    setIsLoading(false);
  };
  

  return (
    <form
      className="space-y-6 w-full max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <PaymentElement />
      <button
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? "กำลังดำเนินการ..." : "ชำระเงินตอนนี้"}
      </button>
    </form>
  );
}