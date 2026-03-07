const express = require("express");
const router = express.Router();

const menuImageController = require("../controllers/menuImageController");
const upload = require("../middleware/upload")
router.put("/update-image", menuImageController.updateMenuImage);

router.put("/remove-image", menuImageController.removeMenuImage);
router.get("/info/:id", menuImageController.getMenuImageInfo);
router.post("/upload",upload.single("image"),menuImageController.uploadMenuImage)
module.exports = router;