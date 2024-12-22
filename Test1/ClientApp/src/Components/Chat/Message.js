// Message.jsx
import React from 'react';

const Message = ({text, isSent }) => {
    return (
        <div className={isSent ? 'sent-message' : 'received-message'}>
          {text}
        </div>
    );
};

export default Message;
