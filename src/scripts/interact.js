const { Alchemy, Network } = require('alchemy-sdk');

const API_KEY = process.env.API_KEY;
const NEXT_PUBLIC_PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;



const contract = require("../../artifacts/src/contracts/HelloWorld.sol/HelloWorld.json");


// provider - Alchemy
const settings = {
    apiKey: API_KEY,
    network: Network.ETH_SEPOLIA
}
const alchemy = new Alchemy(settings);


async function main() {
    const alchemyProvider = await alchemy.config.getProvider();
    const signer = new ethers.Wallet(NEXT_PUBLIC_PRIVATE_KEY, alchemyProvider);

    // contract instance
    const helloWorldContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    const message = await helloWorldContract.message();
    console.log("The message is: " + message); 

    console.log("Updating the message...");
    const tx = await helloWorldContract.update("this is the new message");
    await tx.wait();

    const newMessage = await helloWorldContract.message();
    console.log("The new message is: " + newMessage); 
}

main();