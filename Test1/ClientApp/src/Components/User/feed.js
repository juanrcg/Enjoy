
import React, { Component, useEffect, useState, useContext } from 'react';
import AccountContext from '../../Context/AccountContext';
import AccountState from '../../States/AccountState';
import Feed_Header from './feed_header';
import Footer from '../footer';
import Header from '../header';


function Feed() {



    return (


        <>
            <Feed_Header></Feed_Header>
           

            <div className="all">

                <div className="inner">

                    <a> You are logged </a>

                </div>



            </div>

            <Footer></Footer>
        </>






        


    )


}
export default Feed;
