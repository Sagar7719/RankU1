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