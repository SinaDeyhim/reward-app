/** @type import('hardhat/config').HardhatUserConfig */


require('dotenv').config({ path: __dirname + '/.env' })

require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require('hardhat-deploy');

const {NEXT_PUBLIC_API_URL, NEXT_PUBLIC_PRIVATE_KEY, ETHERSCAN_API_KEY, BASESCAN_API_KEY} = process.env

module.exports = {
  solidity: "0.8.24",
  paths: {
    sources: "./src/contracts",
    tests: "./src/test", 
    cache: "./cache",
    artifacts: "./artifacts"
  },
  defaultNetwork:'base-sepolia',
  networks:{
    hardhat:{},
    sepolia: {
      url: NEXT_PUBLIC_API_URL,
      accounts:[`0x${NEXT_PUBLIC_PRIVATE_KEY}`]
    },
    'base-sepolia': {
      url: 'https://sepolia.base.org',
      accounts:[`0x${NEXT_PUBLIC_PRIVATE_KEY}`],
      gasPrice: 1000000000,
    },

  },
  etherscan: {
    apiKey: BASESCAN_API_KEY
  },

};
