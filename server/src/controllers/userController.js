export const updateUserProfile = async (req, res, next) => {
  try {
    const user = req.user;

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res) => {
  res.json(req.user);
};