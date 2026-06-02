const Validator = require("fastest-validator");
const v = new Validator();

const { Product, Category } = require("../models");
const { response } = require("../helpers/response.formatter");

module.exports = {
    createProduct: async (req, res) => {
        try {
            const schema = {
                name: { type: "string", min: 3 },
                price: { type: "number", positive: true },
                categoryId: { type: "number", positive: true, integer: true },
                description: { type: "string", optional: true }
            };

            const data = {
                name: req.body.name,
                price: Number(req.body.price),
                categoryId: Number(req.body.categoryId),
                description: req.body.description
            };

            const validate = v.validate(data, schema);

            if (validate.length > 0) {
                return res.status(400).json(
                    response(400, "error validasi", validate)
                );
            }

            const category = await Category.findByPk(data.categoryId);

            if (!category) {
                return res.status(404).json(
                    response(404, "category tidak ditemukan")
                );
            }

            if (!req.file) {
                return res.status(400).json(
                    response(400, "gambar tidak boleh kosong")
                );
            }

            const product = await Product.create({
                name: data.name,
                price: data.price,
                categoryId: data.categoryId,
                description: data.description,
                image: req.file.filename
            });

            return res.status(201).json(
                response(201, "created", product)
            );

        } catch (error) {
            return res.status(500).json(
                response(500, "server error", error.message)
            );
        }
    },

    getAllProduct: async (req, res) => {
        try {
            const products = await Product.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ["id", "name"]
                    }
                ]
            });

            return res.status(200).json(
                response(200, "success", products)
            );

        } catch (error) {
            return res.status(500).json(
                response(500, "server error", error.message)
            );
        }
    },

    getProductById: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id, {
                include: [
                    {
                        model: Category,
                        attributes: ["id", "name"]
                    }
                ]
            });

            if (!product) {
                return res.status(404).json(
                    response(404, "product tidak ditemukan")
                );
            }

            return res.status(200).json(
                response(200, "success", product)
            );

        } catch (error) {
            return res.status(500).json(
                response(500, "server error", error.message)
            );
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id);

            if (!product) {
                return res.status(404).json(response(404, "product tidak ditemukan"));
            }

            const schema = {
                name: { type: "string", min: 3 },
                price: { type: "number", positive: true },
                categoryId: { type: "number", positive: true, integer: true },
                description: { type: "string", optional: true }
            };

            const data = {
                name: req.body.name,
                price: Number(req.body.price),
                categoryId: Number(req.body.categoryId),
                description: req.body.description
            };

            const validate = v.validate(data, schema);

            if (validate.length > 0) {
                return res.status(400).json(response(400, "error validasi", validate));
            }

            const category = await Category.findByPk(data.categoryId);

            if (!category) {
                return res.status(404).json(response(404, "category tidak ditemukan"));
            }

            if (req.file) {
                data.image = req.file.filename;
            }

            await Product.update(data, {
                where: { id }
            });

            const updatedProduct = await Product.findByPk(id, {
                include: [
                    {
                        model: Category,
                        attributes: ["id", "name"]
                    }
                ]
            });

            return res.status(200).json(response(200, "updated", updatedProduct));

        } catch (error) {
            return res.status(500).json(response(500, "server error", error.message));
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id);

            if (!product) {
                return res.status(404).json(response(404, "product tidak ditemukan"));
            }

            await Product.destroy({
                where: { id }
            });

            return res.status(200).json(response(200, "deleted"));

        } catch (error) {
            return res.status(500).json(response(500, "server error", error.message));
        }
    }
};