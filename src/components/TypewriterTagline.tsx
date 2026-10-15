import React, { useState, useEffect } from 'react';

interface TypewriterTaglineProps {
  text?: string;
  className?: string;
}

export const TypewriterTagline: React.FC<TypewriterTaglineProps> = ({
  text = 'Building the Future, One Line of Code at a Time.',
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(55);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayedText(text);
      return;
    }

    let timer: NodeJS.Timeout;

    const handleTyping = () => {
      const fullText = text;

      if (!isDeleting) {
        // Typing forward
        setDisplayedText(fullText.substring(0, displayedText.length + 1));

        // Natural pause after punctuation (commas, periods)
        const lastChar = fullText.charAt(displayedText.length);
        if (lastChar === ',' || lastChar === '.') {
          setTypingSpeed(320);
        } else {
          setTypingSpeed(Math.floor(Math.random() * 25) + 45); // 45-70ms
        }

        // When complete, wait before deleting
        if (displayedText === fullText) {
          timer = setTimeout(() => {
            setIsDeleting(true);
            setTypingSpeed(35);
          }, 2400); // Display full sentence briefly
          return;
        }
      } else {
        // Deleting backward
        setDisplayedText(fullText.substring(0, displayedText.length - 1));
        setTypingSpeed(25);

        // When fully deleted, restart typing loop
        if (displayedText === '') {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
          setTypingSpeed(500); // Short pause before next cycle
        }
      }
    };

    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, loopNum, text, typingSpeed]);

  return (
    <span className={`inline-block text-white font-bold leading-snug tracking-tight ${className}`}>
      <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
        {displayedText}
      </span>
      <span className="inline-block w-2.5 h-6 sm:h-7 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-pulse ml-1 align-middle" />
    </span>
  );
};
