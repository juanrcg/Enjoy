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

        <div className='wharehouse'>

        
      <Product></Product>

      <label> Product ID: {productID}</label>
        <button>
            Eliminar
        </button>

        <button>
            Editar
        </button>


        <label> Cantidad: {quantity} </label>
        </div>
</>
    )


}
export default Product;