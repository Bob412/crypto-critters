const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment of CryptoCritters...");

  // Deploy the contract
  const CryptoCritters = await ethers.getContractFactory("CryptoCritters");
  const cryptoCritters = await CryptoCritters.deploy();

  // Wait for deployment to complete
  await cryptoCritters.deployTransaction.wait();

  console.log(`CryptoCritters deployed to: ${cryptoCritters.address}`);

  // Verify contract on Etherscan if not on a local network
  const network = await ethers.provider.getNetwork();
  if (
    network.name !== "unknown" &&
    network.chainId !== 1337 &&
    network.chainId !== 31337
  ) {
    console.log("Waiting for 6 confirmations before verification...");
    await cryptoCritters.deployTransaction.wait(6);

    console.log("Verifying contract on Etherscan...");
    try {
      await run("verify:verify", {
        address: cryptoCritters.address,
        constructorArguments: [],
      });
      console.log("Contract verification successful");
    } catch (error) {
      console.log("Contract verification failed:", error);
    }
  }

  return cryptoCritters;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
