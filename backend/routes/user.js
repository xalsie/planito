const express = require("express");
const User = require("../models/user");
const userController = require("../controllers/user");

const router = express.Router();

router.get("/create", userController.create);

module.exports = router;
