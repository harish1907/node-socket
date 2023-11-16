require("dotenv").config();

module.exports = {
  database: process.env.DB_CONNECT,
  port: process.env.PORT,
};
