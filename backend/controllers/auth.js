const User = require("../models/user");
const School = require("../models/school");
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

    user.password = undefined;

    if (user.roles.includes("ROLE_STAFF")) {
      const school = await School.findOne({
        where: { user_id: user.id },
      });
      return res.status(200).json({
        token: user.id,
        school: school,
        schoolId: school.id,
      });
    }
    return res.status(200).json({
      token: user.id,
      user: user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
