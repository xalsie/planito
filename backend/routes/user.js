const express = require("express");
const userController = require("../controllers/user");

const router = express.Router();

router.post("/", userController.create);

router.get("/", userController.find);

router.get("/:userId", userController.findById);

router.patch("/:userId", userController.update);

router.delete("/:userId", userController.delete);

module.exports = router;
