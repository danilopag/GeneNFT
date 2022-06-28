const hre = require("hardhat");

async function main() {
  const GeneNFT = await hre.ethers.getContractFactory("GeneNFT");
  const genenft = await GeneNFT.deploy();

  await genenft.deployed(); //Attesa della pubblicazione

  console.log("GeneNFT deployed to:", genenft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
