import express from "express";
import { testPostController } from "../controllers/testController.js";
import userAuth from "../Middleware/authMiddleware.js";

//router object
const router = express.Router();

//routes
router.post("/testpost", userAuth, testPostController);

export default router;
