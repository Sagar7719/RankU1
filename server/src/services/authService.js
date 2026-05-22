import User from "../models/userModel.js";

export const registerService = async (name, email, password, mobileNumber) => {

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  if (mobileNumber) {
    const mobileExists = await User.findOne({ mobileNumber });
    if (mobileExists) {
      throw new Error("Mobile number already in use");
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    mobileNumber
  });

  return user;

};


export const loginService = async (email, password) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  return user;

};