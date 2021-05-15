import Lottery from './contracts/ChristmasLottery.json';

const options = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:7545'
    }
  },
  contracts: [Lottery],
  // events: {
  //   TestCrowdsale: ['TokensPurchased']
  // },
  polls: {
    accounts: 15000
  }
}

export default options
