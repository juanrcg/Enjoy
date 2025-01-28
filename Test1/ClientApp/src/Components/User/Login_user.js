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
            <div className="container vh-100 d-flex justify-content-center align-items-center text-white">
    <div className="card p-4 shadow-lg bg-dark text-white" style={{ maxWidth: '400px', width: '100%' }}>
        <form id="submit_form" action="">
            <div className="mb-4 text-center">
                <button 
                    id="google" 
                    className="btn btn-outline-light w-100" 
                    type="button" 
                    onClick={(event) => setGoogle(event.target.value)}
                >
                    Login With Google
                </button>
            </div>

            <div className="separator text-center my-3">
                <span className="text-muted">OR</span>
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label text-white">Email</label>
                <input 
                    id="email" 
                    value={email} 
                    onChange={(event) => setEmail(event.target.value)} 
                    placeholder="Enter your email" 
                    type="email" 
                    className="form-control bg-dark text-white border-light"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="password" className="form-label text-white">Password</label>
                <input 
                    id="password" 
                    value={password} 
                    onChange={(event) => setPass(event.target.value)} 
                    placeholder="Enter your password" 
                    type="password" 
                    className="form-control bg-dark text-white border-light"
                />
                <span className="text-danger" id="password_label"></span>
            </div>

            <div className="d-grid">
                <button 
                    id="submit_button" 
                    className="btn btn-light" 
                    type="button" 
                    onClick={handleLogin}
                >
                    Login
                </button>
            </div>
        </form>
    </div>
</div>

                <Footer></Footer>
            </>









        )


    }
    export default Login;

   