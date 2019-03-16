// https://github.com/ArtemGovorov/lerna-wallaby-react-typescript/tree/patch-1
const path = require('path');

module.exports = wallaby => {
  process.env.NODE_PATH += path.delimiter + path.join(wallaby.projectCacheDir, 'packages');
  return {
    files: ['packages/**/*.+(ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)', '!packages/**/node_modules/**', '!packages/**/*.test.ts*'],
    tests: ['packages/**/*.test.ts*', '!packages/**/node_modules/**'],
    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({ module: 'commonjs', jsx: 'React' }),
    },
    env: {
      type: 'node',
      runner: 'node',
    },
    testFramework: {
      type: 'jest',
      path: path.join(wallaby.localProjectDir, 'packages', 'vessel', 'node_modules', 'jest', 'node_modules', 'jest-cli')
    },
    setup: wallaby => {
      const path = require('path');
      const vesselPath = path.join(wallaby.localProjectDir, 'packages', 'vessel');
      // const setupTestsPath = path.join(vesselPath, 'src', 'setupTests');
      const nodeModulesPath = path.join(vesselPath, 'node_modules');
      const reactScriptsPath = path.join(nodeModulesPath, 'react-scripts');
      const jestConfigPath = path.join(reactScriptsPath, 'scripts', 'utils', 'createJestConfig');

      const jestConfig = require(jestConfigPath)(p => require.resolve(path.join(reactScriptsPath, p)));
      Object.keys(jestConfig.transform || {}).forEach(k => ~k.indexOf('^.+\\.(js|jsx') && void delete jestConfig.transform[k]);
      delete jestConfig.testEnvironment;
      // jestConfig.setupTestFrameworkScriptFile = setupTestsPath;
      jestConfig.modulePaths = [nodeModulesPath];
      wallaby.testFramework.configure(jestConfig)
    },
  }
};