import React, { createContext, useContext, useState, useEffect } from 'react';
import AccountContext from './AccountContext';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ url, children }) => {
    const [webSocket, setWebSocket] = useState(null);
    const [ReceivedMessages, setReceivedMessages] = useState([]);
    const [receivedPosts, setReceivedPosts] = useState([]);
    const [receivedProducts, setReceivedProducts] = useState([]);
    const { getSession } = useContext(AccountContext);

    // Safely parse JSON strings
    const safelyParseJSON = (jsonString) => {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return null;
        }
    };

    useEffect(() => {
        let subu = '';
        const initializeWebSocket = async () => {
            try {
                const session = await getSession();
                subu = session.sub;

                const socket = new WebSocket(url);

                socket.onopen = () => {
                    console.log('WebSocket connected');
                    setWebSocket(socket);
                };

                socket.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    console.log('WebSocket message:', message);

                    // Handle messages array
                    if (message.messages && Array.isArray(message.messages)) {
                        setReceivedMessages((prevMessages) => {
                            const updatedMessages = [
                                ...prevMessages,
                                ...message.messages.map((msg) => ({
                                    id: msg.ID, // Assuming `ID` is the unique identifier
                                    text: msg.Message,
                                    isSent: msg.Sender === subu,
                                })),
                            ];

                            // Sort messages by ID
                            return updatedMessages.sort((a, b) => a.id - b.id);
                        });
                    }

                    // Handle posts array
                    if (message.posts && Array.isArray(message.posts)) {
                        setReceivedPosts((prevPosts) => {
                            const updatedPosts = [
                                ...prevPosts,
                                ...message.posts.map((post) => ({
                                    id: post.id,
                                    content: post.content,
                                    fontFamily: post.fontFamily,
                                    fontStyle: safelyParseJSON(post.fontStyle),
                                    fontColor: post.fontColor,
                                    selectedProduct: post.selectedProduct,
                                    author: post.author,
                                    ownername: post.ownername,
                                    files: safelyParseJSON(post.files),
                                    likes: safelyParseJSON(post.likes),
                                    comments: safelyParseJSON(post.comments),
                                })),
                            ];
                            return updatedPosts.sort((a, b) => b.id - a.id);;
                        });
                    }

                   // Handle received products
    if (message.products && Array.isArray(message.products)) {
        console.log('Received products:', message.products); // Log the products to inspect their structure

        setReceivedProducts((prevProducts) => {
            const updatedProducts = [
                ...prevProducts,
                ...message.products.map((product) => ({
                    id: product.id, // Assuming `id` is the unique identifier
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    owner: product.owner,
                })),
            ];

            return updatedProducts;
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
            } catch (error) {
                console.error('Error initializing WebSocket:', error);
            }
        };

        initializeWebSocket();

        // Cleanup function to close WebSocket connection
        return () => {
            if (webSocket) {
                webSocket.close();
                console.log('WebSocket connection closed');
            }
        };
    }, [url, getSession]);

    const contextValue = {
        socket: webSocket,
        ReceivedMessages,
        setReceivedMessages,
        receivedPosts,
        receivedProducts,
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
