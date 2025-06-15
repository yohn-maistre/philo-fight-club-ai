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

interface UseVapiOptions {
  assistantId?: string;
  onMessage?: (message: VapiMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useVapi = (options: UseVapiOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);

  // TODO: Add your Vapi Public Key here
  const publicKey = "YOUR_VAPI_PUBLIC_KEY"; // Replace with your actual public key

  const connect = useCallback(async (squadId: string) => {
    if (isConnected || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const vapi = new Vapi(publicKey);
      
      // Set up event listeners
      vapi.on('speech-start', () => {
        console.log('Speech started');
      });

      vapi.on('speech-end', () => {
        console.log('Speech ended');
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
        setVapiInstance(null);
        options.onDisconnect?.();
      });

      vapi.on('volume-level', (volume) => {
        // Handle volume level updates if needed
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
        options.onError?.(error);
      });

      // Start the call with Squad instead of individual assistant
      await vapi.start({
        squadId: squadId
      });
      setVapiInstance(vapi);

    } catch (err) {
      console.error('Failed to connect to Vapi Squad:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to Vapi Squad');
      setIsLoading(false);
      options.onError?.(err);
    }
  }, [isConnected, isLoading, options, publicKey]);

  const disconnect = useCallback(async () => {
    if (!isConnected || !vapiInstance) return;

    try {
      await vapiInstance.stop();
      setIsConnected(false);
      setVapiInstance(null);
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
    connect,
    disconnect,
    sendMessage
  };
};
