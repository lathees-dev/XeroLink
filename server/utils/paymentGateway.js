import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (amount, currency = "INR") => {
  const options = {
    amount: amount * 100, // amount in paise
    currency,
    receipt: `order_rcptid_${Date.now()}`,
  };
  return await razorpay.orders.create(options);
};
