
import { useState, useEffect } from 'react';

interface TypeWriterProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export const TypeWriter = ({ text, className = '', speed = 100, delay = 0 }: TypeWriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, delay]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          |
        </span>
      )}
    </span>
  );
};
