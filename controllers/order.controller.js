const Validator = require("fastest-validator");
const v = new Validator();

const { Order, OrderItem, Product, User } = require("../models");
const { response } = require("../helpers/response.formatter");

module.exports = {
    createOrder: async (req, res) => {
        try {
            const userId = null;
            const items = JSON.parse(req.body.items);

            if (!items || items.length === 0) {
                return res.status(400).json(
                    response(400, "items tidak boleh kosong")
                );
            }

            let totalPrice = 0;

            const order = await Order.create({
                userId: null,
                totalPrice: 0,
                status: "pending"
            });

            for (const item of items) {
                const product = await Product.findByPk(item.productId);

                if (!product) {
                    return res.status(404).json(
                        response(404, `product id ${item.productId} tidak ditemukan`)
                    );
                }

                const subtotal = product.price * item.quantity;
                totalPrice += subtotal;

                await OrderItem.create({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price
                });
            }

            await Order.update(
                { totalPrice },
                { where: { id: order.id } }
            );

            const result = await Order.findByPk(order.id, {
                include: [
                    {
                        model: User,
                        attributes: ["id", "name", "email", "role"]
                    },
                    {
                        model: OrderItem,
                        include: [
                            {
                                model: Product,
                                attributes: ["id", "name", "price", "image"]
                            }
                        ]
                    }
                ]
            });

            return res.status(201).json(
                response(201, "created", result)
            );

        } catch (error) {
            return res.status(500).json(
                response(500, "server error", error.message)
            );
        }
    },

    getAllOrder: async (req, res) => {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: User,
                        attributes: ["id", "name", "email", "role"]
                    },
                    {
                        model: OrderItem,
                        include: [
                            {
                                model: Product,
                                attributes: ["id", "name", "price", "image"]
                            }
                        ]
                    }
                ]
            });

            return res.status(200).json(
                response(200, "success", orders)
            );

        } catch (error) {
            return res.status(500).json(
                response(500, "server error", error.message)
            );
        }
    },

    getOrderById: async (req, res) => {
        try {
            const { id } = req.params;

            const order = await Order.findByPk(id, {
                include: [
                    {
                        model: User,
                        attributes: ["id", "name", "email", "role"]
                    },
                    {
                        model: OrderItem,
                        include: [
                            {
                                model: Product,
                                attributes: ["id", "name", "price", "image"]
                            }
                        ]
                    }
                ]
            });

            if (!order) {
                return res.status(404).json(
                    response(404, "order tidak ditemukan")
                );
            }

            return res.status(200).json(
                response(200, "success", order)
            );

        } catch (error) {
            return res.status(500).json(
                response(500, "server error", error.message)
            );
        }
    },

    updateStatusOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const order = await Order.findByPk(id);

            if (!order) {
                return res.status(404).json(
                    response(404, "order tidak ditemukan")
                );
            }

            const schema = {
                status: { type: "enum", values: ["pending", "paid", "done", "cancel"] }
            };

            const validate = v.validate({ status }, schema);

            if (validate.length > 0) {
                return res.status(400).json(
                    response(400, "error validasi", validate)
                );
            }

            await Order.update(
                { status },
                { where: { id } }
            );

            const updated = await Order.findByPk(id);

            return res.status(200).json(
                response(200, "updated", updated)
            );

        } catch (error) {
            return res.status(500).json(
                response(500, "server error", error.message)
            );
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const { id } = req.params;

            const order = await Order.findByPk(id);

            if (!order) {
                return res.status(404).json(
                    response(404, "order tidak ditemukan")
                );
            }

            await OrderItem.destroy({
                where: { orderId: id }
            });

            await Order.destroy({
                where: { id }
            });

            return res.status(200).json(
                response(200, "order deleted")
            );

        } catch (error) {
            return res.status(500).json(
                response(500, "server error", error.message)
            );
        }
    }
};