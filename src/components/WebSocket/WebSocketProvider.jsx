import React, { createContext, useContext, useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:6060/ws');
        const client = Stomp.over(socket);
        client.connect({}, () => {
            setStompClient(client);
        });

        return () => {
            client.disconnect();
        };
    }, []);

    const subscribeToWarehouse = (warehouseId, callback) => {
        if (!stompClient) {
            console.error('WebSocket connection not established');
            return;
        }
        const topic = `/topic/warehouse_${warehouseId}`;
        return stompClient.subscribe(topic, callback);
    };

    const value = { subscribeToWarehouse };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
