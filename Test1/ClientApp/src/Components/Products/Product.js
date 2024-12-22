function Product() {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("");

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

            <label for="name"> Product Name </label>
            <input id="name" onChange={(event) => setName(event.target.value)}></input>

            <label for="price"> Product Name </label>
            <input id="price" onChange={(event) => setPrice(event.target.value)}></input>

            <label for="type"> Product Name </label>
            <select id="type" onChange={(event) => setType(event.target.value)}></input>

            <button id='submit_button' onClick={(event) => handleSubmit(name, price, type)}> Add to inventory </button>

        </>
    )


}
export default Product;