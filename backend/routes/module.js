const express = require("express");
const moduleController = require("../controllers/module");

const router = express.Router();

router.post("/", moduleController.create);

router.get("/", moduleController.find);

router.get("/school/:schoolId", moduleController.findBySchool);

router.get("/:moduleId", moduleController.findById);

router.patch("/:moduleId", moduleController.update);

router.delete("/:moduleId", moduleController.delete);

module.exports = router;
