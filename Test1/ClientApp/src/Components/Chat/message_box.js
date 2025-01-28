import React, { useState, useRef, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faVideo } from '@fortawesome/free-solid-svg-icons';
import { useWebSocket } from '../../Context/WebSocketContext';
import Message from './Message';
import Feed_Header from '../User/feed_header';
import Footer from '../footer';
import '../../App.css';
import AccountContext from '../../Context/AccountContext';
import { useCall } from '../../Context/CallContext';

function Messager() {
    const { startCall } = useCall();
    const { ReceivedMessages, setReceivedMessages, socket } = useWebSocket();
    const { getSession } = useContext(AccountContext);
    const [userMessage, setUserMessage] = useState('');
    const messageListRef = useRef(null);
    const [sender, setSender] = useState('');
    const queryParams = new URLSearchParams(window.location.search);
    const selectedSender = queryParams.get('selectedSender');
    const selectedSenderSub = queryParams.get('selectedSenderSub');

    // Loading state for the first time
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [loading, setLoading] = useState(false);

    // Fetch messages periodically and handle first-time loading spinner
    useEffect(() => {
        if (socket && socket.readyState === WebSocket.OPEN && sender && selectedSenderSub) {
            if (isFirstLoad) {
                setLoading(true); // Show loading spinner
                setTimeout(() => setLoading(false), 3000); // Hide spinner after 3 seconds
                setIsFirstLoad(false); // Disable first-time logic
            }

            const body = {
                action: 'getmessages',
                receiver: selectedSenderSub,
                sender: sender,
            };
            socket.send(JSON.stringify(body));
        }
    }, [sender, selectedSenderSub, socket, isFirstLoad]);

    // Update sender from session
    useEffect(() => {
        getSession()
            .then((session) => setSender(session.sub))
            .catch((err) => console.log(err));
    }, [getSession]);

    // Handle scrolling and "Enter" key for sending messages
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
    }, [ReceivedMessages, userMessage]);

    // Send message via WebSocket
    const sendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN && sender) {
            const message = {
                action: 'sendmessages',
                sender: sender,
                receiver: selectedSenderSub,
                message: userMessage,
            };

            socket.send(JSON.stringify(message));
            setReceivedMessages((prevMessages) => [
                ...prevMessages,
                { text: userMessage, isSent: true },
            ]);
            setUserMessage('');
        } else {
            console.error('WebSocket connection not open or sender not set.');
        }
    };

    const handleInput = (event) => {
        setUserMessage(event.target.value);
    };

    return (
        <>
            <Feed_Header />
            <div className="d-flex flex-column vh-100">
                <div className="msg_bar bg-dark text-center py-2 border-bottom">
                    <h1 className="msg_label">{selectedSender || 'Unknown'}</h1>
                </div>
                <div className="flex-grow-1 overflow-auto p-3 messages" ref={messageListRef}>
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : ReceivedMessages.length === 0 ? (
                        <p className="text-muted">No messages available</p>
                    ) : (
                        ReceivedMessages.map((message, index) => (
                            <Message key={index} text={message.text} isSent={message.isSent} />
                        ))
                    )}
                </div>
                <div className="messager_bar bg-dark d-flex align-items-center p-3 border-top">
                    <input
                        value={userMessage}
                        onChange={handleInput}
                        className="form-control me-2"
                        placeholder="Enter a message..."
                    />
                    <button onClick={sendMessage} className="btn btn-primary me-2">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                    <button onClick={() => startCall(selectedSenderSub)} className="btn btn-secondary">
                        <FontAwesomeIcon icon={faVideo} />
                    </button>
                </div>
            </div>
        </>
    );
}

export default Messager;
