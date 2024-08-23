import React, { useState } from "react";
import "./CoinFlipGame.css";

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [selectedSide, setSelectedSide] = useState("heads");
  const [riskAmount, setRiskAmount] = useState("");
  const [result, setResult] = useState("");

  const connectMetamask = async () => {
    // Check if Metamask is installed in the browser
    if (window.ethereum) {
      try {
        // Request access to the user's Ethereum accounts
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setAccount(account);
        /*  console.log(account); */

        // Fetch the balance of the connected account
        const balanceResult = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"], //"latest" second paramter to make sure the api retrieved the balance from the lastest block of blockchain
        });

        //The returned balance is in hex.

        const wei = parseInt(balanceResult, 16); // convert 'hex' to 'decimal number'

        const balance = wei / 10 ** 18; //Convert wei to ETH

        setBalance(balance);

        /* console.log(balance); */
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

  const flipCoin = () => {
    if (!account || /* !riskAmount || */ !selectedSide) return;
    if (!riskAmount)
      return alert("Enter the Betting Amount before Flipping the coin");

    try {
      // Simulate a coin flip (randomly choose "heads" or "tails")
      const coinFlipResult = Math.random() < 0.5 ? "heads" : "tails";
      // Determine win or loss
      if (coinFlipResult === selectedSide) {
        const winAmount = riskAmount * 2;
        const totalAmount = winAmount + balance;
        setBalance(totalAmount);
        setResult(`Congratulations! You won ${winAmount}ETH.`);
      } else {
        const totalAmount = balance - riskAmount;
        setBalance(totalAmount);
        setResult(`Sorry, you lost ${riskAmount}. Better luck next time!`);
      }
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
              min="0.01"
              step="0.01"
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
