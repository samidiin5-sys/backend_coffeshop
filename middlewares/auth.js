const jwt = require("jsonwebtoken");

const { response } = require("../helpers/response.formatter");
const { auth_secret } = require("../config/base.config");

module.exports = {

    verifyToken: async (req, res, next) => {

        let token = req.header("Authorization");

        if (!token) {
            return res.status(401).json(
                response(401, "Unauthorized")
            );
        }

        try {

            if (token.startsWith("Bearer ")) {
                token = token.slice(7);
            }

            const decoded = jwt.verify(
                token,
                auth_secret
            );

            req.user = decoded;

            next();

        } catch (error) {

            return res.status(401).json(
                response(401, "Unauthorized")
            );

        }

    }

};