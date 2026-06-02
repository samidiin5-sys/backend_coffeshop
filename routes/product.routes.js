const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const upload = require("../middlewares/upload");
const { verifyToken } = require("../middlewares/auth");

// customer boleh lihat product
router.get("/", productController.getAllProduct);
router.get("/:id", productController.getProductById);

// admin saja
router.post("/", verifyToken, upload.single("image"), productController.createProduct);
router.put("/:id", verifyToken, upload.single("image"), productController.updateProduct);
router.delete("/:id", verifyToken, productController.deleteProduct);

module.exports = router;