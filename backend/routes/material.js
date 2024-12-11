const express = require("express");
const materialController = require("../controllers/material");

const router = express.Router();

router.post("/", materialController.create);
router.get("/", materialController.find);
router.get("/:materialId", materialController.findById);
router.patch("/:materialId", materialController.update);
router.delete("/:materialId", materialController.delete);

module.exports = router; 