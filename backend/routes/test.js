const express = require("express");
const { get } = require("../controllers/test");

const router = express.Router();

router.post("/", get);

module.exports = router;
