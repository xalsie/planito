const express = require("express");
const userController = require("../controllers/user");

const router = express.Router();

router.post("/", userController.create);

router.get("/", userController.find);

router.get("/intervenants/:schoolId", userController.findIntervenantBySchool);

router.get("/:userId", userController.findById);

router.patch("/:userId", userController.update);

router.delete("/:userId", userController.delete);

router.get("/:userId/schools", userController.findSchoolsByUser);

router.get("/:userId/classes/", userController.findClasses);

router.get("/:userId/classes/:schoolId", userController.findClassesBySchool);

module.exports = router;
