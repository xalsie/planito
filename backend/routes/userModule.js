const express = require("express");
const userModuleController = require("../controllers/userModule");

const router = express.Router();

router.post("/", userModuleController.create);
router.get("/:userId", userModuleController.getAllByUserId);
router.put("/:id", userModuleController.update);
router.delete("/:id", userModuleController.delete);

module.exports = router;
