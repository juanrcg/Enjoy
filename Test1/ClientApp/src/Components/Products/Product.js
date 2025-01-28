import React, { Component, useEffect, useState, useContext } from 'react';
import { useWebSocket } from '../../Context/WebSocketContext';
import AccountContext from '../../Context/AccountContext';


function Product() {

    const { socket } = useWebSocket();
    const [isConnected, setIsConnected] = useState(false);
    const { getSession } = useContext(AccountContext); // Para obtener la información del usuario actual
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    let owner = 'error';

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

 // Obtener datos de sesión y establecer el sender
 getSession()
 .then(session => {
     owner = session.sub; // Establecer el sender después de obtener la sesión
 })
 .catch(err => {
     console.log(err);
 });
    

    const handleSubmit = (name,price, description) => {

        const message = {
            action: 'addproduct',
            name: name,
            price: price,
            description: description,
            owner: owner,
        };

        if (socket && socket.readyState === WebSocket.OPEN){

            socket.send(JSON.stringify(message));
        }
    }

    return (
        <>

        <div className='product'>

        
            <input placeholder='Name' id="name" onChange={(event) => setName(event.target.value)}></input>
            <br></br>
          
            <input placeholder='Price' type="number" id="price" onChange={(event) => setPrice(event.target.value)}></input>
            <br></br>
            
            <input placeholder='Description' type="text" id="description" onChange={(event) => setDescription(event.target.value)}></input>
            <br></br>

            <input type='file'></input>            
            <button id='submit_button' onClick={(event) => handleSubmit(name, price, description)}> Add to inventory </button>

        
        </div>
</>
    )


}
export default Product;