

async function main() {
    const RewardRedemption = await ethers.getContractFactory("RewardRedemption");

    // Start deployment, returning a promise that resolves to a contract object
    const reward_contract = await RewardRedemption.deploy();

    console.log("Contract deployed to address:", reward_contract.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });

