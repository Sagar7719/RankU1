import User from "../models/userModel.js";

export const registerService = async (name, email, password) => {

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password
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