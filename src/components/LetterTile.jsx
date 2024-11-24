import React, { useEffect } from "react";
import { useDrag } from "react-dnd";

const LetterTile = ({ letter, setCurrentWord, letters, currentWord }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "LETTER",
    item: { letter },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        setCurrentWord((prev) => [...prev, item.letter]);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleTouchStart = (e) => {
    e.preventDefault();
    // Add the letter to the current word on tap
    setCurrentWord((prev) => [...prev, letter]);
  };

  return (
    <div
      ref={dragRef}
      onTouchStart={handleTouchStart}
      className="letter-tile text-[18px] lg:text-[40px]"
      style={{
        backgroundSize: "cover",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "5px",
        borderRadius: "10px",
        transition: "transform 0.2s",
        cursor: "pointer",
      }}
    >
      {letter}
    </div>
  );
};

export default LetterTile;
