import React, { useState } from "react";

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

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

        setBalance(balance.toFixed(6));

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

  return (
    <>
      <button onClick={connectMetamask}>Connect</button>
      <br />
      <br />
      <br />
      {account && balance !== null && (
        <div>
          <p>
            <b>Account</b>: {account}
          </p>
          <p>
            <b>Balance: </b> {balance} ETH
          </p>
        </div>
      )}
    </>
  );
};

export default ConnectWallet;
