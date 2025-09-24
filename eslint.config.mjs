/* eslint-disable import/no-anonymous-default-export */
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
// import reactHooks from "eslint-plugin-react-hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.config({
    env: {
      browser: true,
      commonjs: true,
      es2021: true,
    },
    extends: ["next"],
    // plugins: {
    //   "react-hooks": reactHooks,
    // },
    rules: {
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
    parserOptions: {
      project: "./tsconfig.json",
    },
  }),
  // ...compat.config({
  //   extends: ["next"],
  //   rules: {
  //     "@typescript-eslint/no-explicit-any": "warn",
  //     "sort-imports": "warn",
  //   },
  // }),
];
