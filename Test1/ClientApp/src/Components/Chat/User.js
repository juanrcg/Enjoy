import React from 'react';
import defaultUserPhoto from './default_image.png'; // Replace with path to a default icon

const User = ({ name, username, onClick }) => {
    return (
        <button
            className="btn btn-dark d-flex justify-content-between align-items-center w-100 mb-2"
            onClick={() => onClick(username, name)}
        >
            <div className="d-flex align-items-center">
                {/* Display user photo or default icon */}
                <img 
                    src={defaultUserPhoto} 
                    alt="User" 
                    className="rounded-circle me-3 " 
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                />
                <span>{name}</span>
            </div>
        </button>
    );
};

export default User;
