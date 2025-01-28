import React, { useState, useRef, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faVideo } from '@fortawesome/free-solid-svg-icons';
import { useWebSocket } from '../../Context/WebSocketContext';
import Message from './Message';
import Feed_Header from '../User/feed_header';
import '../../App.css';
import AccountContext from '../../Context/AccountContext';
import { useCall } from '../../Context/CallContext';

function Messager() {
    const { startCall } = useCall();
    const { ReceivedMessages, setReceivedMessages, socket } = useWebSocket();
    const { getSession } = useContext(AccountContext); // Para obtener la información del usuario actual
    const [userMessage, setUserMessage] = useState('');
    const messageListRef = useRef(null);
    const [sender, setSender] = useState(''); // Establecer sender aquí como estado
    
    // Extraer selectedSender de los parámetros de URL
    const queryParams = new URLSearchParams(window.location.search);
    const selectedSender = queryParams.get('selectedSender');
    const selectedSenderSub = queryParams.get('selectedSenderSub');
    
    useEffect(() => {
        // Configurar el intervalo para revisar nuevos mensajes cada 3 segundos
        const intervalId = setInterval(() => {
            if (socket && socket.readyState === WebSocket.OPEN && sender && selectedSenderSub) {
                const body = {
                    action: 'getmessages',
                    receiver: selectedSenderSub,
                    sender: sender,
                };
                socket.send(JSON.stringify(body)); // Enviar solicitud para obtener mensajes
            }
        }, 3000); // Cada 3 segundos

        return () => clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
    }, [sender, selectedSenderSub, socket]); // Dependencias

    useEffect(() => {
        // Obtener datos de sesión y establecer el sender
        getSession()
            .then(session => {
                setSender(session.sub); // Establecer el sender después de obtener la sesión
            })
            .catch(err => {
                console.log(err);
            });
    }, [getSession]);

    useEffect(() => {
        // Desplazar hacia abajo cuando lleguen nuevos mensajes
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

    const sendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN && sender) {
            const message = {
                action: 'sendmessages',
                sender: sender, // Asegúrate de que sender esté configurado aquí
                receiver: selectedSenderSub,
                message: userMessage,
            };

            socket.send(JSON.stringify(message));

            setReceivedMessages(prevMessages => [
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

    console.log('Current ReceivedMessages:', ReceivedMessages); // Log de los mensajes recibidos

    return (
        <>
            <Feed_Header />
            <div className="messages-container">
                <div className="msg_bar">
                    <h1 className="msg_label">Messager with {selectedSender || 'Unknown'}</h1>
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
                <button onClick={() => startCall(selectedSenderSub)} className="send_btn">
                    <FontAwesomeIcon icon={faVideo} />
                </button>
            </div>
        </>
    );
}

export default Messager;
