import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { payment } from '../../api/stripe';
import useSabnuaStore from '../../store/SabnuaStore';
import CheckoutForm from '../../components/CheckoutFrom';

const stripePromise = loadStripe('pk_test_51QfFWYAR1tw9Jtihy9XCi6ggqppJLZmDQhDU1TgwwopdydkeEBRRFSYYdr5CUFQJ3bZhX9UMxB1l2rVK9KQLbwcO00J6g8h6bC');

const Payment = () => {
  const token = useSabnuaStore((state) => state.token);
  const [clientSecret, setClientSecret] = useState('');
  useEffect(() => {
    payment(token)
      .then((res) => {
        console.log('API Response:', res);
        if (res?.clientSecret) { // ตรวจสอบ clientSecret ใน res โดยตรง
          setClientSecret(res.clientSecret); // ตั้งค่า clientSecret
        } else {
          console.error('Client secret not found in response.');
        }
      })
      .catch((err) => {
        console.error('API Error:', err);
      });
  }, [token]);
  

  const appearance = {
    theme: 'stripe',
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      {!clientSecret ? (
        <p>Loading payment details...</p>
      ) : (
        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Payment;
