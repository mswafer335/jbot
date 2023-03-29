/** @type {import('ts-jest').JestConfigWithTsJest} */

SECONDS = 1000;
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    detectOpenHandles: true,
    testTimeout: 60 * SECONDS * 10,
};
