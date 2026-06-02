const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

const Validator = require("fastest-validator");
const v = new Validator();

const { response } = require("../helpers/response.formatter");
const { auth_secret } = require("../config/base.config");

module.exports = {

    login: async (req, res) => {
        try {

            const { email, password } = req.body;

            const schema = {
                email: { type: "email" },
                password: { type: "string", min: 6 }
            };

            const validate = v.validate(
                {
                    email,
                    password
                },
                schema
            );

            if (validate.length > 0) {
                return res.status(400).json(
                    response(400, "error validasi", validate)
                );
            }

            const user = await User.findOne({
                where: {
                    email: email
                }
            });

            if (!user) {
                return res.status(400).json(
                    response(400, "user tidak ditemukan")
                );
            }

            const verified = passwordHash.verify(
                password,
                user.password
            );

            if (!verified) {
                return res.status(400).json(
                    response(400, "password salah")
                );
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: user.role
                },
                auth_secret,
                {
                    expiresIn: "1h"
                }
            );

            const data = {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token: token
            };

            return res.status(200).json(
                response(200, "loggedin", data)
            );

        } catch (error) {

            return res.status(500).json(
                response(500, "server error", error.message)
            );

        }
    }

};