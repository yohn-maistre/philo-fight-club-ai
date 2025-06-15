
import { useEffect, useState } from 'react';

interface FloatingElement {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const philosophyEmojis = ['💭', '💡', '⚡', '🎯', '🧠', '🏛️', '📚', '🗿', '⚖️'];

export const FloatingElements = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const generateElements = () => {
      const newElements: FloatingElement[] = [];
      for (let i = 0; i < 15; i++) {
        newElements.push({
          id: i,
          emoji: philosophyEmojis[Math.floor(Math.random() * philosophyEmojis.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 15,
          duration: Math.random() * 10 + 8,
          delay: Math.random() * 5
        });
      }
      setElements(newElements);
    };

    generateElements();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute opacity-20 animate-float-gentle"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            fontSize: `${element.size}px`,
            animationDuration: `${element.duration}s`,
            animationDelay: `${element.delay}s`
          }}
        >
          {element.emoji}
        </div>
      ))}
      
      {/* Golden particle dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-yellow-400/30 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 2 + 2}s`
          }}
        />
      ))}
    </div>
  );
};
