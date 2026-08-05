import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

/**
 * Frontend Modern Flat ESLint Configuration
 * Coordinates standard JS practices, TypeScript rules, and React framework hooks validation.
 */
export default defineConfig([
  // Global Exclusion Pattern: Prevents ESLint from parsing or flagging code inside the build output folder
  globalIgnores(["dist"]),

  {
    // Targeted Scope: Apply these rules configuration sets exclusively to client TypeScript and TSX source files
    files: ["**/*.{ts,tsx}"],

    // Core Ruleset Extensions
    extends: [
      js.configs.recommended, // Base recommended configurations for modern JavaScript syntax
      tseslint.configs.recommended, // Standard static type analysis validation guidelines for TypeScript
      reactHooks.configs.flat.recommended, // Enforces valid runtime behavior setups across React custom hooks
      reactRefresh.configs.vite, // Validates that files adhere to safe patterns for Vite hot reloading
    ],

    // Environment Runtime Setup
    languageOptions: {
      // Exposes browser-native keyword variables (like window, localStorage) so they pass check validations
      globals: globals.browser,
    },
  },
]);
