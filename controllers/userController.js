import userModel from "../models/userModel.js";

const updateUser = async (req, res, next) => {
  const { name, lastname, location, email } = req.body;
  if (!name || !lastname || !location || !email) {
    next("Please provide all field");
  }
  const user = await userModel.findOne({ _id: req.user.userId });
  user.name = name;
  user.lastname = lastname;
  user.location = location;
  user.email = email;

  await user.save();
  const token = user.createJWT();
  res.status(200).send({
    user,
    token,
  });
};

export default updateUser;
