module.exports = function(wallaby) {
  var path = require('path');
  process.env.BABEL_ENV = 'test';
  process.env.NODE_ENV = 'test';
  process.env.NODE_PATH += path.delimiter + path.join(__dirname, 'node_modules') + path.delimiter + path.join(__dirname, 'node_modules/react-scripts/node_modules');
  require('module').Module._initPaths();

  const vesselPath = path.join(wallaby.localProjectDir, 'packages', 'vessel');
  const vesselNodeModulesPath = path.join(vesselPath, 'node_modules');
  const vesselTsconfig = require(path.join(vesselPath, 'tsconfig')).compilerOptions;
  delete vesselTsconfig.isolatedModules;
  delete vesselTsconfig.noEmit;

  return {
    files: [
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
      '**/*.ts?(x)': wallaby.compilers.typeScript(vesselTsconfig)
    },

    preprocessors: {
      '**/*.js?(x)': file =>
        require(path.join(vesselNodeModulesPath, '@babel/core')).transform(file.content, {
          sourceMap: true,
          compact: false,
          filename: file.path,
          presets: [
            require(path.join(vesselNodeModulesPath, 'babel-preset-jest')),
            require(path.join(vesselNodeModulesPath, 'babel-preset-react-app')),
          ]
        })
    },

    setup: wallaby => {
      const jestConfig = require('react-scripts/scripts/utils/createJestConfig')(p => require.resolve('react-scripts/' + p));
      Object.keys(jestConfig.transform || {}).forEach(k => ~k.indexOf('^.+\\.(js|jsx') && void delete jestConfig.transform[k]);
      delete jestConfig.testEnvironment;
      wallaby.testFramework.configure(jestConfig);
    },

    testFramework: 'jest'
  };
};
