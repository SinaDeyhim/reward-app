// SPDX-License-Identifier: MIT
pragma solidity >=0.7.3;

contract RewardRedemption {
    // Address of the contract owner
    address public owner;

    // Mapping to keep track of redeemed orders
    mapping(bytes32 => bool) public redeemedOrders;

    // Event to notify when a user claims a reward
    event RewardClaimed(address indexed user, uint256 amount, bytes32 orderId);

    // Modifier to restrict functions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // Modifier to check if the contract has enough balance for rewards
    modifier hasBalance(uint256 amount) {
        require(address(this).balance >= amount, "Contract has insufficient balance");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to claim rewards by providing a valid order
    function claimReward(uint256 rewardAmount, bytes32 orderId, bytes memory signature) external hasBalance(rewardAmount) {
        require(!redeemedOrders[orderId], "Order already redeemed");
        require(verifyOrder(msg.sender, rewardAmount, orderId, signature), "Invalid order or signature");

        // Mark order as redeemed
        redeemedOrders[orderId] = true;

        // Send reward to user
        (bool sent, ) = msg.sender.call{value: rewardAmount}("");
        require(sent, "Failed to send reward");

        emit RewardClaimed(msg.sender, rewardAmount, orderId);
    }

    // Function to verify the order (simple implementation, consider a more robust solution)
    function verifyOrder(address user, uint256 rewardAmount, bytes32 orderId, bytes memory signature) internal view returns (bool) {
        bytes32 messageHash = getMessageHash(user, rewardAmount, orderId);
        return recoverSigner(messageHash, signature) == owner;
    }

    // Helper function to get the message hash
    function getMessageHash(address user, uint256 rewardAmount, bytes32 orderId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(user, rewardAmount, orderId));
    }

    // Helper function to recover the signer from the message hash and signature
    function recoverSigner(bytes32 messageHash, bytes memory signature) public pure returns (address) {
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    // Helper function to get Ethereum signed message hash
    function getEthSignedMessageHash(bytes32 messageHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
    }

    // Helper function to split the signature into r, s, and v components
    function splitSignature(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    // Function to deposit ETH into the contract
    function deposit() external payable {}

    // Function to withdraw ETH from the contract (only owner)
    function withdraw(uint256 amount) external onlyOwner {
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    // Function to get contract balance
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
