import express from "express";
import updateUser from "../controllers/userController.js";
import userAuth from "../Middleware/authMiddleware.js";

const router = express.Router();

//routes
//Get User || GET Method

//Update User || PUT Method
router.put("/update-user", userAuth, updateUser);

export default router;
