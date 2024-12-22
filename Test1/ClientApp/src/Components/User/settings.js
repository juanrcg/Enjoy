import React, { Component, useEffect, useState, useContext } from 'react';
import Feed_Header from './feed_header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassMartini, faMartiniGlassCitrus, faUserGear } from '@fortawesome/free-solid-svg-icons';
import AccountContext from '../../Context/AccountContext';

function Settings() {

    const [attribute, setAttribute] = useState("");
    const [attribute_value, setAttribute_value] = useState("");

    const { updateUser, resetpass, getSession } = useContext(AccountContext);




    const handleUpdate = (event) => {

        getSession()
            .then(session => {

                const email = session.email;
                event.preventDefault();
                updateUser(email, attribute, attribute_value)

                    .then(data => {

                        console.log("success", data);
                        


                    })
                    .catch(err => {


                        console.log("fail", err.message);

                    })


            })
            .catch(err => {

                console.log(err);
            })
        
    }

    return (

        <>
            <Feed_Header></Feed_Header>

            <h1 className="main_label">Settings <FontAwesomeIcon icon={faUserGear} /></h1>

            <div className= "settings">

               

                <select value={attribute} onChange={(event) => setAttribute(event.target.value)} className="setting-select"><FontAwesomeIcon icon={faGlassMartini} />
                    <option>Attribute </option>
                    <option value ="name">Name</option>
                        <option>Phone Number</option>
                    <option>Address</option>
                    <option value="password">Password</option>



                </select>

                <input value={attribute_value} onChange={(event) => setAttribute_value(event.target.value)} placeholder="New Vaue" ></input><button onClick={handleUpdate} className="setting_button">Update</button>
                
            </div>
           
               

          
        </>


    )
  


}
export default Settings;


