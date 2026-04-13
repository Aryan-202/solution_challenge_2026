"use client";

import { ethers } from "ethers";
import contractABI from "./SportShieldABI.json";

// The address you got from Remix earlier
const CONTRACT_ADDRESS = "0x2Bd52Fb48a44ae17bBC29B28074de3CbB3326BeC";

/**
 * Helper to get the contract instance
 */
async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install it to use SportShield.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
}

/**
 * PERSON C -> PERSON A Integration:
 * Registers a new media fingerprint on the blockchain.
 */
export async function registerOnChain(fingerprint) {
  try {
    const contract = await getContract();
    
    // This triggers the MetaMask popup
    const tx = await contract.registerAsset(fingerprint);
    
    // Wait for the block to be mined (1 block confirmation)
    const receipt = await tx.wait();
    
    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error("Blockchain Registration Failed:", error);
    if (error.code === "ACTION_REJECTED") {
      throw new Error("User denied the transaction.");
    }
    throw error;
  }
}

/**
 * PERSON C -> PERSON A Integration:
 * Verifies if a fingerprint already exists and who owns it.
 */
export async function verifyOnChain(fingerprint) {
  try {
    const contract = await getContract();
    
    // This is a free 'view' call (no MetaMask popup needed)
    const [fp, owner, timestamp] = await contract.getAsset(fingerprint);
    
    return {
      found: true,
      owner: owner,
      timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
    };
  } catch (error) {
    // If the contract reverts with "Asset not found"
    if (error.message.includes("Asset not found")) {
      return { found: false };
    }
    throw error;
  }
}

/**
 * New Feature: Get User History
 * Fetches all fingerprints registered by the current user.
 */
export async function getUserHistory(walletAddress) {
  try {
    const contract = await getContract();
    const history = await contract.getUserHistory(walletAddress);
    return history;
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return [];
  }
}