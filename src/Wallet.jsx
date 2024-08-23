import React, { useState } from "react";
import { ethers } from "ethers";

function Wallet() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [balance, setBalance] = useState(null);
  const [address, setAddress] = useState(null);

  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const walletAddress = await signer.getAddress();
        setAddress(walletAddress);
        setWalletConnected(true);

        // Fetch Balance
        const balance = await signer.getBalance();
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert(
        "MetaMask is not installed. Please install MetaMask to use this feature."
      );
    }
  };

  return (
    <div className="Wallet">
      <h1>Crypto Wallet Connector</h1>
      {!walletConnected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Wallet Address: {address}</p>
          <p>Balance: {balance} ETH</p>
        </div>
      )}
    </div>
  );
}

export default Wallet;
