const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const upload = require("../middlewares/upload");
const { verifyToken } = require("../middlewares/auth");


router.post("/", upload.none(), orderController.createOrder);
router.get("/:id", orderController.getOrderById);

//ini untuk di kasir jadi harus login dulu
router.put("/:id/status", verifyToken, upload.none(), orderController.updateStatusOrder);
router.get("/",verifyToken, orderController.getAllOrder);
router.delete("/:id", verifyToken, orderController.deleteOrder);
module.exports = router;
