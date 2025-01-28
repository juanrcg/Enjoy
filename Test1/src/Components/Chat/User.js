// User.jsx
import React from 'react';

const User = ({ name, username, onClick }) => {
    return (
        <button className='user' onClick={() => onClick(username,name)}>
            {name}
        </button>
    );
};

export default User;
