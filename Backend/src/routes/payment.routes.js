import { Router } from "express";
import {
  createRazorpayOrder,
  verifyPayment,
} from "../controller/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Secure payment routes

router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyPayment);

export default router;