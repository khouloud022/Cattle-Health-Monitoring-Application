const AutoSimulated = artifacts.require("AutoSimulated");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(AutoSimulated, { from: accounts[1] });
};
