const assert = require('assert/strict');
const { readPackageJson } = require('../../utils/npm');

describe('utils/npm.js', function () {
  it('can retrieve the package.json of the project', function () {
    const pkg = readPackageJson();

    assert(pkg.name, '@synthetixio/core-js');
  });
});
