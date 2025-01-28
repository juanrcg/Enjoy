import React, { Component, useEffect, useState, useContext, useRef, useCallback, createContext } from 'react';
import Feed_Header from '../User/feed_header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import AccountContext from '../../Context/AccountContext';
import Messager from '../Chat/message_box';
import Footer from '../footer';
import { WebSocketProvider } from '../../Context/WebSocketContext'; // Adjust path as per your project structure
import { useWebSocket } from '../../Context/WebSocketContext'; // Adjust path as per your WebSocket context


function Evento() {

    const { ReceivedMessages, setReceivedMessages, socket } = useWebSocket();
    const [isConnected, setIsConnected] = useState(false);
    const [user_message, setMessage] = useState('');


    useEffect(() => {
        if (socket) {
            setIsConnected(socket.readyState === WebSocket.OPEN);

            const handleOpen = () => setIsConnected(true);
            const handleClose = () => setIsConnected(false);

            socket.addEventListener('open', handleOpen);
            socket.addEventListener('close', handleClose);

            return () => {
                socket.removeEventListener('open', handleOpen);
                socket.removeEventListener('close', handleClose);
            };
        }
    }, [socket]);


    const Create_event = (name,type) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                action: "Create_event",
                type: type,
                name: name,
                
            };

            socket.send(JSON.stringify(message));
            setReceivedMessages([...ReceivedMessages, { text: message.message, isSent: true }]);
            setMessage('');
        } else {
            console.error('WebSocket connection not open.');
        }
    };

    const Delete_event = (id) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message = {
                action: "Delete_event",
                id: id,

            };

            socket.send(JSON.stringify(message));
            setReceivedMessages([...ReceivedMessages, { text: message.message, isSent: true }]);
            setMessage('');
        } else {
            console.error('WebSocket connection not open.');
        }
    };


    return (

        <>
            <input
                
               
                className="event_name"
                placeholder="Type your Event Name"
            />
            <select>
                <option value="One Time">One Time</option>
                <option value="Daily">Daily</option>
            </select>


         
         
            <button onClick={Create_event}>Create a New Event</button>

            <h1>Events Resume</h1>

        </>

    )
    

}
export default Evento;