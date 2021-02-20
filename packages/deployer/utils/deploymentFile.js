const fs = require('fs');
const path = require('path');

let _hre;

function readDeploymentFile({ hre }) {
  _hre = hre;

  _createDeploymentFileIfNeeded();

  const data = JSON.parse(fs.readFileSync(_getDeploymentFilePath()));
  _patchDeploymentData({ data });

  return data;
}

function saveDeploymentFile({ data, hre }) {
  _hre = hre;

  fs.writeFileSync(_getDeploymentFilePath(), JSON.stringify(data, null, 2));
}

function _patchDeploymentData({ data }) {
  if (!data.modules) {
    data.modules = {};
  }
}

function _getDeploymentFilePath() {
  return path.join(_getDeploymentsDirectoryPath(), `${_hre.network.name}.json`);
}

function _getDeploymentsDirectoryPath() {
  return _hre.config.deployer.paths.deployments;
}

function _createDeploymentFileIfNeeded() {
  const directoryPath = _hre.config.deployer.paths.deployments;

  if (!fs.existsSync(_getDeploymentsDirectoryPath())) {
    fs.mkdirSync(directoryPath);
  }

  const filePath = _getDeploymentFilePath();
  if (!fs.existsSync(filePath)) {
    fs.appendFileSync(filePath, '{}');
  }
}

module.exports = {
  readDeploymentFile,
  saveDeploymentFile,
};
