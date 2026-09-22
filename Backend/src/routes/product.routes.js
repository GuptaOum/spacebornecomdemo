import { Router } from "express";
import {
  createProduct,
  searchAndFilterProducts,
} from "../controller/product.controller.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", searchAndFilterProducts);
router.post("/", verifyJWT, verifyAdmin, createProduct);

export default router;
