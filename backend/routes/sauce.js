const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauceController = require("../controllers/sauce");

router.get("/", sauceController.getAllSauce);
router.post("/", multer, sauceController.createSauce);
router.get("/:id", sauceController.getOneSauce);
router.put("/:id", multer, sauceController.modifySauce);
router.delete("/:id", sauceController.deleteSauce);
router.post("/:id/like", sauceController.likeSauce);

module.exports = router;
