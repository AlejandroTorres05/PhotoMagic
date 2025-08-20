// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  //prettier
  {
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
    extends: [require("eslint-config-prettier")],
    rules: {
      "prettier/prettier": "error",
    },
  },
]);
