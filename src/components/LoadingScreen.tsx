
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";

interface LoadingScreenProps {
  message?: string;
  isError?: boolean;
}

export const LoadingScreen = ({ 
  message = "Preparing the arena...", 
  isError = false 
}: LoadingScreenProps) => {
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
        
        {!isError && (
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
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="h-1 w-60 bg-gradient-to-r from-yellow-400/30 via-yellow-600 to-yellow-400/30 rounded-full mx-auto"
            />
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className={`${isError ? 'text-red-400' : 'text-slate-400'} text-sm leading-relaxed px-4`}
        >
          {isError ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
              <div className="text-2xl mb-2">⚠️</div>
              <p className="text-red-300 font-medium mb-2">Connection Error</p>
              <p className="text-red-400 text-xs">{message}</p>
            </div>
          ) : (
            <p>{message}</p>
          )}
        </motion.div>
        
        {/* Connection Status */}
        {!isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-6"
          >
            <div className="flex items-center justify-center gap-2 text-amber-400 text-xs">
              <motion.div 
                className="w-2 h-2 bg-amber-400 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span>Establishing voice connection...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
