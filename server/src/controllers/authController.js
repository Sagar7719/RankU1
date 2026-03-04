import generateToken from "../utils/generateToken.js";
import {
  registerService,
  loginService
} from "../services/authService.js";


// Register
export const register = async (req, res, next) => {

  try {

    const { name, email, password } = req.body;

    const user = await registerService(
      name,
      email,
      password
    );

    res.status(201).json({

      success: true,

      token: generateToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }

    });

  } catch (error) {

  res.status(400);

  next(error);

}

};



// Login
export const login = async (req, res, next) => {

  try {

    const { email, password } = req.body;

    const user = await loginService(
      email,
      password
    );

    res.json({

      success: true,

      token: generateToken(user._id),

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }

    });

  } catch (error) {

  res.status(401);

  next(error);

}

};