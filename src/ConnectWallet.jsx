import React, { useState } from "react";

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];
        setAccount(account);
        console.log(account);

        const balanceResult = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });

        const wei = parseInt(balanceResult, 16);
        const balance = wei / 10 ** 18;
        setBalance(balance.toFixed(6));

        /* console.log(balance); */
      } catch (error) {
        console.error("Error connecting to Metamask:", error);
      }
    } else {
      console.error("Metamask not detected");
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
