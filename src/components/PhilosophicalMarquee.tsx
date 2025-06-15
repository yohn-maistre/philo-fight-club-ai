
import { useEffect, useState } from 'react';

const quotes = [
  { text: "The unexamined life is not worth living", author: "Socrates" },
  { text: "What does not destroy me makes me stronger", author: "Nietzsche" },
  { text: "I think, therefore I am", author: "Descartes" },
  { text: "All knowledge begins with experience", author: "Kant" },
  { text: "Reason is slave to the passions", author: "Hume" },
  { text: "God is dead, and we killed him", author: "Nietzsche" },
  { text: "All things are determined by necessity", author: "Spinoza" },
  { text: "The only true wisdom is knowing you know nothing", author: "Socrates" }
];

export const PhilosophicalMarquee = () => {
  const [currentQuotes, setCurrentQuotes] = useState(quotes);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuotes(prev => [...prev.slice(1), prev[0]]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 overflow-hidden z-10">
      <div className="relative h-16 flex items-center">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {currentQuotes.concat(currentQuotes).map((quote, index) => (
            <div key={index} className="flex items-center mx-8 text-slate-300">
              <span className="text-yellow-400 mr-2">💭</span>
              <span className="italic">"{quote.text}"</span>
              <span className="text-slate-500 ml-2">— {quote.author}</span>
              <span className="text-slate-600 mx-4">•</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none"></div>
    </div>
  );
};
