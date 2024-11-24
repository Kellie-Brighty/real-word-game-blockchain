import React from "react";
import LetterTile from "./LetterTile";

const LetterGrid = ({ letters, setCurrentWord, currentWord }) => {
  return (
    <div className="lg:flex grid grid-cols-3 gap-2 mb-4 my-[20px]">
      {letters.map((letter, index) => (
        <LetterTile
          key={`${index}-${letter}`}
          letter={letter}
          setCurrentWord={setCurrentWord}
          letters={letters}
          currentWord={currentWord}
        />
      ))}
    </div>
  );
};

export default LetterGrid;
