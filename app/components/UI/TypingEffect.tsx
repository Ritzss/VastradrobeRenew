"use client";

import { useEffect, useState } from "react";

const TypingEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    let typingInterval: NodeJS.Timeout;
    let restartTimeout: NodeJS.Timeout;

    const startTyping = () => {
      typingInterval = setInterval(() => {
        index++;
        setDisplayedText(text.slice(0, index));

        if (index === text.length) {
          clearInterval(typingInterval);

          // pause before restarting
          restartTimeout = setTimeout(() => {
            index = 0;
            setDisplayedText("");
            startTyping();
          }, 500); // pause duration
        }
      }, 60);
    };

    startTyping();

    return () => {
      clearInterval(typingInterval);
      clearTimeout(restartTimeout);
    };
  }, [text]);

  return <div>{displayedText}</div>;
};

export default TypingEffect;
