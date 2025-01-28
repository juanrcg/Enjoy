
import React, { Component, useEffect, useState, useContext } from 'react';
import { Outlet, Link } from "react-router-dom";
import { faGlassMartini, faMartiniGlassCitrus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function Header() {

    return (
        <>

<div className="container-fluid bg-dark text-white">
  <div className="row align-items-center py-3">
    <div className="col-12 d-flex justify-content-between align-items-center">
      {/* Logo and link */}
      <a className="text-white h4" href="/" style={{ textDecoration: 'none' }}>
        Hangout <FontAwesomeIcon className="icon" icon={faMartiniGlassCitrus} />
      </a>

      {/* Sign In and Sign Up links */}
      <div className="d-flex">
        <a className="text-white me-3" href="/Login_User" style={{ textDecoration: 'none' }}>
          Sign In
        </a>
        <a className="text-white" href="/SignUp_user" style={{ textDecoration: 'none' }}>
          Sign Up
        </a>
      </div>
    </div>
  </div>
  
  <Outlet />
</div>

        </>
    );

}
export default Header;