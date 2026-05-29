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


export const loginService = async (identifier, password) => {

  if (!identifier) {
    throw new Error("Please provide email or mobile number");
  }

  const isEmail = identifier.includes("@");
  let query = {};
  if (isEmail) {
    query.email = identifier.toLowerCase().trim();
  } else {
    query.mobileNumber = identifier.trim();
  }

  const user = await User.findOne(query);

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  return user;

};