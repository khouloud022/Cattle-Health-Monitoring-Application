const LivestockManager= artifacts.require("LivestockManager");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(LivestockManager, { from: accounts[2] });
};
