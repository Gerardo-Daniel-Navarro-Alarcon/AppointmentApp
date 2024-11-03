const { getDefaultConfig } = require("expo/metro-config");
require("dotenv").config();

module.exports = (() => {
    const config = getDefaultConfig(__dirname);
    return config;
})();
