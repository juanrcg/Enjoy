import React, { Component, useEffect, useState, useContext, useRef, useCallback, createContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import AccountContext from '../../Context/AccountContext'
import { WebSocketProvider } from '../../Context/WebSocketContext'; // Adjust path as per your project structure
import User from './User';

function User_bar({ onUserSelect }) {


    const { updateUser, resetpass, getSession, userPool, cognitoIdentityServiceProvider } = useContext(AccountContext);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedSender, setSelectedSender] = useState('');

    const listUsers = async () => {
        try {
            const params = {
                UserPoolId: "us-east-1_E4tHXcNqJ",
                AttributesToGet: ['email'] // You can specify which attributes you want to fetch
            };

            const data = await cognitoIdentityServiceProvider.listUsers(params).promise();
            setUsers(data.Users);
            console.log(users)

        } catch (error) {
            console.error('Error listing users:', error);
        }
    };



    useEffect(() => {
        listUsers();
    }, []);

    
        useEffect(() => {
            // Filter and sort users based on the search query
            const updateFilteredUsers = () => {
                const newFilteredUsers = users
                    .filter(user => {
                        const emailAttribute = user.Attributes.find(attr => attr.Name === 'email');
                        const email = emailAttribute ? emailAttribute.Value.toLowerCase() : '';
                        return email.includes(searchQuery);
                    })
                    .sort((a, b) => {
                        const aEmail = a.Attributes.find(attr => attr.Name === 'email').Value.toLowerCase();
                        const bEmail = b.Attributes.find(attr => attr.Name === 'email').Value.toLowerCase();

                        const aMatchIndex = aEmail.indexOf(searchQuery);
                        const bMatchIndex = bEmail.indexOf(searchQuery);

                        if (aMatchIndex === -1 && bMatchIndex !== -1) return 1; // a does not match, b does
                        if (aMatchIndex !== -1 && bMatchIndex === -1) return -1; // a matches, b does not
                        if (aMatchIndex !== bMatchIndex) return aMatchIndex - bMatchIndex; // Sort by index of first match

                        // For emails with the same match index, prioritize length of the match
                        const aMatchLength = searchQuery.length;
                        const bMatchLength = searchQuery.length;

                        return aMatchLength - bMatchLength; // Longer match is preferred
                    });

                setFilteredUsers(newFilteredUsers);
            };

            updateFilteredUsers();
        }, [searchQuery, users]); // Dependencies: runs when searchQuery or users changes



    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };



    return (

       <>
            <input
                className= "user_chat_bar"
                    type="text"
                    placeholder="Search by email..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <div className="users">
                    {filteredUsers.map((user, index) => {
                        const emailAttribute = user.Attributes.find(attr => attr.Name === 'email');
                        const email = emailAttribute ? emailAttribute.Value : 'No email found';

                        return (
                            <div key={index} className="user-container">
                                <User name={email} username={user.Username} onClick={() => onUserSelect(user.Username, email)} />
                            </div>
                        );
                    })}
                </div>
       </>

    )
} export default User_bar;

