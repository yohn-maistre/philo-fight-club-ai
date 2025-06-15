import { useState, useEffect, useCallback, useRef } from 'react';
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
  call?: any;
  error?: any;
}

interface VapiSquadMember {
  assistantId?: string;
  assistant?: {
    name: string;
    model: {
      model: string;
      provider: string;
      messages?: Array<{
        role: string;
        content: string;
      }>;
      maxTokens?: number;
      temperature?: number;
    };
    voice: {
      voiceId: string;
      provider: string;
      fillerInjectionEnabled?: boolean;
    };
    transcriber?: {
      model: string;
      language: string;
      provider: string;
    };
    firstMessage: string;
    firstMessageMode: string;
    backchannelingEnabled?: boolean;
    backgroundDenoisingEnabled?: boolean;
  };
  assistantDestinations?: Array<{
    type: string;
    assistantName: string;
    message: string;
    description: string;
  }>;
}

interface VapiSquadConfig {
  name: string;
  members: VapiSquadMember[];
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
  onSpeakerChange?: (speaker: string) => void;
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
  const [currentSpeaker, setCurrentSpeaker] = useState<string>('');
  const connectionTimeoutRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;

  // Background message handler for expressions
  const sendBackgroundMessage = useCallback((content: string) => {
    if (!isConnected || !vapiInstance) return;
    
    try {
      vapiInstance.send({
        type: "add-message",
        message: {
          role: "system",
          content: content,
        },
      });
      console.log('Background message sent:', content);
    } catch (err) {
      console.error('Failed to send background message:', err);
    }
  }, [isConnected, vapiInstance]);

  const connect = useCallback(async (callConfig: { 
    assistantId?: string; 
    squadId?: string; 
    squadConfig?: VapiSquadConfig 
  }) => {
    const { assistantId, squadId, squadConfig } = callConfig;
    
    // Prevent multiple connection attempts and respect retry limit
    if (isConnected || isLoading || (hasTriedConnection && retryCountRef.current >= maxRetries)) {
      console.log('Connection attempt blocked - already connected/loading/max retries reached');
      return;
    }

    console.log('Attempting Vapi connection with config:', { assistantId, squadId, squadConfig: !!squadConfig });

    // Validate API key
    if (!vapiPublicKey || vapiPublicKey === "YOUR_VAPI_PUBLIC_KEY" || vapiPublicKey === undefined) {
      const errorMsg = "Vapi Public Key not configured. Please add VITE_VAPI_PUBLIC_KEY to your environment variables.";
      console.error('Vapi Key Error:', errorMsg);
      setError(errorMsg);
      setHasTriedConnection(true);
      options.onError?.(new Error(errorMsg));
      return;
    }

    // Validate config
    if (!assistantId && !squadId && !squadConfig) {
      const errorMsg = "No assistant ID, squad ID, or squad configuration provided";
      console.error('Config Error:', errorMsg);
      setError(errorMsg);
      setHasTriedConnection(true);
      options.onError?.(new Error(errorMsg));
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasTriedConnection(true);
    retryCountRef.current += 1;

    // Set connection timeout
    connectionTimeoutRef.current = setTimeout(() => {
      setError("Connection timeout - please check your internet connection and try again");
      setIsLoading(false);
      options.onError?.(new Error("Connection timeout"));
    }, 30000); // 30 second timeout

    try {
      console.log('Creating Vapi instance with key:', vapiPublicKey.substring(0, 10) + '...');
      const vapi = new Vapi(vapiPublicKey);
      
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
        console.log('Call started successfully');
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
        }
        setIsConnected(true);
        setIsLoading(false);
        setError(null);
        retryCountRef.current = 0; // Reset retry count on success
        options.onConnect?.();
      });

      vapi.on('call-end', () => {
        console.log('Call ended');
        setIsConnected(false);
        setIsSpeaking(false);
        setVapiInstance(null);
        setVolumeLevel(0);
        setCurrentSpeaker('');
        options.onDisconnect?.();
      });

      vapi.on('volume-level', (volume) => {
        setVolumeLevel(volume);
        options.onVolumeLevel?.(volume);
      });

      vapi.on('message', (message) => {
        console.log('Vapi message received:', message);
        
        // Handle transcript messages
        if (message.type === 'transcript' && message.transcript) {
          const speaker = message.transcript.speaker;
          if (speaker && speaker !== 'user' && speaker !== currentSpeaker) {
            setCurrentSpeaker(speaker);
            options.onSpeakerChange?.(speaker);
            
            // Send background message for expression update
            const expressions = ["adjusting his toga dramatically", "stroking his beard thoughtfully", "gesturing with philosophical authority", "gazing into the distance contemplatively"];
            const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
            sendBackgroundMessage(`The speaker ${speaker} is now ${randomExpression} while speaking.`);
          }
          
          options.onMessage?.({
            type: 'transcript',
            transcript: {
              transcript: message.transcript.transcript,
              speaker: speaker || 'AI'
            }
          });
        }
        
        options.onMessage?.(message);
      });

      vapi.on('error', (error) => {
        console.error('Vapi error details:', error);
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
        }
        
        let errorMessage = 'Unknown Vapi error occurred';
        
        // Handle specific error types
        if (error?.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error?.toString) {
          errorMessage = error.toString();
        }
        
        // Check for common error patterns
        if (errorMessage.includes('CORS') || errorMessage.includes('blocked')) {
          errorMessage = "Network error: Unable to connect to Vapi servers. Please check your internet connection.";
        } else if (errorMessage.includes('fetch')) {
          errorMessage = "Connection failed: Unable to reach Vapi API. Please try again.";
        } else if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
          errorMessage = "Authentication failed: Please check your Vapi public key.";
        }
        
        setError(`Vapi Error: ${errorMessage}`);
        setIsLoading(false);
        setIsConnected(false);
        setIsSpeaking(false);
        options.onError?.(error);
      });

      // Start the call with proper configuration
      let startConfig: any = {};

      if (squadConfig) {
        console.log('Starting with squad configuration');
        startConfig = {
          squad: squadConfig
        };
      } else if (assistantId) {
        console.log('Starting with assistant ID:', assistantId);
        startConfig = assistantId;
      } else if (squadId) {
        console.log('Starting with squad ID:', squadId);
        startConfig = { squadId };
      } else {
        throw new Error("No valid configuration provided");
      }

      console.log('Starting Vapi with config:', startConfig);
      await vapi.start(startConfig);
      
      setVapiInstance(vapi);

    } catch (err: any) {
      console.error('Vapi connection failed:', err);
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      
      let errorMessage = 'Failed to connect to Vapi';
      
      // Handle specific error types
      if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Check for common error patterns
      if (errorMessage.includes('CORS') || errorMessage.includes('blocked')) {
        errorMessage = "Network error: Unable to connect to Vapi servers. This might be a CORS issue or network connectivity problem.";
      } else if (errorMessage.includes('fetch')) {
        errorMessage = "Connection failed: Unable to reach Vapi API. Please check your internet connection.";
      }
      
      setError(`Connection Failed: ${errorMessage}`);
      setIsLoading(false);
      setIsConnected(false);
      setIsSpeaking(false);
      options.onError?.(err);
    }
  }, [isConnected, isLoading, hasTriedConnection, options, vapiPublicKey, currentSpeaker, sendBackgroundMessage]);

  const disconnect = useCallback(async () => {
    if (!vapiInstance) return;

    try {
      console.log('Disconnecting from Vapi');
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      await vapiInstance.stop();
      setIsConnected(false);
      setIsSpeaking(false);
      setVapiInstance(null);
      setVolumeLevel(0);
      setIsMuted(false);
      setHasTriedConnection(false);
      setCurrentSpeaker('');
      retryCountRef.current = 0; // Reset retry count
      options.onDisconnect?.();
    } catch (err) {
      console.error('Failed to disconnect from Vapi:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect from Vapi');
      options.onError?.(err);
    }
  }, [vapiInstance, options]);

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
      console.log('Message sent to Vapi:', message);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }, [isConnected, vapiInstance]);

  const mute = useCallback(() => {
    if (!isConnected || !vapiInstance) return;
    
    try {
      vapiInstance.setMuted(true);
      setIsMuted(true);
      console.log('Microphone muted');
    } catch (err) {
      console.error('Failed to mute:', err);
    }
  }, [isConnected, vapiInstance]);

  const unmute = useCallback(() => {
    if (!isConnected || !vapiInstance) return;
    
    try {
      vapiInstance.setMuted(false);
      setIsMuted(false);
      console.log('Microphone unmuted');
    } catch (err) {
      console.error('Failed to unmute:', err);
    }
  }, [isConnected, vapiInstance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
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
    currentSpeaker,
    connect,
    disconnect,
    sendMessage,
    sendBackgroundMessage,
    mute,
    unmute
  };
};
