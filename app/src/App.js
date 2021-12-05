import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);
  /**
   * Checking if Solana wallet is connected
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet has been found!');

          /**
           * Function allows us to connect to the user's wallet
           */
          const response = await solana.connect({ onlyIfTrusted: true});
          console.log('Connected with Public Key:', response.publicKey.toString());

          /**
           * User's public key is stored at this stage
           */
          setWalletAddress(response.publicKey.toString());
        } 
      }
      else {
        alert('Solana object not found! Get a Phantom Wallet');
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  /**
   * Connecting wallet method
   */
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  /**
   * Rendering UI when user hasn't connected Wallet
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  /**
   * useEffect uses checkIfWalletIsConnected
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🐈 Toots NFT Drop</p>
          <p className="sub-text">NFT drop for the legendary cat: Toots</p>
          {/* connect wallet button is rendered here. Only shows if nothing has been connected */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        {/* Checking for walletAddress and pass into walletAddress */}
        {walletAddress && <CandyMachine walletAddress={window.solana} />}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
