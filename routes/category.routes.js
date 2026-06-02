const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");
const upload = require("../middlewares/upload");
const { verifyToken } = require("../middlewares/auth");

// customer boleh lihat category
router.get("/", categoryController.getAllCategory);
router.get("/:id", categoryController.getCategoryById);

// admin saja
router.post("/", verifyToken, upload.none(), categoryController.createCategory);
router.put("/:id", verifyToken, upload.none(), categoryController.updateCategory);
router.delete("/:id", verifyToken, categoryController.deleteCategory);

module.exports = router;