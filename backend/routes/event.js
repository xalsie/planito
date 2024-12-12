const express = require("express");
const eventController = require("../controllers/event");

const router = express.Router();

router.get("/", eventController.find);
router.post("/", eventController.create);
router.get("/school/:schoolId", eventController.findCoursesBySchool);
router.get("/:eventId", eventController.findById);
router.patch("/:eventId", eventController.updateById);
router.delete("/:eventId", eventController.deleteById);

module.exports = router;