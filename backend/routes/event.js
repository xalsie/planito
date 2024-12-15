const express = require("express");
const eventController = require("../controllers/event");

const router = express.Router();

router.get("/", eventController.find);
router.post("/", eventController.create);

router.post("/availability", eventController.createAvailability);
router.get("/availabilities/:classId?", eventController.getAvailabilities);
router.get(
  "/availability/school/:schoolId",
  eventController.findAvailabilityEventsBySchool
);
router.get(
  "/availability/school/:schoolId/class/:classId",
  eventController.findAvailabilityEventsBySchoolByClass
);

router.get(
  "/intervenant/:intervenantId",
  eventController.findIntervenantEvents
);
router.get(
  "/intervenant/:intervenantId/school/:schoolId",
  eventController.findIntervenantEventsBySchool
);
router.get("/school/:schoolId", eventController.findCoursesBySchool);
router.get(
  "/school/:schoolId/class/:classId",
  eventController.findEventsBySchoolByClass
);
router.get("/:eventId", eventController.findById);
router.patch("/:eventId", eventController.updateById);
router.delete("/:eventId", eventController.deleteById);
router.post("/import", eventController.importIcalFromURL);

router.get("/user/:userId", eventController.findEventsByUser);

module.exports = router;
