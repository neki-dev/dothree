const path = require('path');
const tsconfig = require('../tsconfig.json');

const paths = Object.entries(tsconfig.compilerOptions.paths);

function transformPaths(modificators) {
  return paths.reduce((curr, [from, [to]]) => {
    const mFrom = modificators.alias(from);
    const mTo = modificators.path(to);
    return { ...curr, [mFrom]: mTo };
  }, {});
}

module.exports = {
  forWebpack() {
    return transformPaths({
      alias: (value) => value.replace('/*', ''),
      path: (value) => path.resolve(__dirname, '..', value.replace('*', '')),
    });
  },

  forJest() {
    return transformPaths({
      alias: (value) => value.replace('/*', '/(.*)$'),
      path: (value) => value.replace('./', '<rootDir>/').replace('/*', '/$1'),
    });
  },
};
