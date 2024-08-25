// Load the Hardhat environment
const { Alchemy, Network } = require('alchemy-sdk');


const API_KEY = process.env.API_KEY;
const NEXT_PUBLIC_PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BASE_SEPOLIA

const contract = require("../../artifacts/src/contracts/RewardsRedemption.sol/RewardRedemption.json");
const settings = {
    apiKey: API_KEY,
    network: Network.BASE_SEPOLIA
}
const alchemy = new Alchemy(settings);

async function main() {
    const alchemyProvider = await alchemy.config.getProvider();
    const signer = new ethers.Wallet(NEXT_PUBLIC_PRIVATE_KEY, alchemyProvider);
    const rewardsContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    const amount = hre.ethers.utils.parseEther("0.05");

    console.log(`Funding contract at ${CONTRACT_ADDRESS} with 0.05 ETH...`);

    try {
        const tx = await rewardsContract.deposit({
            value: amount,
            gasLimit: ethers.utils.hexlify(3000000)
        });
        await tx.wait();

        console.log(`Contract funded using deposit()! Transaction hash: ${tx.hash}`);
    } catch (error) {
        console.error("Failed to fund contract using deposit():", error);
    }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
