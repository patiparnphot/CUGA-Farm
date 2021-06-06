// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import './CUGAToken.sol';

contract CUGAFarm {
    string public name = "CUGA Token Farm";
    address public owner;
    string private password = "iamnotgonnatellu";
    CUGAToken public cugaToken;

    address[] public stakers;
    uint256 public totalStake = 0;
    mapping(address => uint) public waitingReward;
    mapping(address => bool) public hasStaked;

    mapping(address => uint) public withdrawAllowance;

    constructor(
        CUGAToken _cugaToken
    ) public {
        cugaToken = _cugaToken;
        owner = msg.sender;
    }

    function stakeTokens() public payable {
        // Require amount greater than 0
        require(msg.value > 0, "amount cannot be 0");

        // Update staking balance
        totalStake = totalStake + msg.value;

        // Update waiting reward
        waitingReward[msg.sender] = waitingReward[msg.sender] + 3*msg.value;

        // Add user to stakers array *only* if they haven't staked already
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Update staking status
        hasStaked[msg.sender] = true;
    }

    function setPassword(string memory _key) public {
        // Only owner can call this function
        require(msg.sender == owner, "caller must be the owner");

        // Set password
        password = _key;
    }

    function setWithdrawAllowance(string memory _key, address _withdrawer, uint _amount) public {
        // Owner can't call this function
        require(msg.sender != owner, "caller must not be the owner");

        // Require caller can't be withdrawer
        require(_withdrawer != msg.sender, "caller must not be withdrawer");
        
        // Require know password
        require(keccak256(abi.encode(password)) == keccak256(abi.encode(_key)), "wrong password");

        // Set withdraw allowance
        withdrawAllowance[_withdrawer] = _amount;
    }

    // Unstaking Tokens (Withdraw)
    function withdrawTokens() public {
        // Fetch withdraw allowance
        uint balance = withdrawAllowance[msg.sender];

        // Require amount greater than 0
        require(balance > 0, "withdraw amount cannot be 0");

        // Require amount less than total stake
        require(balance < totalStake, "withdraw amount must be less than total stake");

        // Set address of sender
        address payable spender = msg.sender;

        // Transfer eth from this contract to this account
        spender.transfer(balance);

        // Reset staking balance
        totalStake = totalStake - balance;

        // Update withdraw authority
        withdrawAllowance[msg.sender] = 0;
    }

    // Issuing Tokens
    function issueTokens() public {
        // Only owner can call this function
        require(msg.sender == owner, "caller must be the owner");

        // Issue tokens to all stakers
        for (uint i=0; i<stakers.length; i++) {
            // Choose recipient address
            address recipient = stakers[i];

            // Fetch waiting reward
            uint reward = waitingReward[recipient];

            // Check remain waiting reward
            if(reward > 0) {
                // Issue token as a reward
                cugaToken.transfer(recipient, reward);

                // Reset waiting reward
                waitingReward[recipient] = 0;
            }
        }
    }
}