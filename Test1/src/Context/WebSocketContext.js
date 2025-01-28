import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AccountContext from './AccountContext';
import SimplePeer from 'simple-peer';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ url, children }) => {
    const [webSocket, setWebSocket] = useState(null);
    const [ReceivedMessages, setReceivedMessages] = useState([]);
    const { getSession } = useContext(AccountContext);
    let subu = '';

    getSession()
                .then(session => {
                subu= session.sub;
                });

    useEffect(() => {
        const socket = new WebSocket(url);

        socket.onopen = () => {
           
                    console.log('WebSocket connected');
                    setWebSocket(socket);
              
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('WebSocket message:', message);

            if (message.messages && Array.isArray(message.messages)) {
                setReceivedMessages('');
                setReceivedMessages((prevMessages) => {
                    const updatedMessages = [
                        ...prevMessages,
                        ...message.messages.map((msg) => ({
                            id: msg.ID, // Assuming `ID` is the unique identifier
                            text: msg.Message,
                            isSent: msg.Sender === subu,
                        })),
                    ];
        
                    // Sort the messages by ID (ascending order)
                    return updatedMessages.sort((a, b) => a.id - b.id);
                });
                

                
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
