import React, { Component, useEffect, useState, useContext } from 'react';


function Product() {

    const socket = '';

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (name,price,type) => {

        const message = {
            action: "addproduct",
            name: name,
            price: price,
            type: type 
        };

        socket.send(JSON.stringify(message));


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
            <button id='submit_button' onClick={(event) => handleSubmit(name, price, type)}> Add to inventory </button>

        
        </div>
</>
    )


}
export default Product;