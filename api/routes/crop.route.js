import express from "express"
import { getCrops,addCrop,updateQuantity,getAllCrops,deleteCrop, updatePrice ,getSpecificCrop,updateQty} from "../controllers/crop.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route to get all crops
router.get('/getCrops',verifyToken, getCrops);

router.get('/getAllCrops',verifyToken, getAllCrops);

// Route to add a new crop
router.post('/addCrop',verifyToken, addCrop);

router.post('/updateQuantity',verifyToken, updateQuantity);

router.put('/updateQty',verifyToken,updateQty);
router.post('/updatePrice',verifyToken,updatePrice)
//Route to delete a crop
router.delete('/deleteCrop',verifyToken, deleteCrop);

//Specific Crop
router.get('/getSpecificCrops/:cropId', verifyToken, getSpecificCrop);

export default router;
