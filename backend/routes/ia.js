const express = require("express");
const iaController = require("../controllers/ia");

const router = express.Router();

router.get("/", iaController.getSchedulData);


module.exports = router;
