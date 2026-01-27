import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginImport from "eslint-plugin-import";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],

      // Отступы между выражениями
      "padding-line-between-statements": [
        "error",
        // Пустая строка перед return
        { blankLine: "always", prev: "*", next: "return" },
        // Пустая строка между импортами и остальным кодом
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
        // Пустая строка после блока объявлений переменных (const/let/var)
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        // Но без пустой строки между последовательными объявлениями
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        // Пустая строка между блоком объявлений и компонентами/классами
        {
          blankLine: "always",
          prev: ["const", "let", "var"],
          next: ["function", "class"],
        },
        // Пустая строка между экспортированными константами и компонентами
        { blankLine: "always", prev: "export", next: "function" },
        // Но не требуем отступ между несколькими export подряд
        { blankLine: "any", prev: "export", next: "export" },
      ],

      // Группировка и отступы между импортами
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // node, стандартные модули
            "external", // пакеты из node_modules
            "internal", // алиасы вида @/...
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", ".husky/**"]),
]);
