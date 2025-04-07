// https://docs.expo.dev/guides/using-eslint/

module.exports = {
  root: true,

  ignorePatterns: [
    "/dist/*",
    "/app-example/*",
    "expo-env.d.ts",
    ".eslintrc.js",
  ],

  env: {
    es6: true,
    node: true,
  },

  plugins: ["@typescript-eslint", "prettier"],

  parser: "@typescript-eslint/parser",

  extends: [
    "expo",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],

  rules: {
    // === general
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],

    // === typescript
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",

    // === eslint-plugin-import (from eslint-config-expo)
    "import/no-unresolved": "warn",
  },
};
