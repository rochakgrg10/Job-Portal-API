import express from "express";
import userAuth from "../Middleware/authMiddleware.js";
import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
} from "../controllers/jobController.js";

const router = express.Router();

//routes
//create job
router.post("/createjob", userAuth, createJob);

//get job
router.get("/getjob", userAuth, getAllJobs);

//update job || patch
router.patch("/updatejob/:id", userAuth, updateJob);

//delete job || delete
router.delete("/deletejob/:id", userAuth, deleteJob);

export default router;
