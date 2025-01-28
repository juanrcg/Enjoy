import React, { Component, useEffect, useState, useContext } from 'react';
import AccountContext from '../../Context/AccountContext';
import AccountState from '../../States/AccountState';
import { useNavigate } from "react-router-dom";
import Header from '../header';
import Footer from '../footer';

function Login() {


    const navigate = useNavigate();
    const [password, setPass] = useState("");
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [google, setGoogle] = useState("");


    const { login, getSession } = useContext(AccountContext);

    useEffect(() => {

        getSession()
            .then(session => {
                window.location.href = '/feed';
            })
            .catch(err => {

                console.log(err);
            })


        document.addEventListener('keydown', handleKeyDown);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };

    }, [email, password])




    const handleLogin = (event) => {


        event.preventDefault();
        login(email, password)

            .then(data => {

                console.log("success", data);

                navigate("/Feed");
            })
            .catch(err => {

                var error_string = err + '';
                document.getElementById("password_label").innerHTML = error_string.split(':')[1];
                console.log("fail", err.message);

            })
    }

    const handleKeyDown = (event) => {

        if (event.key === 'Enter' || event.keyCode === 13) {
            event.preventDefault();
            handleLogin(event);
        }


    }

        return (


            <>

            <Header></Header>
                <div className="all">

                    <div className="inner">
                        <form id='submit_form'  action=''>


                            <div className="form-wrapper">





                                <button id="google" value={google} onChange={(event) => setGoogle(event.target.value)} placeholder="" type="text" >Login With Google</button>
                            </div>

                            <div className="separator">
                                <span> OR </span>

                            </div>

                            <div className="form-wrapper">

                                <input id="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" type="text" class="form-control"></input>





                                <div className="">

                                    <input id="password" value={password} onChange={(event) => setPass(event.target.value)} placeholder="Password" type="text" class="form-control" ></input>
                                    <span className="error_handler_label" id="password_label"> </span>
                                </div>


                            </div>


                            <div >

                                <button  id = 'submit_button' onClick={handleLogin}  > Login </button>

                            </div>
                           

                        </form>
                    </div>
                </div>






                <div>

                </div>

                <Footer></Footer>
            </>









        )


    }
    export default Login;

   