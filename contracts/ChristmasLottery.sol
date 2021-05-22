// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ChristmasLottery {
    uint32 public maxNumber;
    uint public price;

    mapping(uint => address payable) public userNumbers;

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
            require(userNumbers[_number] == address(0x0), 'Number is not available!');

            userNumbers[_number] = payable(msg.sender);
        }

        emit NumbersPurchased(msg.sender, _numbers);
    }

    function rewardWinner(uint _number) public {
        address payable winner = userNumbers[_number];
        uint totalBalance = address(this).balance;
        uint comission = totalBalance / 10;
        uint prize = totalBalance - comission;

        winner.transfer(prize);

        emit WinnerRewarded(winner, _number, prize);
    }

    function getTotalBalance() public view returns (uint) {
        return address(this).balance;
    }
}
