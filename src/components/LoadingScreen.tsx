
import { motion } from "framer-motion";
import { Dots_v4 } from "@/components/ui/spinner";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = "Preparing the arena..." }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-6xl mb-4">🏛️</div>
          <h1 className="text-3xl font-bold text-yellow-200 mb-2 font-serif">
            Philosophy Fight Club
          </h1>
          <p className="text-yellow-300/80 text-lg font-serif italic">
            The Arena Awaits
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <div className="text-yellow-400 scale-150">
            <Dots_v4 />
          </div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-slate-400 text-sm"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
};
