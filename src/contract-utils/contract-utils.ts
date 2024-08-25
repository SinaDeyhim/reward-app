const { ethers } = require("ethers");

export function getMessageHash(
  user: string,
  rewardAmount: string,
  orderId: string
) {
  return ethers.utils.solidityKeccak256(
    ["address", "uint256", "bytes32"],
    [user, rewardAmount, orderId]
  );
}

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_API_URL
);
const wallet = new ethers.Wallet(privateKey, provider);

export function signMessage(messageHash: string) {
  return wallet.signMessage(ethers.utils.arrayify(messageHash));
}
