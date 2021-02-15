module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  // testRegex: "./test/.*\\.spec\\.tsx$",
  rootDir: ".",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
