/** @typedef {import('prettier').Config} PrettierConfig */ // <reference types="prettier" /> e renowned as PrettierConfig

/** @type { PrettierConfig } */ // <reference types="prettier" /> defining the Prettier configuration
// This configuration file is used to set up Prettier formatting options for the project.
// It specifies the formatting rules that Prettier will apply to the codebase.
const config = {
  plugins: ['prettier-plugin-tailwindcss'], // Array of plugins to be used by Prettier. Can include custom or community plugins.
  printWidth: 80, // Specifies the line length that Prettier will wrap on.
  tabWidth: 2, // Sets the number of spaces per indentation level.
  useTabs: false, // Indent lines with spaces instead of tabs.
  semi: false, // Do not add semicolons at the end of statements.
  singleQuote: true, // Use single quotes instead of double quotes for strings.
  quoteProps: 'as-needed', // Only add quotes around object properties when required.
  jsxSingleQuote: false, // Use double quotes in JSX attributes.
  trailingComma: 'es5', // Add trailing commas where valid in ES5 (objects, arrays, etc.).
  bracketSpacing: true, // Print spaces between brackets in object literals.
  arrowParens: 'always', // Always include parentheses around arrow function parameters.
  endOfLine: 'auto', // Maintain existing line endings (useful for cross-platform compatibility).
  bracketSameLine: false, // Put the closing bracket of JSX elements on a new
}

export default config