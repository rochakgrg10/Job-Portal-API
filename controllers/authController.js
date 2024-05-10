import userModel from "../models/userModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Please provide name",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Please provide email",
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Please provide password",
      });
    }
    const existedUser = await userModel.findOne({ email });
    if (existedUser) {
      return res.status(400).send({
        success: false,
        message: "Email already existed. Please try another email.",
      });
    }
    const user = await userModel.create({ name, email, password });
    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in register controller",
      error,
    });
  }
};
