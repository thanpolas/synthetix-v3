const { getModulesSelectors } = require('./contract-helper');
const { getRouterSource } = require('./router-helper');

class RouterSourceValidator {
  async findRepeatedModuleSelectors() {
    const moduleSelectors = await getModulesSelectors();
    const source = getRouterSource();

    const errors = [];
    moduleSelectors.forEach((moduleSelector) => {
      const regex = `(:?\\s|^)case ${moduleSelector.selector}\\s.+`;
      const matches = source.match(new RegExp(regex, 'gm'));

      if (matches && matches.length > 1) {
        if (!errors.some((value) => value.selector === moduleSelector.selector)) {
          errors.push({
            msg: `Selector case ${moduleSelector.selector} found ${matches.length} times instead of the expected single time. Matches: ${matches}`,
            repeatedInRouter: true,
            selector: moduleSelector.selector,
          });
        }
      }
    });
    return errors;
  }

  async findMissingModuleSelectors() {
    const moduleSelectors = await getModulesSelectors();
    const source = getRouterSource();

    const errors = [];
    moduleSelectors.forEach((moduleSelector) => {
      const regex = `(:?\\s|^)case ${moduleSelector.selector}\\s.+`;
      const matches = source.match(new RegExp(regex, 'gm'));

      if (!matches || matches.length < 1) {
        errors.push({
          msg: `Selector for ${moduleSelector.contractName}.${moduleSelector.name} not found in router`,
          moduleSelector,
          missingInRouter: true,
        });
      }
    });
    return errors;
  }
}

module.exports = RouterSourceValidator;
