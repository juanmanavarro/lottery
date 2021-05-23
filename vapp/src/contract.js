import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
// eslint-disable-next-line
const address = process.env.VUE_APP_CONTRACT_ADDRESS;
const daiAbi = [
  "function maxNumber() view returns (uint)",
  "function getTotalBalance() public view returns (uint)",
  "function purchase(uint[] memory _numbers) public payable",
  "function getUserNumbers() public view returns (uint[] memory)",
];
const signer = provider.getSigner();

export default new ethers.Contract(address, daiAbi, signer);
