import React from 'react';

const Message = ({ text, isSent }) => {
    return (
        <div className={`d-flex ${isSent ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
            <div 
                className={`p-2 rounded ${isSent ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                style={{ maxWidth: '70%' }}
            >
                {text}
            </div>
        </div>
    );
};

export default Message;
