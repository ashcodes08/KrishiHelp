import express from "express";
import { createOrder, getOrders , fetchFarmerOrders,updateOrderStatus} from "../controllers/order.controller.js";

const router = express.Router();

router.post('/create', createOrder);

router.get('/getorders/:userId', getOrders); 
router.put('/updateOrderStatus', updateOrderStatus);
router.get('/getAllOrders' , fetchFarmerOrders);
export default router;
