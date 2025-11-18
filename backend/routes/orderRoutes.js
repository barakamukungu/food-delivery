import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
} from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);

orderRouter.post("/verify", verifyOrder);

orderRouter.get("/myorders", authMiddleware, userOrders);

orderRouter.get("/list", authMiddleware, listOrders);

orderRouter.post("/status", authMiddleware, updateStatus);

export default orderRouter;