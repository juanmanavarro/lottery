const ChristmasLottery = artifacts.require("ChristmasLottery");
const { ethers } = require("ethers");

module.exports = function (deployer) {
  deployer.deploy(ChristmasLottery, ethers.utils.parseEther('0.001'));
};
