
import { useState, useEffect, useCallback } from 'react';

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
  const [vapiInstance, setVapiInstance] = useState<any>(null);

  const connect = useCallback(async (assistantId: string) => {
    if (isConnected || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Initialize Vapi SDK
      // const vapi = new Vapi(publicKey);
      // await vapi.start(assistantId);
      
      // For now, simulate connection
      setTimeout(() => {
        setIsConnected(true);
        setIsLoading(false);
        options.onConnect?.();
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Vapi');
      setIsLoading(false);
      options.onError?.(err);
    }
  }, [isConnected, isLoading, options]);

  const disconnect = useCallback(async () => {
    if (!isConnected) return;

    try {
      // TODO: Disconnect from Vapi
      // await vapiInstance?.stop();
      
      setIsConnected(false);
      setVapiInstance(null);
      options.onDisconnect?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect from Vapi');
      options.onError?.(err);
    }
  }, [isConnected, vapiInstance, options]);

  const sendMessage = useCallback((message: string) => {
    if (!isConnected || !vapiInstance) {
      console.warn('Vapi not connected. Cannot send message:', message);
      return;
    }

    // TODO: Send message to Vapi
    // vapiInstance.send(message);
    console.log('Sending message to Vapi:', message);
  }, [isConnected, vapiInstance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, []);

  return {
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    sendMessage
  };
};
