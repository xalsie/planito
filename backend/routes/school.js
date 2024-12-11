const express = require("express");
const schoolController = require("../controllers/school");

const router = express.Router();

router.post("/", schoolController.create);

router.get("/", schoolController.find);

router.get("/:schoolId", schoolController.findById);

router.patch("/:schoolId", schoolController.update);

router.delete("/:schoolId", schoolController.delete);

module.exports = router;
