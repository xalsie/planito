const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });
    if (!user) {
      const error = new Error("Could not find a user with this email.");
      error.statusCode = 404;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Invalid password.");
      error.statusCode = 422;
      throw error;
    }
    res.status(200).json({
      token: user.id,
      name: `${user.firstName} ${user.lastName}`,
      roles: user.roles,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
