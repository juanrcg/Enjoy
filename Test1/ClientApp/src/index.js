import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './Components/User/Login_user';
import Signup_user from './Components/User/SignUp_user';
import Header from './Components/header.js'
import Home from './Components/home';


import './setup';
import AccountState from './States/AccountState';
import Feed from './Components/User/feed';
import 'font-awesome/css/font-awesome.min.css';
import Feed_Header from './Components/User/feed_header';
import Settings from './Components/User/settings';
import Profile from './Components/User/profile';
import Chat from './Components/Chat/chat';
import Evento from './Components/Events/event';
import Messager from './Components/Chat/message_box.js';
import Video from './Components/Chat/VideoCall';
import Product from './Components/Products/Product.js';
import Bar from './Components/User/Bar.js'
import Post from './Components/User/Post.js'

import { WebSocketProvider } from './Context/WebSocketContext';
import { CallContextProvider } from './Context/CallContext';
const websocketurl = 'wss://zejczanjo5.execute-api.us-east-1.amazonaws.com/production/';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <BrowserRouter basename={baseUrl}>
        <Routes>
         
       
            <Route path="/" element={<Header></Header>} />
            <Route path="/" element={<Feed_Header></Feed_Header>} />
            <Route index element={<Home />} />
            <Route path="Login_user" element={<AccountState><Login></Login></AccountState>} />
            <Route path="SignUp_user" element={<AccountState><Signup_user></Signup_user></AccountState>} />
            <Route path="feed" element={<AccountState><WebSocketProvider url={websocketurl}><CallContextProvider><Feed></Feed></CallContextProvider></WebSocketProvider></AccountState>} />
            <Route path="settings" element={<AccountState><Settings></Settings></AccountState>} />
            <Route path="profile" element={<AccountState><Profile></Profile></AccountState>} />
            <Route path="chat" element={<AccountState><WebSocketProvider url={websocketurl}><CallContextProvider><Chat></Chat></CallContextProvider></WebSocketProvider></AccountState>} />
            <Route path="message_box" element={<AccountState><WebSocketProvider url={websocketurl}><CallContextProvider><Messager></Messager></CallContextProvider></WebSocketProvider></AccountState>} />
            <Route path="event" element={<AccountState><WebSocketProvider url={websocketurl}><Evento></Evento></WebSocketProvider></AccountState>} />
            <Route path="post" element={<AccountState><WebSocketProvider url={websocketurl}><CallContextProvider><Post></Post></CallContextProvider></WebSocketProvider></AccountState>} />
            <Route path="bar" element={<AccountState><WebSocketProvider url={websocketurl}><CallContextProvider><Bar></Bar></CallContextProvider></WebSocketProvider></AccountState>} />
            <Route path="video" element={<AccountState><WebSocketProvider url={websocketurl}><CallContextProvider><Video></Video></CallContextProvider></WebSocketProvider></AccountState>} />
            <Route path="product" element={<AccountState><WebSocketProvider url={websocketurl}><CallContextProvider><Product></Product></CallContextProvider></WebSocketProvider></AccountState>} />
    </Routes>

     
  </BrowserRouter>);
