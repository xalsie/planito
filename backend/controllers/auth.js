const User = require("../models/user");
const UserSchool = require("../models/userSchool");
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
    if (user.roles.contains("ROLE_STAFF")) {
      const userSchool = await UserSchool.findOne({
        where: { user_id: user.id },
      });
      return res.status(200).json({
        token: user.id,
        name: `${user.firstName} ${user.lastName}`,
        roles: user.roles,
        schoolId: userSchool.school_id,
      });
    }
    return res.status(200).json({
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
