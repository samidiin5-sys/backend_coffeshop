const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

const db = require("./models");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const loginRoutes = require("./routes/login.routes");
const orderRoutes = require("./routes/order.routes");
const {verifyToken} = require("./middlewares/auth");
db.sequelize.authenticate()
    .then(() => console.log("Database berhasil tersambung"))
    .catch(err => console.error(err));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/login", loginRoutes);
// routes
app.use("/categories", categoryRoutes);
app.use("/product", productRoutes);
app.use("/orders",  orderRoutes )
app.get("/", (req, res) => {
    res.send("Hello World!");
});

if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}

module.exports = app;