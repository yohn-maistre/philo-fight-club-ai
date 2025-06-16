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
  onMessage?: (message: VapiMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
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
  const [currentAssistantId, setCurrentAssistantId] = useState<string | null>(null);

  const vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;

  const connect = useCallback(async (assistantId: string) => {
    if (isConnected || isLoading || hasTriedConnection) return;

    if (!vapiPublicKey || vapiPublicKey === "YOUR_VAPI_PUBLIC_KEY" || vapiPublicKey === undefined) {
      const errorMsg = "Vapi Public Key not configured. Please add VITE_VAPI_PUBLIC_KEY to your environment variables.";
      setError(errorMsg);
      setHasTriedConnection(true);
      options.onError?.(new Error(errorMsg));
      console.error("[Vapi Debug] Public key missing or invalid.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasTriedConnection(true);

    // Pre-connection mic test and device enumeration
    try {
      console.log("[Vapi Debug] Testing microphone access with getUserMedia...");
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("[Vapi Debug] Microphone access granted.");
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(d => d.kind === 'audioinput');
      console.log(`[Vapi Debug] Audio input devices:`, audioInputs);
      if (audioInputs.length === 0) {
        throw new Error("No audio input devices found.");
      }
    } catch (err) {
      const errorMsg = "Microphone access failed: " + (err instanceof Error ? err.message : String(err));
      setError(errorMsg);
      setIsLoading(false);
      setIsConnected(false);
      setIsSpeaking(false);
      options.onError?.(err instanceof Error ? err : new Error(String(err)));
      console.error("[Vapi Debug] Mic test failed:", err);
      return;
    }

    try {
      const vapi = new Vapi(vapiPublicKey);
      console.log("[Vapi Debug] Vapi instance created.");

      // Minimal event listeners for debugging
      vapi.on('call-start', () => {
        setIsConnected(true);
        setIsLoading(false);
        options.onConnect?.();
        console.log('[Vapi Debug] call-start event');
      });
      vapi.on('call-end', () => {
        setIsConnected(false);
        setIsSpeaking(false);
        setVapiInstance(null);
        setVolumeLevel(0);
        options.onDisconnect?.();
        console.log('[Vapi Debug] call-end event');
      });
      vapi.on('error', (error) => {
        setError(error.message || 'An error occurred');
        setIsLoading(false);
        setIsConnected(false);
        setIsSpeaking(false);
        options.onError?.(error);
        console.error('[Vapi Debug] error event', error);
      });
      vapi.on('message', (message) => {
        options.onMessage?.(message);
        console.log('[Vapi Debug] message event', message);
      });

      // Comment out all other event listeners and features for now
      // vapi.on('speech-start', ...)
      // vapi.on('speech-end', ...)
      // vapi.on('volume-level', ...)
      // vapi.on('transfer', ...)
      // window.addEventListener('error', ...)

      console.log(`[Vapi Debug] Starting Vapi with assistantId: ${assistantId}`);
      await vapi.start(assistantId);
      setCurrentAssistantId(assistantId);
      setVapiInstance(vapi);
      console.log('[Vapi Debug] Vapi started successfully.');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect to Vapi';
      setError(errorMsg);
      setIsLoading(false);
      setIsConnected(false);
      setIsSpeaking(false);
      options.onError?.(err instanceof Error ? err : new Error(String(err)));
      console.error('[Vapi Debug] Vapi connection failed:', err);
    }
  }, [isConnected, isLoading, hasTriedConnection, options, vapiPublicKey]);

  const disconnect = useCallback(async () => {
    if (!vapiInstance) return;
    try {
      await vapiInstance.stop();
      setIsConnected(false);
      setIsSpeaking(false);
      setVapiInstance(null);
      setVolumeLevel(0);
      setIsMuted(false);
      setHasTriedConnection(false);
      setCurrentAssistantId(null);
      options.onDisconnect?.();
    } catch (err) { /* ignore */ }
  }, [vapiInstance, options]);

  const sendMessage = useCallback((message: string) => {
    if (!isConnected || !vapiInstance) return;
    try {
      vapiInstance.send({
        type: 'add-message',
        message: {
          role: 'user',
          content: message
        }
      });
    } catch (err) { /* ignore */ }
  }, [isConnected, vapiInstance]);

  const mute = useCallback(() => {
    if (!isConnected || !vapiInstance) return;
    try {
      vapiInstance.setMuted(true);
      setIsMuted(true);
    } catch (err) { /* ignore */ }
  }, [isConnected, vapiInstance]);

  const unmute = useCallback(() => {
    if (!isConnected || !vapiInstance) return;
    try {
      vapiInstance.setMuted(false);
      setIsMuted(false);
    } catch (err) { /* ignore */ }
  }, [isConnected, vapiInstance]);

  const switchAssistant = useCallback(async (assistantId: string) => {
    if (vapiInstance) {
      await vapiInstance.stop();
    }
    setIsConnected(false);
    setIsSpeaking(false);
    setVapiInstance(null);
    setVolumeLevel(0);
    setIsMuted(false);
    setHasTriedConnection(false);
    setCurrentAssistantId(null);
    setTimeout(() => {
      connect(assistantId);
    }, 500);
  }, [vapiInstance, connect]);

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
    currentAssistantId
  };
};
