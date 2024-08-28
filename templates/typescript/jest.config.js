const isProduction = process.env.TEST_ENV === 'prod';
let source = isProduction ? ['dist', 'js'] : ['src', 'ts'];

console.info(
  `Testing files in /${source[0]} directory. [${isProduction ? 'Production' : 'Develop'} mode]\n`,
);

module.exports = {
  displayName: 'ts-package',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],

  moduleNameMapper: {
    '^ts-package$': `<rootDir>/${source[0]}/index.${source[1]}`,
    '^ts-package/(.*)$': `<rootDir>/${source[0]}/$1`,
  },
  collectCoverage: true,
  coverageReporters: ['text', 'cobertura'],
};
