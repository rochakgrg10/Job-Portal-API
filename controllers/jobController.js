import mongoose from "mongoose";
import jobModel from "../models/jobModel.js";
import moment from "moment";

export const createJob = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("Comapany name and position fields are required.");
  }
  req.body.createdBy = req.user.userId;
  const job = await jobModel.create(req.body);
  res.status(201).json(job);
};

//get All jobs
export const getAllJobs = async (req, res, next) => {
  const jobs = await jobModel.find({ createdBy: req.user.userId });
  res.status(200).json({
    totalJobs: jobs.length,
    jobs,
  });
};

export const updateJob = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  //validation
  if (!company || !position) {
    next("Please provide all fields");
  }
  //find job
  const job = await jobModel.findOne({ _id: id });
  if (!job) {
    next(`Not found job with id ${id}`);
  }
  if (req.user.userId !== job.createdBy.toString()) {
    next("You are not authorized to update this job");
    return;
  }
  const updateJob = await jobModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(updateJob);
};

export const deleteJob = async (req, res, next) => {
  const { id } = req.params;
  //find job
  const job = await jobModel.findOne({ _id: id });
  //validation
  if (!job) {
    next(`There is no job with id ${id}`);
    return;
  }

  if (req.user.userId !== job.createdBy.toString()) {
    next("You are not authorized to delete this job");
    return;
  }

  await job.deleteOne();
  res.status(200).json({
    message: `You have deleted job with id ${id}`,
  });
};

// job stats and filter
export const jobStats = async (req, res) => {
  const stats = await jobModel.aggregate([
    //search by user job
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  //default stats
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    reject: stats.reject || 0,
  };

  //monthly yearly stats
  let monthlyApplication = await jobModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(200).json({
    totalJobs: stats.length,
    defaultStats,
    monthlyApplication,
  });
};
