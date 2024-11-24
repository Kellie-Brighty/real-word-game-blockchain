import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram, PublicKey } from "@solana/web3.js";

const DropZone = ({
  currentWord,
  setScore,
  onWordValidated,
  setCurrentWord,
}) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "LETTER",
    drop: () => {},
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const { publicKey, wallet, sendTransaction, connecting, connected } =
    useWallet();

  const validateWord = async () => {
    const word = currentWord.join("");
    if (!publicKey) {
      alert("Connect a wallet first!");
      return;
    } else if (word.length < 3) {
      alert(`Invalid word: ${word}, cannot be less than three (3) letters`);
      return;
    } else {
      try {
        // Get balance in lamports
        setLoading(true);
        const lamports = await connection.getBalance(publicKey);
        const solBalance = lamports / 1e9;

        // console.log("public key:::", publicKey);
        // console.log("balance:::", solBalance);
        if (solBalance < 0.01) {
          alert(
            "Your balance is too low to play the game. Please add more SOL."
          );
          setLoading(false);
        } else {
          const recipient = "CmiHqB5hMRKxMKzqyCDvNRfcC5Z3PzHXbtJuk5Pm4jaj";
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: new PublicKey(recipient),
              lamports: 100000, // Deduct 0.0001 SOL
            })
          );
          const signature = await sendTransaction(transaction, connection);
          // console.log(`Transaction Signature: ${signature}`);

          if (signature) {
            try {
              const response = await fetch(
                `https://wordsapiv1.p.rapidapi.com/words/${word}`,
                {
                  method: "GET",
                  headers: {
                    "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                    "x-rapidapi-key":
                      "6435ab2eb8msh071d81b2435c086p1e3a93jsn64a3f441c104",
                  },
                }
              );
              const data = await response.json();
              const isValid = data.word !== undefined;
              if (isValid) {
                setScore((prev) => prev + word.length * 10); // Add points for valid words
                alert(`Valid word: ${word}`);
                onWordValidated(currentWord);
              } else {
                alert(`Invalid word: ${word}`);
              }
            } catch (error) {
              console.error("Error validating word:", error);
              alert("Error validating word. Please try again.");
            } finally {
              setLoading(false);
            }
          } else {
            alert(
              "Unknown reason for: Failed to sign transaction for this game session."
            );
            return;
          }
        }
      } catch (err) {
        alert(`Failed to fetch balance: ${err.message}`);
        setLoading(false);
      }
    }
  };

  const clearCurrentWord = () => {
    setCurrentWord([]); // Assuming setCurrentWord is passed as a prop
  };

  return (
    <div
      ref={dropRef}
      className={`border-2 p-4 min-h-[100px] flex items-center justify-center ${
        isOver ? "bg-green-100" : "bg-gray-50"
      }`}
      style={{
        border: "2px dashed #fff",
        padding: "20px",
        minHeight: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "10px",
        transition: "background-color 0.3s",
      }}
    >
      <div>
        <div className="current-word-container">
          {" "}
          {/* {{ edit_1 }} */}
          {currentWord.map((word, index) => (
            <span key={index} className="word-background">
              {" "}
              {/* {{ edit_2 }} */}
              {word}
            </span>
          ))}
        </div>
        <button
          onClick={validateWord}
          className="ml-4 btn text-white font-[700]"
          disabled={loading}
        >
          {loading ? "Validating..." : "Validate Word"}
        </button>
        <button
          onClick={clearCurrentWord}
          className="ml-4 btn text-white font-[700]"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default DropZone;
