import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom", // For React testing, jsdom simulates a browser environment
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Use ts-jest to transpile TypeScript files
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Optional: set up global configurations
  testPathIgnorePatterns: ["/node_modules/", "/.next/"], // Exclude Next.js build folders
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // Configure path aliases if needed (for Next.js or custom setups)
  },
  globals: {
    "ts-jest": {
      isolatedModules: true, // Enable isolated module compilation for faster tests
    },
  },
};

export default config;
