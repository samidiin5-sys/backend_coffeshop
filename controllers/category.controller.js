const Validator = require("fastest-validator");
const v = new Validator();

const { Category } = require("../models");
const { response } = require("../helpers/response.formatter");

module.exports = {

    createCategory: async (req, res) => {
        try {

            if (!req.body || !req.body.name) {
                return res.status(400).json(
                    response(400, "name tidak boleh kosong")
                );
            }

            const schema = {
                name: { type: "string", min: 3 }
            };

            const data = {
                name: req.body.name
            };

            const validate = v.validate(data, schema);

            if (validate.length > 0) {
                return res.status(400).json(
                    response(400, "error validasi", validate)
                );
            }

            const category = await Category.create(data);

            return res.status(201).json(
                response(201, "created", category)
            );

        } catch (error) {
            return res.status(500).json(
                response(500, "server error", error.message)
            );
        }
    },

    getAllCategory: async (req, res) => {
        try {

            const categories = await Category.findAll();

            return res.status(200).json(response(200, "success", categories));

        } catch (error) {
            return res.status(500).json(response(500, "server error", error.message));
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json(response(404, "not found"));
            }

            return res.status(200).json(response(200, "success", category));

        } catch (error) {
            return res.status(500).json(response(500, "server error", error.message));
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json(
                    response(404, "not found")
                );
            }

            if (!req.body || !req.body.name) {
                return res.status(400).json(
                    response(400, "name tidak boleh kosong")
                );
            }

            const data = {
                name: req.body.name
            };

            await Category.update(data, {
                where: { id }
            });

            const updated = await Category.findByPk(id);

            return res.status(200).json(
                response(200, "updated", updated)
            );

        } catch (error) {
            return res.status(500).json(
                response(500, "server error", error.message)
            );
        }
    },
    deleteCategory: async (req, res) => {
        try {

            const { id } = req.params;

            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json(response(404, "not found"));
            }

            await Category.destroy({
                where: { id }
            });

            return res.status(200).json(response(200, "deleted"));

        } catch (error) {
            return res.status(500).json(response(500, "server error", error.message));
        }
    }

};