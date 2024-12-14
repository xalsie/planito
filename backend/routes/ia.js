const express = require("express");
const iaController = require("../controllers/ia");

const router = express.Router();

router.post("/", iaController.generateEvents);


module.exports = router;
