const ChristmasLottery = artifacts.require("ChristmasLottery");

module.exports = function (deployer) {
  deployer.deploy(ChristmasLottery, 10);
};
