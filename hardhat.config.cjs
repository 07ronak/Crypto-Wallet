require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`, //your Infura Project ID
      accounts: [`0x${process.env.PRIVATE_KEY}`], //your wallet private key
    },
  },
};
