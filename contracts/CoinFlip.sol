// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoinFlip {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function flipCoin(bool userGuess) public payable returns (bool) {
        require(msg.value > 0, "You need to bet some ETH!");

        // Simulate coin flip (pseudo-random)
        bool coinFlipResult = (block.timestamp % 2 == 0);

        if (coinFlipResult == userGuess) {
            // User wins, send back double the bet amount
            payable(msg.sender).transfer(msg.value * 2);
            return true;
        } else {
            // User loses, owner keeps the bet amount
            payable(owner).transfer(msg.value);
            return false;
        }
    }

    // To withdraw funds from the contract (only owner can do this)
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Fallback function to receive funds
    receive() external payable {}
}