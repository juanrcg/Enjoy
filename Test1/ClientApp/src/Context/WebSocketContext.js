import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AccountContext from './AccountContext';
import SimplePeer from 'simple-peer';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ url, children }) => {
    const [webSocket, setWebSocket] = useState(null);
    const [ReceivedMessages, setReceivedMessages] = useState([]);
    const { getSession } = useContext(AccountContext);
    const subRef = useRef(null);

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
           
                    console.log('WebSocket connected');
                    setWebSocket(socket);
              
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('WebSocket message:', message);

            if (message.message && Array.isArray(message.message)) {

                setReceivedMessages('');
                setReceivedMessages(prevMessages => [
                    ...prevMessages,
                    ...message.message.map(msg => ({
                        text: msg.message,
                        isSent: msg.sender === subRef.current,
                    }))
                ]);
            }
        
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
            setWebSocket(null);
        };
       
    }, []);

    const contextValue = {
        socket: webSocket,
        ReceivedMessages,
        setReceivedMessages,
    
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
