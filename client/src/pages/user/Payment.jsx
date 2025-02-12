import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { payment } from "../../api/stripe";
import useSabnuaStore from "../../store/SabnuaStore";
import CheckoutFrom from "../../components/CheckoutFrom"// ตรวจสอบชื่อไฟล์ให้ตรงกัน

const stripePromise = loadStripe("pk_test_51QfFWgPIj0maEGG55JpYltd6RgjsKYmNqApD5dwmdxNlnScgpjqW7soDmOqINqc1y7hd7rl7teS4ZgVGJt14opCr00MivXt7E7");

const Payment = () => {
  const token = useSabnuaStore((state) => state.token);
  const [clientSecret, setClientSecret] = useState(null); // ตั้งค่าเป็น null เริ่มต้น
  const [error, setError] = useState(null);

  useEffect(() => {
    payment(token)
      .then((res) => {
        if (res?.clientSecret) {
          setClientSecret(res.clientSecret);
        } else {
          setError("ไม่พบข้อมูล Client Secret");
          console.error("Client secret not found in response.");
        }
      })
      .catch((err) => {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูลการชำระเงิน");
        console.error("API Error:", err);
      });
  }, [token]);

  const appearance = {
    theme: "stripe",
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      {!clientSecret && !error ? (
        <p className="text-gray-500">กำลังโหลดข้อมูลการชำระเงิน...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
          <CheckoutFrom />
        </Elements>
      )}
    </div>
  );
};


export default Payment;
