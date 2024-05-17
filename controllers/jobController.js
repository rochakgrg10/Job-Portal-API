import jobModel from "../models/jobModel.js";

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
