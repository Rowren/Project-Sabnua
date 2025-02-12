import React from 'react'
import { Elements } from '@stripe/react-stripe-js'; // เพิ่มการ import
import SummaryCard from '../components/card/SummaryCard'
import { loadStripe } from '@stripe/stripe-js';

// กำหนด Stripe public key
const stripePromise = loadStripe('pk_test_51QfFWYAR1tw9Jtihy9XCi6ggqppJLZmDQhDU1TgwwopdydkeEBRRFSYYdr5CUFQJ3bZhX9UMxB1l2rVK9KQLbwcO00J6g8h6bC');

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}> {/* ห่อด้วย Elements */}
      <div>
        <SummaryCard />
      </div>
    </Elements>
  );
}

export default Checkout;
