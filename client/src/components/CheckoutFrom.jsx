import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { saveOrder } from "../api/user";
import useSabnuaStore from "../store/SabnuaStore";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSabnuaStore((state) => state.token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      setMessage(result.error.message);
    } else {
      try {
        await saveOrder(token, result);
        setMessage("ชำระเงินสำเร็จ และบันทึกคำสั่งแล้ว!");
      } catch (error) {
        console.error(error);
        setMessage("ชำระเงินสำเร็จ แต่เกิดข้อผิดพลาดในการบันทึกคำสั่ง");
      }
    }

    setIsLoading(false);
  };

  return (
    <form className="space-y-6 w-full max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? "กำลังดำเนินการ..." : "ชำระเงินตอนนี้"}
      </button>
      {message && <div className="mt-4 text-center text-gray-700">{message}</div>}
    </form>
  );
}
