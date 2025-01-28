
import React, { Component, useEffect, useState, useContext } from 'react';
import { Outlet, Link } from "react-router-dom";
import AccountContext from '../../Context/AccountContext';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faGlassMartini, faMartiniGlassCitrus, faMessage, faBath } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';



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

          <div className="container-fluid bk py-2">
  <div className="d-flex align-items-center justify-content-between">
    {/* Brand Name with Icon */}
    <a className="navbar-brand d-flex align-items-center text-white" href="/feed">
      Hangout <FontAwesomeIcon className="ms-2" icon={faMartiniGlassCitrus} />
    </a>

    {/* Search Bar */}
    <div className="flex-grow-1 mx-3">
      <input
        id="searchbar"
        className="form-control"
        type="text"
        placeholder="Search"
      />
    </div>

    {/* Navigation Icons */}
    <div className="d-flex align-items-center  text-white">
      <a className="me-3 text-white" href="/chat">
        <FontAwesomeIcon icon={faMessage} />
      </a>
      <a className="me-3 text-white text-decoration-none" href="/profile" id="username">
        username
      </a>

      {/* Dropdown Menu */}
      <div className="dropdown">
        <button
          className="btn btn-dark dropdown-toggle "
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <FontAwesomeIcon icon={faGlassMartini} />
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
          <Link className="dropdown-item" to="/profile">
            Profile
            </Link>
          </li>
          <li>
            <a className="dropdown-item" href="/settings">
              Settings
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#" onClick={handlesignout}>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
<Outlet />
        </>
    );

}
export default Feed_Header;
