
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { useState, useEffect } from "react";

interface LoadingScreenProps {
  message?: string;
  isError?: boolean;
}

export const LoadingScreen = ({ 
  message = "Preparing the philosophical arena...", 
  isError = false 
}: LoadingScreenProps) => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    if (isError) {
      // Collect debugging information
      const info: string[] = [];
      
      // Check environment variables
      const vapiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
      if (!vapiKey) {
        info.push("❌ VITE_VAPI_PUBLIC_KEY not found");
      } else if (vapiKey === "YOUR_VAPI_PUBLIC_KEY") {
        info.push("❌ VITE_VAPI_PUBLIC_KEY is placeholder value");
      } else {
        info.push(`✅ VITE_VAPI_PUBLIC_KEY configured (${vapiKey.substring(0, 10)}...)`);
      }
      
      // Check browser capabilities
      if (!navigator.mediaDevices) {
        info.push("❌ MediaDevices API not available");
      } else {
        info.push("✅ MediaDevices API available");
      }
      
      // Check WebSocket support
      if (!window.WebSocket) {
        info.push("❌ WebSocket not supported");
      } else {
        info.push("✅ WebSocket supported");
      }
      
      // Check HTTPS (required for microphone access)
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        info.push("❌ HTTPS required for microphone access");
      } else {
        info.push("✅ Secure connection");
      }
      
      setDebugInfo(info);
    }
  }, [isError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
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
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-4">
              <div className="text-3xl mb-3">⚠️</div>
              <h3 className="text-red-300 font-medium mb-3 text-lg">Connection Error</h3>
              <p className="text-red-400 text-sm mb-4">{message}</p>
              
              {debugInfo.length > 0 && (
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600/30">
                  <h4 className="text-slate-300 font-medium mb-3 text-sm">Debug Information:</h4>
                  <div className="space-y-2 text-xs text-left">
                    {debugInfo.map((info, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-slate-500 mt-0.5">•</span>
                        <span className="text-slate-400">{info}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="text-blue-300 font-medium mb-2 text-sm">Setup Instructions:</h4>
                <ul className="text-xs text-left text-blue-400 space-y-1">
                  <li>1. Add your Vapi public key to Vercel environment variables</li>
                  <li>2. Ensure HTTPS is enabled (required for microphone access)</li>
                  <li>3. Grant microphone permissions when prompted</li>
                  <li>4. Check browser console for additional error details</li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4">{message}</p>
              
              {/* Connection Status */}
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
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
