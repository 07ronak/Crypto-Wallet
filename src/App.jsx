import "./App.css";
import ConnectWallet from "./ConnectWallet";

function App() {
  return (
    <div className="App">
      <h1>Ethereum Coin Game</h1>
      <img src="/mm.png" width={100} alt="metamask wolf" />
      <br />
      <ConnectWallet />
    </div>
  );
}

export default App;
