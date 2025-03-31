import React from 'react';
import ReactMarkdown from 'react-markdown';
import {MarkdownHooks} from 'react-markdown';
import rehypeStarryNight from 'rehype-starry-night';

// Assuming you might move message-specific styles later
// import './ChatMessages.css';

// Receive messages array as a prop
const ChatMessages = ({ messages }) => {
    // Helper function to determine the CSS class based on role
    const getRoleClass = (role) => {
        if (role === 'system') return 'role-system';
        if (role === 'user') return 'role-user';
        if (role === 'assistant') return 'role-assistant'; // Assign a class for assistant too
        return ''; // Default empty class
    };

    return (
        <div className="messages-container">
            {messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                    {/* Apply dynamic class to the span for color coding */}
                    <strong>
                        <span className={getRoleClass(m.role)}>{m.role}:</span>
                    </strong> 
                    {m.role === 'assistant' ? (
                        <div className="markdown-content">
                            {/* Added check for non-empty content before rendering Markdown */}
                            {m.content && <ReactMarkdown>{m.content}</ReactMarkdown>}
                        </div>
                    ) : (
                        // Also display system message content if any
                        <div className="user-content">{m.content}</div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChatMessages; 