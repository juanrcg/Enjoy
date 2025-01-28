

import React, { Component, useEffect, useState } from 'react';
import SignUp_user from './Components/User/SignUp_user'
import './App.css'
import Header from './Components/header.js'
import Footer from './Components/footer.js'



import { BrowserRouter, Routes, Route} from 'react-router-dom';


import { WebSocketProvider } from './Context/WebSocketContext';
import AccountState from './States/AccountState';


function App() {

  
    return (
        <>
   
        
       
           
            <WebSocketProvider>
                <Header></Header>
        

            <AccountState><SignUp_user> </SignUp_user></AccountState>

                <Footer></Footer>
            </WebSocketProvider>
             
        </>
      
    
            
          
    );
  }

export default App;