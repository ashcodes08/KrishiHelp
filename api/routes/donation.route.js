import express from "express";
const router = express.Router();
import { donationCompletion } from "../controllers/donation.controller.js";

router.post('/donated', donationCompletion);

export default router;
