import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../models/order.model.js";
import { Payment } from "../models/payment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, "Razorpay credentials are not configured");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// 1. Create Razorpay Payment Order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized access to order");
  }

  if (order.paymentStatus === "PAID") {
    throw new ApiError(400, "Order is already paid");
  }

  // Razorpay accepts amount in smallest currency sub-unit (e.g. paise for INR)
  const options = {
    amount: Math.round(order.totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${order._id}`,
  };

  const razorpayOrder = await getRazorpayInstance().orders.create(options);

  if (!razorpayOrder) {
    throw new ApiError(500, "Failed to create Razorpay order");
  }

  // Create or update payment log record
  await Payment.findOneAndUpdate(
    { order: order._id },
    {
      order: order._id,
      user: req.user._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      status: "PENDING",
    },
    { upsert: true, new: true }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      "Razorpay order initialized successfully"
    )
  );
});

// 2. Verify Razorpay Payment Signature
const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId) {
    throw new ApiError(400, "Payment verification details are incomplete");
  }

  // Generate expected signature using HMAC-SHA256
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpaySignature;

  if (!isAuthentic) {
    await Payment.findOneAndUpdate(
      { razorpayOrderId },
      { status: "FAILED" }
    );
    throw new ApiError(400, "Payment verification failed. Invalid signature.");
  }

  // Update Payment details
  await Payment.findOneAndUpdate(
    { razorpayOrderId },
    {
      razorpayPaymentId,
      razorpaySignature,
      status: "SUCCESS",
    }
  );

  // Update Order status
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      paymentStatus: "PAID",
      orderStatus: "PROCESSING",
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, "Payment verified successfully"));
});

export { createRazorpayOrder, verifyPayment };
