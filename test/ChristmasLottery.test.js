const ChristmasLottery = artifacts.require('ChristmasLottery');
const { assert } = require('chai');
const { ethers } = require('ethers');
const price = ethers.utils.parseEther('0.001');

contract('ChristmasLottery', accounts => {

  it('has max number and price', async () => {
    const contract = await ChristmasLottery.new(price);
    assert.equal(await contract.maxNumber(), 99999);
  });

  it('allow purchase numbers', async () => {
    const contract = await ChristmasLottery.new(price);
    const numbers = ['99998', '99999'];
    await contract.purchase(numbers, { value: price.mul(numbers.length) });

    const userNumbers = (await contract.getUserNumbers()).map(n => n.toString());
    assert.deepEqual(userNumbers, numbers);
  });

  it('not allow purchase a number if it\'s already purchased', async () => {
    const contract = await ChristmasLottery.new(price);

    const numbers = ['33333'];
    await contract.purchase(numbers, { value: price });
    let userNumbers = (await contract.getUserNumbers()).map(n => n.toString());
    assert.deepEqual(userNumbers, numbers);
    try {
      await contract.purchase(numbers, { value: price });
    } catch (error) {
      assert.ok(error instanceof Error);
    }
  });

  // TODO rewardWinner tests

});
