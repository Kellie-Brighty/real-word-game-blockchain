import React, { useEffect, useState, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";
import LetterGrid from "./components/LetterGrid";
import DropZone from "./components/DropZone";
import Background from "./assets/game-bg.png";
import Logo from "./assets/logo.png";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  UnsafeBurnerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

const App = () => {
  const [letters, setLetters] = useState(generateRandomLetters(7));
  const [currentWord, setCurrentWord] = useState([]);
  const [score, setScore] = useState(0);

  const shuffleLetters = () =>
    setLetters([...letters.sort(() => Math.random() - 0.5)]);

  const resetGame = () => {
    setLetters(generateRandomLetters(7));
    setCurrentWord([]);
    setScore(0);
  };

  const onWordValidated = (validatedLetters) => {
    // Remove validated letters from the letter grid
    setLetters((prevLetters) =>
      prevLetters.filter((letter) => !validatedLetters.includes(letter))
    );
    setCurrentWord([]); // Clear the current word after validation
  };

  useEffect(() => {
    // console.log(letters);
  }, [letters]);

  const network = WalletAdapterNetwork.Devnet;
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new UnsafeBurnerWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <DndProvider backend={HTML5Backend}>
            <div
              className=""
              style={{
                backgroundImage: `url(${Background})`,
                backgroundSize: "cover",
              }}
            >
              <div className="min-h-screen bg-[#000000a9] flex flex-col items-center p-4">
                <header
                  className={`flex items-center justify-between w-full p-[10px]`}
                >
                  {/* <h1 className="text-2xl font-bold mb-4">Word Game</h1> */}
                  <img src={Logo} alt="" className={`w-[100px] logo-flip`} />
                  <div className={`flex items-center space-x-[20px]`}>
                    <div className="score-container space-x-[10px]">
                      <img src={Logo} alt="" className={`w-[40px] logo-flip`} />
                      <p className="score-text">+{score}</p>
                    </div>
                    <WalletMultiButton />
                  </div>
                </header>
                <div className="mb-4 lg:flex items-center px-[20px]">
                  <button
                    onClick={shuffleLetters}
                    className="btn text-white font-[700]"
                  >
                    Shuffle
                  </button>
                  <button
                    onClick={resetGame}
                    className="btn text-white font-[700]"
                  >
                    Reset
                  </button>
                </div>
                <LetterGrid
                  letters={letters}
                  setCurrentWord={setCurrentWord}
                  currentWord={currentWord}
                />
                <DropZone
                  currentWord={currentWord}
                  setScore={setScore}
                  onWordValidated={onWordValidated}
                  setCurrentWord={setCurrentWord}
                  letters={letters}
                />
              </div>
            </div>
          </DndProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// Helper function to generate random letters
const generateRandomLetters = (count) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from(
    { length: count },
    () => alphabet[Math.floor(Math.random() * 26)]
  );
};

export default App;
