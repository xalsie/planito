const express = require("express");
const eventController = require("../controllers/event.controller");

const router = express.Router();

router.get("/", eventController.find);
router.post("/create", eventController.create);
router.get("/:userId", eventController.findById);
router.patch("/:userId", eventController.updateById);
router.delete("/:userId", eventController.deleteById);

module.exports = router;