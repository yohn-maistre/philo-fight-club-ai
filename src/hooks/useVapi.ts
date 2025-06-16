import { useState, useEffect, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { SquadAssistantConfig } from '@/config/squadConfigs';

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

interface VapiSquadConfig {
  name: string;
  members: SquadAssistantConfig[];
}

interface UseVapiOptions {
  assistantId?: string;
  squadId?: string;
  squadConfig?: VapiSquadConfig;
  onMessage?: (message: VapiMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onVolumeLevel?: (volume: number) => void;
  onTransfer?: (assistantName: string) => void;
}

export const useVapi = (options: UseVapiOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasTriedConnection, setHasTriedConnection] = useState(false);
  const [currentAssistant, setCurrentAssistant] = useState<SquadAssistantConfig | null>(null);

  const vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;

  const connect = useCallback(async (assistantConfig: SquadAssistantConfig) => {
    if (isConnected || isLoading || hasTriedConnection) return;

    if (!vapiPublicKey || vapiPublicKey === "YOUR_VAPI_PUBLIC_KEY" || vapiPublicKey === undefined) {
      const errorMsg = "Vapi Public Key not configured. Please add your key to Vercel environment variables as VITE_VAPI_PUBLIC_KEY";
      setError(errorMsg);
      setHasTriedConnection(true);
      options.onError?.(new Error(errorMsg));
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasTriedConnection(true);

    try {
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
        
        if (message.type === 'transcript' && message.transcript) {
          // Check for transfer phrase in transcript
          const content = message.transcript.transcript;
          const transferMatch = content.match(/trigger the transferCall tool with '([^']+)' Assistant/i);
          if (transferMatch && options.onTransfer) {
            const assistantName = transferMatch[1];
            options.onTransfer(assistantName);
          }
          options.onMessage?.({
            type: 'transcript',
            transcript: {
              transcript: message.transcript.transcript,
              speaker: message.transcript.speaker
            }
          });
        }
        
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

      // Start the call with the correct Vapi SDK format
      if (assistantConfig) {
        await vapi.start(assistantConfig);
        setCurrentAssistant(assistantConfig);
      } else {
        const errorMsg = "No assistant config provided to connect.";
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
  }, [isConnected, isLoading, hasTriedConnection, options, vapiPublicKey]);

  const disconnect = useCallback(async () => {
    if (!isConnected || !vapiInstance) return;

    try {
      await vapiInstance.stop();
      setIsConnected(false);
      setIsSpeaking(false);
      setVapiInstance(null);
      setVolumeLevel(0);
      setIsMuted(false);
      setHasTriedConnection(false);
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
      setIsMuted(true);
    } catch (err) {
      console.error('Failed to mute:', err);
    }
  }, [isConnected, vapiInstance]);

  const unmute = useCallback(() => {
    if (!isConnected || !vapiInstance) return;
    
    try {
      vapiInstance.setMuted(false);
      setIsMuted(false);
    } catch (err) {
      console.error('Failed to unmute:', err);
    }
  }, [isConnected, vapiInstance]);

  // Switch to a new assistant (stop current, start new)
  const switchAssistant = useCallback(async (assistantConfig: SquadAssistantConfig) => {
    if (vapiInstance) {
      await vapiInstance.stop();
    }
    setIsConnected(false);
    setIsSpeaking(false);
    setVapiInstance(null);
    setVolumeLevel(0);
    setIsMuted(false);
    setHasTriedConnection(false);
    setCurrentAssistant(null);
    setTimeout(() => {
      connect(assistantConfig);
    }, 500);
  }, [vapiInstance, connect]);

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
    isMuted,
    hasTriedConnection,
    connect,
    disconnect,
    sendMessage,
    mute,
    unmute,
    switchAssistant,
    currentAssistant
  };
};
