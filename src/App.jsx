import "./App.css";
import ConnectWallet from "./ConnectWallet";

function App() {
  return (
    <div className="App">
      <h1>Ethereum Wallet Connection</h1>
      <img src="/mm.png" width={100} alt="" />
      <br />
      <ConnectWallet />
    </div>
  );
}

export default App;
