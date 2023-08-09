module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    'test/^.+\\.tsx?$': 'ts-jest',
  },
};