
import { useState, useEffect, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

// Types for Vapi integration
interface VapiMessage {
  type: string;
  transcript?: {
    transcript: string;
    speaker: string;
  };
  role?: string;
  content?: string;
}

interface VapiSquadMemberConfig {
  assistantId: string;
  // Add other squad member specific configurations if needed
  // e.g., name?: string, tools?: any[];
}

interface VapiSquadConfig {
  name: string;
  members: VapiSquadMemberConfig[];
  // Add other squad level configurations if needed
  // e.g., firstMessage?: string;
}

interface UseVapiOptions {
  assistantId?: string; // For single assistant calls
  squadId?: string; // For pre-configured squads on Vapi dashboard
  squadConfig?: VapiSquadConfig; // For transient, dynamically configured squads
  onMessage?: (message: VapiMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onVolumeLevel?: (volume: number) => void;
}

export const useVapi = (options: UseVapiOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  // TODO: Add your Vapi Public Key here
  // const publicKey = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!); // Replace with your actual public key
  // Corrected for Vite:
  const vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;

  const connect = useCallback(async (callConfig: { assistantId?: string; squadId?: string, squadConfig?: VapiSquadConfig }) => {
    const { assistantId, squadId, squadConfig } = callConfig;
    if (isConnected || isLoading) return;
  
    // Check if public key is configured
    // Check if public key is configured
    if (!vapiPublicKey || vapiPublicKey === "YOUR_VAPI_PUBLIC_KEY" || vapiPublicKey === undefined) {
      const errorMsg = "Vapi Public Key not configured. Please add your key to .env and ensure it's named VITE_VAPI_PUBLIC_KEY";
      setError(errorMsg);
      options.onError?.(new Error(errorMsg));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // const vapi = new Vapi(publicKey); // Original
      // Corrected initialization:
      const vapi = new Vapi(vapiPublicKey!);
      
      // Set up event listeners
      vapi.on('speech-start', () => {
        console.log('Speech started');
        setIsSpeaking(true);
        options.onSpeechStart?.();
      });

      vapi.on('speech-end', () => {
        console.log('Speech ended');
        setIsSpeaking(false);
        options.onSpeechEnd?.();
      });

      vapi.on('call-start', () => {
        console.log('Call started');
        setIsConnected(true);
        setIsLoading(false);
        options.onConnect?.();
      });

      vapi.on('call-end', () => {
        console.log('Call ended');
        setIsConnected(false);
        setIsSpeaking(false);
        setVapiInstance(null);
        setVolumeLevel(0);
        options.onDisconnect?.();
      });

      vapi.on('volume-level', (volume) => {
        setVolumeLevel(volume);
        options.onVolumeLevel?.(volume);
      });

      vapi.on('message', (message) => {
        console.log('Received message:', message);
        
        // Handle transcript messages
        if (message.type === 'transcript' && message.transcript) {
          options.onMessage?.({
            type: 'transcript',
            transcript: {
              transcript: message.transcript.transcript,
              speaker: message.transcript.speaker
            }
          });
        }
        
        // Handle other message types
        options.onMessage?.(message);
      });

      vapi.on('error', (error) => {
        console.error('Vapi error:', error);
        setError(error.message || 'An error occurred');
        setIsLoading(false);
        setIsConnected(false);
        setIsSpeaking(false);
        options.onError?.(error);
      });

      // Start the call with either an assistantId, squadId, or a squad configuration
      if (assistantId) {
        await vapi.start(assistantId);
      } else if (squadId) {
        await vapi.start({ squad: squadConfig });
      } else {
        const errorMsg = "No assistantId, squadId, or squadConfig provided to connect.";
        setError(errorMsg);
        options.onError?.(new Error(errorMsg));
        setIsLoading(false);
        return;
      }
      setVapiInstance(vapi);

    } catch (err) {
      console.error('Failed to connect to Vapi:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to Vapi');
      setIsLoading(false);
      setIsConnected(false);
      setIsSpeaking(false);
      options.onError?.(err);
    }
  }, [isConnected, isLoading, options, vapiPublicKey]);

  // Ensure options always has a default value if not provided by the consumer
  const defaultOptions: Partial<UseVapiOptions> = {};
  const currentOptions = { ...defaultOptions, ...options };

  const disconnect = useCallback(async () => {
    if (!isConnected || !vapiInstance) return;

    try {
      await vapiInstance.stop();
      setIsConnected(false);
      setIsSpeaking(false);
      setVapiInstance(null);
      setVolumeLevel(0);
      options.onDisconnect?.();
    } catch (err) {
      console.error('Failed to disconnect from Vapi:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect from Vapi');
      options.onError?.(err);
    }
  }, [isConnected, vapiInstance, options]);

  const sendMessage = useCallback((message: string) => {
    if (!isConnected || !vapiInstance) {
      console.warn('Vapi not connected. Cannot send message:', message);
      return;
    }

    try {
      vapiInstance.send({
        type: 'add-message',
        message: {
          role: 'user',
          content: message
        }
      });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }, [isConnected, vapiInstance]);

  const mute = useCallback(() => {
    if (!isConnected || !vapiInstance) return;
    
    try {
      vapiInstance.setMuted(true);
    } catch (err) {
      console.error('Failed to mute:', err);
    }
  }, [isConnected, vapiInstance]);

  const unmute = useCallback(() => {
    if (!isConnected || !vapiInstance) return;
    
    try {
      vapiInstance.setMuted(false);
    } catch (err) {
      console.error('Failed to unmute:', err);
    }
  }, [isConnected, vapiInstance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected && vapiInstance) {
        vapiInstance.stop();
      }
    };
  }, [isConnected, vapiInstance]);

  return {
    isConnected,
    isLoading,
    error,
    isSpeaking,
    volumeLevel,
    connect,
    disconnect,
    sendMessage,
    mute,
    unmute
  };
};
