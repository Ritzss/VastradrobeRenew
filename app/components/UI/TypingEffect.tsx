"use client";

import { useEffect, useState } from "react";

const TypingEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      index++;

      setDisplayedText(text.slice(0, index));
      console.log(text.slice(0, index));
      

      if (index === text.length) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [text]);

  return <div>{displayedText}</div>;
};

export default TypingEffect;
