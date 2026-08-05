import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

/**
 * Backend Node-TypeScript ESLint Configuration
 * Combines strict type-aware rule analysis with code stylistic consistency checks.
 */
export default tseslint.config({
  // Target Scope: Apply these rules exclusively to standard backend TypeScript files
  files: ["**/*.ts"],

  // Extension Sets
  extends: [
    eslint.configs.recommended, // Baseline JavaScript syntax checking guidelines
    ...tseslint.configs.recommendedTypeChecked, // Deep, type-aware rules that leverage the compiler to catch logic flaws
  ],

  // Advanced Compiler Context Options
  languageOptions: {
    parserOptions: {
      // Enables type-aware linting dynamically without manually listing every sub-project path
      projectService: true,
      // Points ESLint directly to the root directory location containing the target tsconfig files
      tsconfigRootDir: import.meta.dirname,
    },
  },

  // Visual Code Formatting Plugin Injection
  plugins: {
    "@stylistic": stylistic,
  },

  // Custom Validation Override Rules Ruleset
  rules: {
    // Formatting: Mandate clean semicolons everywhere; breaks build on missing terminations
    "@stylistic/semi": "error",

    // Type Safety: Flags an error if a variable is assigned a value typed as an implicit 'any'
    "@typescript-eslint/no-unsafe-assignment": "error",

    // Type Safety: Strictly block developer declarations from declaring or falling back to 'any' signatures
    "@typescript-eslint/no-explicit-any": "error",

    // Flexibility: Suppress mandatory explicit return signatures for lightweight internal functions
    "@typescript-eslint/explicit-function-return-type": "off",

    // Flexibility: Permit implicit module export boundaries to speed up early prototyping workflows
    "@typescript-eslint/explicit-module-boundary-types": "off",

    // Flexibility: Turn off restrictions regarding printing diverse composite items inside template literals
    "@typescript-eslint/restrict-template-expressions": "off",

    // Flexibility: Allow standard addition operators to process variable values without explicit parsing
    "@typescript-eslint/restrict-plus-operands": "off",

    // Optimization: Enforces writing 'import type { X }' explicitly when importing interfaces to speed up bundling
    "@typescript-eslint/consistent-type-imports": "error",

    // Code Hygiene: Flag errors on dead variables, but permit arguments explicitly prefix-masked with underscores
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
});
