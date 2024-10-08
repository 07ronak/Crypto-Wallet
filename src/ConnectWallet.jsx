import React, { useState } from "react";
import "./CoinFlipGame.css";
import { ethers } from "ethers";
import abi from "./CoinFlipABI.json";
import { useEffect } from "react";

const contractAddress = "0x3350F79e4488166eEc3cc4f1ed70762E1E277B77";
const contractABI = abi;

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [selectedSide, setSelectedSide] = useState("heads");
  const [riskAmount, setRiskAmount] = useState("");
  const [result, setResult] = useState("");
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      /* const provider = new ethers.JsonRpcProvider(url) */
      const setupContract = async () => {
        const signer = await provider.getSigner();
        const coinFlipContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(coinFlipContract);
      };
      setupContract();
    }
  }, []);

  const connectMetamask = async () => {
    // Check if Metamask is installed in the browser
    if (window.ethereum) {
      try {
        // Ensure the user is on a testnet (Sepolia)
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (chainId !== "0xaa36a7") {
          alert("Please switch to Sepholia testnet in Metamask!");
          return;
        }

        // Request access to the user's Ethereum accounts
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setAccount(account);

        // Fetch the balance of the connected account
        const balanceResult = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"], //"latest" second paramter to make sure the api retrieved the balance from the lastest block of blockchain
        });

        //The returned balance is in hex.
        const wei = parseInt(balanceResult, 16); // convert 'hex' to 'decimal number'

        const balance = wei / 10 ** 18; //Convert wei to ETH

        setBalance(balance);
      } catch (error) {
        console.error("Error connecting to Metamask:", error);
        alert("Error connecting to Metamask: " + error.message);
      }
    } else {
      console.error("Metamask not detected");
      alert(
        "Metamask not detected. Please install Metamask to use this feature."
      );
    }
  };

  const flipCoin = async () => {
    if (!account || /* !riskAmount || */ !selectedSide) return;
    if (!riskAmount)
      return alert("Enter the Betting Amount before Flipping the coin");

    // Ensure the risk amount is less than or equal to the wallet balance
    if (parseFloat(riskAmount) > balance) {
      return alert(
        "Insufficient balance in wallet to place this bet.\n\n\n *You may comment out this block of code to test implementation*"
      );
    }

    try {
      const transaction = await contract.flipCoin(selectedSide === "heads", {
        value: ethers.parseEther(riskAmount),
      });

      setResult("Transaction sent. Waiting for confirmation...");

      await transaction.wait();

      const isWin = await transaction.events[0].args[0];
      if (isWin) {
        const winAmount = riskAmount * 2;
        const totalAmount = winAmount + balance;
        setBalance(totalAmount);
        setResult(`Congratulations! You won ${riskAmount * 2} ETH.`);
      } else {
        setBalance(balance);
        setResult(`Sorry, you lost. Better luck next time!`);
      }

      // Display transaction link
      console.log(`Transaction Hash: ${transaction.hash}`);

      /* // Simulate a coin flip (randomly choose "heads" or "tails")
      const coinFlipResult = Math.random() < 0.5 ? "heads" : "tails";
      // Determine win or loss
      if (coinFlipResult === selectedSide) {
        setResult(`Congratulations! You won ${winAmount}ETH.`);
        await sendTransaction(riskAmount * 2); //Send Double the tokens back
      } else {
        setResult(`Sorry, you lost. Better luck next time!`);
        return;
        const totalAmount = balance - riskAmount;
        setBalance(totalAmount);
        setResult(`Sorry, you lost ${riskAmount}ETH. Better luck next time!`);
      } */
    } catch (error) {
      console.error("Error during coin flip:", error);
      alert("Error during coin flip: " + error.message);
    }
  };

  return (
    <>
      <button onClick={connectMetamask}>
        {account ? `Connected: ${account}` : "Connect"}
      </button>
      <br />
      <br />
      {account && balance !== null && (
        <div>
          <h3>
            <b>Balance: </b> <span id="balance">{balance} ETH</span>
          </h3>
          <br />
          <label>
            Select side:
            <select
              className="select-side"
              onChange={(e) => setSelectedSide(e.target.value)}
              value={selectedSide}
            >
              <option value="heads">Heads</option>
              <option value="tails">Tails</option>
            </select>
          </label>
          <br />
          <br />
          <label>
            Risk Amount (ETH):
            <input
              className="risk-amount"
              type="number"
              min="0.0001"
              step="0.0001"
              value={riskAmount}
              onChange={(e) => setRiskAmount(e.target.value)}
            />
          </label>
          <br />
          <br />
          <button onClick={flipCoin}>Flip Coin</button>
          {result && <p>{result}</p>}
        </div>
      )}
    </>
  );
};

export default ConnectWallet;

/* const sendTransaction = async (amountInEth) => {
  if (!account) return;

  const amountInWei = (amountInEth * 10 ** 18).toString(16); // Convert ETH to Wei
  try {
    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: account,
          to: account, // Replace with your contract address
          value: amountInWei,
        },
      ],
    });
    alert("Transaction sent successfully.");
  } catch (error) {
    console.error("Transaction failed:", error);
    alert("Transaction failed: " + error.message);
  }
}; */
