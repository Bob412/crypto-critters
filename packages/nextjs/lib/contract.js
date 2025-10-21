import { ethers } from "ethers";
import CryptoCritters from "../artifacts/contracts/CryptoCritters.sol/CryptoCritters.json";

// Contract addresses for different networks
const CONTRACT_ADDRESSES = {
  // Local development
  1337: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Default hardhat first address
  // Sepolia testnet - to be updated after deployment
  11155111: "",
  // Ethereum mainnet - to be updated after deployment
  1: "",
};

/**
 * Get the deployed contract instance
 */
export function getContractInstance(provider, chainId) {
  const address = CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[1337];

  if (!address) {
    throw new Error(`Contract not deployed on chain ID ${chainId}`);
  }

  return new ethers.Contract(address, CryptoCritters.abi, provider);
}

/**
 * Get the contract's mint price in ETH
 */
export async function getMintPrice(provider, chainId) {
  const contract = getContractInstance(provider, chainId);
  const priceWei = await contract.MINT_PRICE();
  return ethers.utils.formatEther(priceWei);
}

/**
 * Mint a new NFT
 */
export async function mintNFT(signer, chainId) {
  const contract = getContractInstance(signer, chainId);
  const mintPrice = await contract.MINT_PRICE();

  const tx = await contract.mint({ value: mintPrice });
  return tx.wait();
}

/**
 * Get the total supply of NFTs
 */
export async function getTotalSupply(provider, chainId) {
  const contract = getContractInstance(provider, chainId);
  const totalSupply = await contract.totalSupply();
  return totalSupply.toNumber();
}

/**
 * Get the token URI for a specific token ID
 */
export async function getTokenURI(provider, chainId, tokenId) {
  const contract = getContractInstance(provider, chainId);
  return await contract.tokenURI(tokenId);
}

/**
 * Parse the token URI data
 */
export function parseTokenURI(tokenURI) {
  // Remove the data:application/json;base64, prefix
  const base64Data = tokenURI.replace("data:application/json;base64,", "");

  // Decode the Base64 data
  const jsonString = Buffer.from(base64Data, "base64").toString();

  // Parse the JSON data
  const metadata = JSON.parse(jsonString);

  return metadata;
}

/**
 * Update contract addresses after deployment
 */
export function updateContractAddress(chainId, address) {
  if (chainId && address) {
    CONTRACT_ADDRESSES[chainId] = address;
    console.log(`Updated contract address for chain ${chainId}: ${address}`);
    return true;
  }
  return false;
}
