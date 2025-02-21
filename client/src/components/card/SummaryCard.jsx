import React, { useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import useSabnuaStore from "../../store/SabnuaStore";
import { listUserCart } from "../../api/user";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { numberFormat } from "../../utils/number";

const SummaryCard = () => {
    const stripe = useStripe();
    const elements = useElements();
    const token = useSabnuaStore((state) => state.token);
    const user = useSabnuaStore((state) => state.user);
    const getUserAddress = useSabnuaStore((state) => state.getUserAddress);
    const addressFromStore = useSabnuaStore((state) => state.address);
    const [products, setProducts] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [deliveryMethod, setDeliveryMethod] = useState("PICKUP");
    const [address, setAddress] = useState("รับที่ร้าน");
    const [errorMessage, setErrorMessage] = useState("");
    const [shippingCost, setShippingCost] = useState(0);
    const [discount, setDiscount] = useState(0); // ส่วนลด
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            getUserAddress();
        }
    }, [user, getUserAddress]);

    useEffect(() => {
        setAddress(deliveryMethod === "DELIVERY" ? addressFromStore || user?.address || "" : "รับที่ร้าน");
    }, [deliveryMethod, user, addressFromStore]);

    useEffect(() => {
        handleGetUserCart(token);
        if (deliveryMethod === "DELIVERY" && !address) {
            setErrorMessage("กรุณากรอกที่อยู่สำหรับการจัดส่ง");
        } else {
            setErrorMessage("");
        }

         
        setDiscount(0); // ตั้งส่วนลดเป็น 0
    }, [deliveryMethod, address, cartTotal]);

    const handleGetUserCart = async (token) => {
        try {
            const res = await listUserCart(token);
            setProducts(res.data.products);
            setCartTotal(res.data.cartTotal);
        } catch (err) {
            console.error("มีข้อผิดพลาด", err);
        }
    };

    const handleToPayment = async () => {
        if (!stripe || !elements) {
            Swal.fire({
                icon: "error",
                title: "ข้อผิดพลาด",
                text: "ไม่สามารถดำเนินการชำระเงินได้เนื่องจากระบบชำระเงินไม่พร้อม",
            });
            return;
        }

        if (deliveryMethod === "DELIVERY" && !address) {
            Swal.fire({
                icon: "error",
                title: "ข้อผิดพลาด",
                text: "กรุณากรอกที่อยู่สำหรับการจัดส่งก่อนดำเนินการต่อ",
            });
            return;
        }

        // ส่งข้อมูลไปที่หน้าชำระเงิน
        navigate("/user/payment");
    };

    return (
        <div className="mx-auto max-w-4xl p-6 bg-white shadow-md rounded-md">
            <div className="flex flex-wrap -mx-4">
                <div className="w-full md:w-1/2 px-4 mb-6 md:mb-0">
                    <div className="p-4 bg-gray-100 rounded-lg shadow-md space-y-4">
                        <h1 className="text-lg font-semibold text-gray-800 mb-4">วิธีการรับสินค้า</h1>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="deliveryMethod"
                                    value="PICKUP"
                                    checked={deliveryMethod === "PICKUP"}
                                    onChange={(e) => setDeliveryMethod(e.target.value)}
                                />
                                <span>รับเอง (Pickup)</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="deliveryMethod"
                                    value="DELIVERY"
                                    checked={deliveryMethod === "DELIVERY"}
                                    onChange={(e) => setDeliveryMethod(e.target.value)}
                                />
                                <span>จัดส่ง (Delivery)</span>
                            </label>
                        </div>

                        {/* ที่อยู่สำหรับรับสินค้า */}
                        <div className="mt-4 border-t pt-4">
                            <h2 className="text-md font-semibold text-gray-700">ที่อยู่สำหรับรับการรับอาหาร</h2>
                            <textarea
                                className="w-full p-2 border rounded-md mt-2 bg-gray-100"
                                value={deliveryMethod === "PICKUP" ? "รับที่ร้าน" : addressFromStore || address}
                                readOnly={deliveryMethod === "PICKUP"}
                                onChange={(e) => setAddress(e.target.value)} 
                                rows="3"
                            />
                            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 px-4">
                    <div className="p-4 bg-gray-100 rounded-lg shadow-md space-y-4">
                        <h1 className="text-lg font-semibold text-gray-800 mb-4">รายละเอียดคำสั่งซื้อของคุณ</h1>
                        {products?.map((pd, index) => (
                            <div key={index} className="flex justify-between items-end  py-2">
                                <div>
                                    <p className="font-semibold">{pd.product.title}</p>
                                    <p className="text-sm text-gray-600">{pd.product.category}</p>
                                </div>
                                <p className="font-semibold">{numberFormat(pd.product.price)}</p>
                            </div>
                        ))}
                        
                        <div className="flex justify-between items-end mt-4 border-t-2">
                            <div>
                                <p className="font-semibold">ค่าจัดส่ง</p>
                            </div>
                            <p>{numberFormat(shippingCost)}</p>
                        </div>

                        <div className="flex justify-between items-end mt-4 pt-4">
                            <div>
                                <p className="font-semibold">ส่วนลด</p>
                            </div>
                            <p className="text-red-500">- {numberFormat(discount)}</p>
                        </div>

                        <div className="flex justify-between items-end mt-4 border-t-2 pt-4">
                            <div>
                                <p className="font-semibold">ราคารวม</p>
                            </div>
                            <p>{numberFormat(cartTotal + shippingCost - discount)}</p>
                        </div>

                        <div className="mt-6">
                            <button
                                className="w-full bg-blue-600 text-white py-3 rounded-md"
                                onClick={handleToPayment}
                            >
                                ดำเนินการชำระเงิน
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;
