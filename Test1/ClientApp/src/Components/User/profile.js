import React, { Component, useEffect, useState, useContext } from 'react';
import Feed_Header from '../User/feed_header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassMartini, faMartiniGlassCitrus, faUserGear } from '@fortawesome/free-solid-svg-icons';
import AccountContext from '../../Context/AccountContext';

function Profile() {

    const { getSession } = useContext(AccountContext);

    useEffect(() => {

        getSession()
            .then(session => {



                

            })
            .catch(err => {

                console.log(err);
            })

    }, [])

    return (

        <>
            <Feed_Header></Feed_Header>

          




        </>


    )



}
export default Profile;



