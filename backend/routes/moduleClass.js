const express = require("express");
const moduleClassController = require("../controllers/moduleClass");

const router = express.Router();

router.get("/", moduleClassController.find);
router.get("/:moduleClassId", moduleClassController.findById);
router.post("/", moduleClassController.create);
router.patch("/:moduleClassId", moduleClassController.updateById);
router.delete("/:moduleClassId", moduleClassController.deleteById);

module.exports = router;
