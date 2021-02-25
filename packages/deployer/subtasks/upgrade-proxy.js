const logger = require('../utils/logger');
const prompter = require('../utils/prompter');
const { subtask } = require('hardhat/config');
const { SUBTASK_UPGRADE_PROXY, SUBTASK_DEPLOY_CONTRACTS } = require('../task-names');

const UPGRADE_ABI = [
  {
    inputs: [],
    name: 'getImplementation',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

/*
 * Checks if the main proxy needs to be deployed,
 * and upgrades it if needed.
 * */
subtask(SUBTASK_UPGRADE_PROXY).setAction(async ({ force }, hre) => {
  logger.subtitle('Upgrading main proxy');

  const data = hre.deployer.data;

  const implementationAddress = data[`Router_${hre.network.name}`].deployedAddress;
  logger.info(`Target implementation: ${implementationAddress}`);

  await _deployProxy({ implementationAddress, force });

  // TODO: For some very strange reason, hre within _upgradeProxy is undefined.
  // This only seems to happen if _deployProxy was called first!
  // Hardhat seems to loose hre from the global context as soon as
  // a third depth level of subtasks is reached.
  // The workaround is to pass hre which is still maintained in the scope of
  // the subtask.
  await _upgradeProxy({ implementationAddress, hre });
});

async function _deployProxy({ implementationAddress, force }) {
  await hre.run(SUBTASK_DEPLOY_CONTRACTS, {
    contractNames: [hre.config.deployer.proxyName],
    force,
    constructorArgs: [[implementationAddress]],
  });
}

async function _upgradeProxy({ implementationAddress, hre }) {
  const data = hre.deployer.data;
  const proxyAddress = data[hre.config.deployer.proxyName].deployedAddress;

  const upgradeable = await hre.ethers.getContractAt(UPGRADE_ABI, proxyAddress);
  const activeImplementationAddress = await upgradeable.getImplementation();
  logger.info(`Active implementation: ${activeImplementationAddress}`);

  if (activeImplementationAddress !== implementationAddress) {
    logger.notice(
      `Proxy upgrade needed - Main proxy implementation ${activeImplementationAddress} is different from the target implementation`
    );

    await prompter.confirmAction('Upgrade system');

    logger.notice(`Upgrading main proxy to ${implementationAddress}`);

    const tx = await upgradeable.upgradeTo(implementationAddress);
    await tx.wait();

    logger.success(`Main proxy upgraded to ${await upgradeable.getImplementation()}`);
  } else {
    logger.checked('No need to upgrade the main proxy');
  }
}
