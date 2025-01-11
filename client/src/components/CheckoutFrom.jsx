import React, { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import '../stripe.css'
import { saveOrder } from "../api/user";
import useSabnuaStore from "../store/SabnuaStore";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const token = useSabnuaStore((state)=>state.token)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const payload = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        });


        if (payload.error) {
            setMessage(error.message);
        } else {
            //create Order
            saveOrder(token,payload)
           .then((res)=>{
            console.log(res)
           })
           .catch((err) =>{
            console.log(err)
           })
  
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "accordion"
    }

    return (
        <>
            <form className="space-y-6" id="payment-form" onSubmit={handleSubmit}>
                <PaymentElement id="payment-element" options={paymentElementOptions} />
                <button
                    className="stripe-button"
                    disabled={isLoading || !stripe || !elements}
                    id="submit"
                >
                    <span id="button-text">
                        {isLoading ? (
                            <div className="spinner" id="spinner"></div>
                        ) : (
                            "Pay now"
                        )}
                    </span>
                </button>
                {/* Show any error or success messages */}
                {message && <div id="payment-message">{message}</div>}
            </form>
        </>
    );
}