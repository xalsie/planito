const express = require("express");
const roomController = require("../controllers/room");

const router = express.Router();

router.post("/", roomController.create);
router.get("/", roomController.find);
router.get("/school/:schoolId", roomController.findBySchool);
router.get("/:roomId", roomController.findById);
router.patch("/:roomId", roomController.update);
router.delete("/:roomId", roomController.delete);

module.exports = router; 