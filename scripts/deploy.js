async function main() {
  // Get the contract to deploy
  const CoinFlip = await ethers.getContractFactory("CoinFlip");

  // Deploy the contract
  const coinFlip = await CoinFlip.deploy();

  // Wait for the deployment to complete
  await coinFlip.waitForDeployment();

  // Log the contract address
  console.log("CoinFlip contract deployed to:", await coinFlip.getAddress());
}

// Execute the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
