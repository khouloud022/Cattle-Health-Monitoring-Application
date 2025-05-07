const Government = artifacts.require("Government");
const DroneOperator = artifacts.require("DroneOperator");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Government);
  const governmentInstance = await Government.deployed();
  await deployer.deploy(DroneOperator, governmentInstance.address);
  // await web3.eth.sendTransaction({
  //   from: accounts[0],
  //   to: DroneOperator.address,
  //   value: web3.utils.toWei("0.5", "ether"),
  // });
};
