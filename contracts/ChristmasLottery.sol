// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ChristmasLottery {
    uint32 public maxNumber;
    uint public price;

    mapping(address => uint[]) public userNumbers;
    mapping(uint => bool) purchasedNumbers;

    constructor(uint _price) {
        maxNumber = 99999;
        price = _price;
    }

    event NumbersPurchased(address purchaser, uint[] numbers);
    event WinnerRewarded(address winner, uint number, uint prize);

    function purchase(uint[] memory _numbers) public payable {
        require(_numbers.length >= 1, 'At least one number, cabron!');
        require(msg.value == _numbers.length * price, 'Numbers have to be paid!');

        for (uint256 index = 0; index < _numbers.length; index++) {
            uint _number = _numbers[index];

            require(_number <= maxNumber, 'Number out of bounds!');
            require(!purchasedNumbers[_number], 'Number is not available!');

            userNumbers[msg.sender].push(_number);
            purchasedNumbers[_number] = true;
        }

        emit NumbersPurchased(msg.sender, _numbers);
    }

    function getTotalBalance() public view returns (uint) {
        return address(this).balance;
    }
}
