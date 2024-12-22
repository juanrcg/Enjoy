import React from "react";

import AccountContext from "../Context/AccountContext"
import userPool from "./UserPool";
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import {  CognitoUserAttribute } from "amazon-cognito-identity-js"

import { CognitoIdentityServiceProvider } from 'aws-sdk';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { CognitoUserPool } = AmazonCognitoIdentity;
const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });


const UserPoolId = "us-east-1_83O313Lra";
const ClientID = "52h3g1uum5ctfq1n9to6q23chj";

const AccountState = (props) => {

    AWS.config.update({ region: 'us-east-1' });

 

    AWS.config.update({
        
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: process.env.REACT_APP_AWS_REGION,
       
    });


    const userPool = new CognitoUserPool({
        UserPoolId: UserPoolId,
        ClientId: ClientID,
        region: "us-east-1"
    });

    const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();




    const signout = async (attribute_insert, attribute_value) => {
        return await new Promise((resolve, reject) => {



            const user = userPool.getCurrentUser();

            if (user) {

                user.signOut();

                resolve();
                console.log("success")

            }

            else {

                reject();
                console.log("fail");

            }

        })

    }


    const handleConfirmUser = async (username,confirmationCode) => {
        const params = {
            ClientId: ClientID,
            Username: username,
            ConfirmationCode: confirmationCode,
        };

        try {
            await cognito.confirmSignUp(params).promise();
            alert("User confirmed successfully.");
        } catch (error) {
            console.error("Error confirming user:", error);
            alert("Error confirming user.");
        }
    };


    const updateUser = async (email,attribute_insert,attribute_value) => {
        return await new Promise((resolve, reject) => {

            const user = userPool.getCurrentUser();

            if (user) {

                user.getSession(async (err, session) => {

                    if (err) {

                        reject(err);
                    }
                        else {

                        if (attribute_insert == "password") {

                          

                          
                            const user = new CognitoUser({
                                Username: email,
                                Pool: userPool,



                            })

                            user.forgotPassword({

                                onSuccess: () => {
                                    console.log("success");
                                },
                                onFailure: () => {


                                    console.log("fail");

                                }


                            })  

                            



                        }

                        else {

                            const attributeList = [];
                            const toinsert_attribute = new CognitoUserAttribute({

                                Name: attribute_insert,
                                Value: attribute_value


                            });

                            attributeList.push(toinsert_attribute);

                            user.updateAttributes(attributeList, (err, result) => {

                                if (err) {
                                    console.log("fail", err);
                                } else {

                                    console.log("sucess", result);

                                }
                            })

                        }
                    
                    }



                })


            }
            else {

                reject();
            }


        })
    }


    const getSession = async () => {
        return await new Promise((resolve, reject) => {

       

        const user = userPool.getCurrentUser();

        if (user) {

            user.getSession(async (err, session) => {

                if (err) {

                    reject(err);
                } else {



                   // resolve(session);

                    const attributes = await new Promise((resolve, reject) => {
                        user.getUserAttributes((err, attributes) => {

                            if (err) {
                                console.log(err.message);
                                reject(err);
                            } else {
                                const results = {};
                                for (let attribute of attributes) {
                                    const { Name, Value } = attribute;
                                    results[Name] = Value;
                                }
                                resolve(results);
                                console.log(results);
                            }
                        })

                    })
                    resolve({ user, ...session, ...attributes })
                }



            })


        }
        else {

            reject();
        }


        })
    }



  
    
    const signup = async (email, passx) => {

        return await new Promise((resolve, reject) => {
            const attributeList = [];




            let UserName = {

                Name: "email",
                Value: email

            }

            attributeList.push(UserName);
            userPool.signUp(email, passx, attributeList, null, (err, data) => {

                if (err) {
                    console.log("failed", err.message);

                    document.getElementById("password_label").innerHTML = err.message;
                    reject();
                } else {

                    console.log("Success", data);
                    resolve();
                }


            })
        })

    }


   const login = async  (username, password) => {
        const userPool = new CognitoUserPool({
            UserPoolId: UserPoolId,
            ClientId: ClientID 
        });
        const authenticationData = {
            Username: username,
            Password: password
        };

        const user = new CognitoUser({ Username: username, Pool: userPool });
        const authenticationDetails = new AuthenticationDetails(authenticationData);

       return await new Promise((resolve, reject) => (
            user.authenticateUser(authenticationDetails, {
                onSuccess: (result) => resolve(result),
                onFailure: (err) => reject(err),
            })
        ));
    }







    const verify = async (userx,code) => {

        return await new Promise((resolve, reject) => {

            const usera = new CognitoUser({
                Username: userx,
                Pool: userPool,





            })

            usera.confirmRegistration(code, true, (err, data) => {

                if (err) {
                    console.log("failed", err.message);
                    reject();
                } else {

                    console.log("Success", data);
                    resolve();
                }


           

            })
        })

    }



    const authenticate = async (Usern, password) => {
    

      
       
        return await new Promise((resolve, reject) => {

          

            const usera = new CognitoUser({
                Username: Usern,
                Pool: userPool,
             

                
                
               
            })


           

          
            const authDetails = new AuthenticationDetails({

                Username: Usern,
                password
             
            })

            usera.authenticateUser(authDetails, {
                onSuccess: (data) => {

                    console.log("success", data);
                    resolve(data);


                },
                onFailure: (err) => {

                    console.log("fail");
                    reject(err);

                },

                newPasswordRequired: (data) => {
                    console.log("new pass required", data)
                    resolve(data);
                }
            })
        })
    }


        return (

            <AccountContext.Provider value={{ signup, signout, authenticate, verify, login, getSession, updateUser, userPool, cognitoIdentityServiceProvider, handleConfirmUser }} >
                {props.children}

            </AccountContext.Provider>




        )
    
}

export default AccountState;

