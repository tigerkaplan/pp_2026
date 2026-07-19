import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });
export default createJestConfig({
  coverageProvider: "v8",
  coverageReporters: ["text", "html"],
  collectCoverageFrom: ["components/**/*.{ts,tsx}", "app/providers.tsx", "!components/seo/**"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
});
