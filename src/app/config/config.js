const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  socket_port: process.env.SOCKET_PORT || 8080,
  origin: process.env.LOCALHOST_ORIGIN || "https://www.amahanechat.org",
};
