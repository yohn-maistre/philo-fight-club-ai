
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = "Preparing the arena..." }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative mb-6">
            <div className="text-6xl mb-4 filter drop-shadow-lg">🏛️</div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
              className="h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"
            />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-serif">
            Philosophy Fight Club
          </h1>
          <p className="text-yellow-300/70 text-base sm:text-lg font-serif italic mb-8">
            The Arena Awaits
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex justify-center mb-4">
            <Spinner size="lg" color="white" />
          </div>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto"
          />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-slate-400 text-sm leading-relaxed px-4"
        >
          {message}
        </motion.p>
        
        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-6"
        >
          <div className="flex items-center justify-center gap-2 text-amber-400 text-xs">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span>Establishing voice connection...</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
