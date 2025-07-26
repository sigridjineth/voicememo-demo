import { useEffect, useRef, useState, useCallback } from 'react';
import { WS_EVENTS } from '@/lib/constants';

interface WebSocketOptions {
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp: string;
}

export function useWebSocket(
  endpoint: string,
  options: WebSocketOptions = {}
) {
  const {
    autoConnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const listenersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  const wsUrl = `${import.meta.env.VITE_WS_URL}${endpoint}`;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const url = token ? `${wsUrl}?token=${token}` : wsUrl;
      
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        console.log('WebSocket connected');
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        
        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          setTimeout(connect, reconnectInterval);
        } else {
          setError('Failed to connect after multiple attempts');
        }
      };

      wsRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);

          // Notify specific listeners
          const listeners = listenersRef.current.get(message.type);
          if (listeners) {
            listeners.forEach((listener) => listener(message.data));
          }

          // Notify wildcard listeners
          const wildcardListeners = listenersRef.current.get('*');
          if (wildcardListeners) {
            wildcardListeners.forEach((listener) => listener(message));
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setError('Failed to create connection');
    }
  }, [wsUrl, maxReconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((type: string, data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: new Date().toISOString(),
      };
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, new Set());
    }
    listenersRef.current.get(event)!.add(callback);

    // Return cleanup function
    return () => {
      const listeners = listenersRef.current.get(event);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          listenersRef.current.delete(event);
        }
      }
    };
  }, []);

  const off = useCallback((event: string, callback: (data: any) => void) => {
    const listeners = listenersRef.current.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        listenersRef.current.delete(event);
      }
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    error,
    connect,
    disconnect,
    sendMessage,
    on,
    off,
  };
}