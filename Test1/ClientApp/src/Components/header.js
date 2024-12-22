
import React, { Component, useEffect, useState, useContext } from 'react';
import { Outlet, Link } from "react-router-dom";
import { faGlassMartini, faMartiniGlassCitrus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function Header() {

    return (
        <>

            <div className="header-all">

                <div>


                    <a className="main"><Link to='/'>  Hangout <FontAwesomeIcon class="icon" icon={faMartiniGlassCitrus} /> </Link> </a>

                        <a className="a-pack"><Link to="/Login_User">  Sign In </Link> </a>

                            <a className="a-pack" ><Link to='/SignUp_user'>  Sign Up </Link></a>

                </div>

            </div>
            <Outlet />
        </>
    );

}
export default Header;