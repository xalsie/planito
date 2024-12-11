const express = require("express");
const eventController = require("../controllers/event");

const router = express.Router();

router.get("/", eventController.find);
router.post("/create", eventController.create);
router.get("/:eventId", eventController.findById);
router.patch("/:eventId", eventController.updateById);
router.delete("/:eventId", eventController.deleteById);

module.exports = router;