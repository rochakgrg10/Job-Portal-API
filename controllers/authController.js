import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name) {
    next("name is required");
  }
  if (!email) {
    next("Email is required");
  }
  if (!password) {
    next("password is required");
  }
  const existedUser = await userModel.findOne({ email });
  if (existedUser) {
    next("Email already existed. Please try another email.");
  }
  const user = await userModel.create({ name, email, password });
  //create token
  const token = user.createJWT();
  res.status(201).send({
    success: true,
    message: "User registered successfully",
    user: {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      location: user.location,
    },
    token,
  });
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  //validation
  if (!email || !password) {
    next("please provide email and password");
  }
  //find user by email
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    next("Invalid email and password");
  }
  //compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    next("Invalid email or password");
  }
  user.password = undefined;
  const token = user.createJWT();
  res.status(200).json({
    message: "Login Successfully",
    user,
    token,
  });
};
