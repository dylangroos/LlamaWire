import React from 'react';

// Assuming you might move input-specific styles later
// import './MessageInput.css';

// Receive props for state and event handlers from App.jsx
const MessageInput = ({ input, setInput, handleKeyDown, sendMessage }) => {
    return (
        <div className="input-area">
            <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={handleKeyDown} // Use the passed-in handler
                placeholder="Type your message..."
            />
            {/* Use the passed-in sendMessage handler */}
            <button onClick={sendMessage}>Send</button> 
        </div>
    );
};

export default MessageInput; 