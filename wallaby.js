module.exports = function(wallaby) {
  const path = require('path');
  const vesselPath = path.join(wallaby.localProjectDir, 'packages', 'vessel');
  const nodeModulesPath = path.join(vesselPath, 'node_modules');
  const reactScriptsPath = path.join(nodeModulesPath, 'react-scripts');
  const reactScriptsNodeModulesPath = path.join(reactScriptsPath, 'node_modules');

  // const setupTestsPath = path.join(vesselPath, 'src', 'setupTests');
  // const jestConfigPath = path.join(reactScriptsPath, 'scripts', 'utils', 'createJestConfig');

  process.env.BABEL_ENV = 'test';
  process.env.NODE_ENV = 'test';
  // process.env.NODE_PATH += path.delimiter + path.join(__dirname, 'node_modules') + path.delimiter + path.join(__dirname, 'node_modules/react-scripts/node_modules');
  process.env.NODE_PATH += path.delimiter + nodeModulesPath + path.delimiter + reactScriptsNodeModulesPath;
  require('module').Module._initPaths();

  return {
    files: [
      // { pattern: 'src/setupTests.ts', instrument: false },
      'packages/**/src/*.+(ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
      '!packages/**/node_modules/**',
      '!packages/**/*.test.ts*'
    ],
    tests: [
      'packages/**/*.test.ts*',
      '!packages/**/node_modules/**'
    ],

    env: {
      type: 'node',
      runner: 'node'
    },

    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({
        module: 'esnext',
        jsx: 'React'
      })
    },

    debug: true,

    /*preprocessors: {
      '**!/!*.js?(x)': file =>
        require('@babel/core').transform(file.content, {
          sourceMap: true,
          compact: false,
          filename: file.path,
          presets: [require('babel-preset-jest'), 'react-app']
        })
    },*/

    preprocessors: {
      '**/*.js?(x)': file =>
        require(path.join(nodeModulesPath, '@babel/core')).transform(file.content, {
          sourceMap: true,
          compact: false,
          filename: file.path,
          presets: [
            require(path.join(nodeModulesPath, 'babel-preset-jest')),
            require(path.join(nodeModulesPath, 'babel-preset-react-app')),
            // 'react-app'
          ]
        })
    },

    testFramework: {
      type: 'jest',
      path: path.join(nodeModulesPath, 'jest', 'node_modules', 'jest-cli')
    },

    // postprocessor: null,

    setup: wallaby => {
      const path = require('path');
      const vesselPath = path.join(wallaby.localProjectDir, 'packages', 'vessel');
      // const setupTestsPath = path.join(vesselPath, 'src', 'setupTests');
      const nodeModulesPath = path.join(vesselPath, 'node_modules');
      const reactScriptsPath = path.join(nodeModulesPath, 'react-scripts');
      const jestConfigPath = path.join(reactScriptsPath, 'scripts', 'utils', 'createJestConfig');

      // 'react-scripts/scripts/utils/createJestConfig'

      const jestConfig = require(jestConfigPath)(p => require.resolve(path.join(reactScriptsPath, p)));
      Object.keys(jestConfig.transform || {}).forEach(k => ~k.indexOf('^.+\\.(js|jsx') && void delete jestConfig.transform[k]);
      delete jestConfig.testEnvironment;
      wallaby.testFramework.configure(jestConfig);
    },

  };
};