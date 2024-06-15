import js from "@eslint/js";
import userscripts from "eslint-plugin-userscripts";
import globals from "globals";

userscripts.configs.recommended.plugins = { userscripts: userscripts };

export default [
  {
    ignores: ["node_modules"],
  },
  js.configs.recommended,
  {
    files: ["**/*.user.js"],
    ...userscripts.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.greasemonkey,
        ...globals.es2021,
        ...globals.jquery,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      ...userscripts.configs.recommended.rules,
      indent: ["error", 2, { SwitchCase: 1 }],
      "linebreak-style": ["error", "unix"],
      semi: ["error", "always"],
      curly: "warn",
      "dot-location": ["error", "property"],
      eqeqeq: "warn",
      "no-else-return": "warn",
      "no-eval": "error",
      "no-octal": "error",
      "no-with": "error",
      radix: "error",
      "brace-style": ["warn", "1tbs"],
      camelcase: "error",
      "no-array-constructor": "error",
      "arrow-spacing": "error",
      "no-var": "error",
      "no-unused-vars": "warn",
      "userscripts/compat-grant": "warn",
      "userscripts/compat-headers": "warn",
    },
  },
];
