
import React, { Component, useEffect, useState, useContext } from 'react';
import { Outlet, Link } from "react-router-dom";
import AccountContext from '../../Context/AccountContext';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faGlassMartini, faMartiniGlassCitrus, faMessage, faBath } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";



function Feed_Header() {
    const navigate = useNavigate();
    const { getSession, updateUser,signout } = useContext(AccountContext);
    var email = "";
     
    useEffect(() => {

        getSession()
            .then(session => {

                 

                document.getElementById("username").innerHTML = session.name;;
                
            })
            .catch(err => {

                console.log(err);
            })

    }, [])

    const handlesignout = (event) => {

        signout()

      .then(data => {

          console.log("success", data);
          navigate("/");

      })
            .catch(err => {
                console.log("fail", err.message);

            })




    }
  

    return (
        <>

          

            <div className="header-all">

                <div>

                    <a className="main"><Link to='/'>  Hangout <FontAwesomeIcon class="icon" icon={faMartiniGlassCitrus} /> </Link> </a>
                    <input id="searchbar" className="searchbar"></input>

                    <a className="store"><Link to='/chat'> <FontAwesomeIcon icon={faBath} /></Link></a> 
                    <a className="msg"><Link to='/chat'> <FontAwesomeIcon icon={faMessage} /></Link></a> 
                    <a className="username" id="username">username</a>
                    <div class="dropdown">
                        <button class="menu_button"> <FontAwesomeIcon icon={faGlassMartini} /> </button>
                        <div class="dropdown-content">
                            <Link to='/profile'>Profile </Link>
                            <Link to='/settings'>Settings </Link>
                            <Link onClick={handlesignout} >Logout </Link>
                           
                            
                           
                        </div>
                    </div>

                    
                </div>

            </div>
            <Outlet />
        </>
    );

}
export default Feed_Header;
