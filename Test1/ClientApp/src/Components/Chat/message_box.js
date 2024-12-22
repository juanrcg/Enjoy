import React, { useState, useRef, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faVideo } from '@fortawesome/free-solid-svg-icons';
import { useWebSocket } from '../../Context/WebSocketContext';
import Message from './Message';
import '../../App.css';
import Peer from 'peerjs';
import AccountContext from '../../Context/AccountContext';
import { useCall } from '../../Context/CallContext';

function Messager({ senderName }) {
    const { startCall } = useCall(); 
    const { ReceivedMessages, setReceivedMessages, socket } = useWebSocket();
    const { getSession } = useContext(AccountContext); // Get session context
    const [userMessage, setUserMessage] = useState('');
    const messageListRef = useRef(null);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' || event.keyCode === 13) {
                sendMessage();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [ReceivedMessages, senderName, userMessage]);

    const sendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                action: "sendmessages",
                sender : "admin",
                receiver: senderName,
                message: userMessage
            };

            

            socket.send(JSON.stringify(message));
            setReceivedMessages(prevMessages => [
                ...prevMessages,
                { text: userMessage, isSent: true }
            ]);
            setUserMessage('');
        } else {
            console.error('WebSocket connection not open.');
        }
    };

    const handleInput = (event) => {
        setUserMessage(event.target.value);
    };



    return (
        <>
            <div className="messages-container">
                <div className="msg_bar">
                    <h1 className="msg_label">
                        Messager with {senderName}
                    </h1>
                </div>
                <div className="messages" ref={messageListRef}>
                    {ReceivedMessages.length === 0 ? (
                        <p>No messages available</p>
                    ) : (
                        ReceivedMessages.map((message, index) => (
                            <Message key={index} text={message.text} isSent={message.isSent} />
                        ))
                    )}
                </div>
            </div>
            <div className="messager_bar">
                <input
                    value={userMessage}
                    onChange={handleInput}
                    className="message_input"
                    placeholder="Enter a message..."
                />
                <button onClick={sendMessage} className="send_btn">
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
                <button onClick={() => startCall(senderName)} className="send_btn">
                    <FontAwesomeIcon icon={faVideo} />
                </button>
            </div>
         
        </>
    );
}

export default Messager;
