const express = require("express");
const classController = require("../controllers/class");

const router = express.Router();

router.get("/", classController.find);
router.post("/", classController.create);
router.get("/:classId", classController.findById);
router.patch("/:classId", classController.updateById);
router.delete("/:classId", classController.deleteById);

module.exports = router;
