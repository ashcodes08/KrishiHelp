import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { updateUser } from "../controllers/user.controller.js";
import { test } from "../controllers/user.controller.js";
import { deleteUser,signout } from "../controllers/user.controller.js";
import { getUsers, getUser} from "../controllers/user.controller.js";
const router=express.Router();

router.get("/test",test)
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout',signout)
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);


export default router;