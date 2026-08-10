require('dotenv').config()

module.exports ={
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME_DEVELOPMENT,
    "port": process.env.DB_PORT || 3308,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME_PRODUCTION,
    "host": process.env.DB_HOST || "127.0.0.1",
    "port": process.env.DB_PORT || 3306,
    "dialect": process.env.DB_DIALECT || "mysql",
    "dialectOptions": process.env.DB_SSL === "true" || (process.env.DB_HOST && process.env.DB_HOST.includes("aiven")) ? {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    } : {}
  }
}
