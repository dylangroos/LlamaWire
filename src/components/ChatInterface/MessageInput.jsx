import React, { useRef, useEffect } from 'react';

// Assuming you might move input-specific styles later
// import './MessageInput.css';

// Receive props for state and event handlers from App.jsx
const MessageInput = ({ input, setInput, handleKeyDown, sendMessage, disabled }) => {
    const textareaRef = useRef(null);
    
    // Resize the textarea based on content
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [input]);
    
    // Handle special key presses
    const handleKeys = (e) => {
        // Allow shift+enter for new lines
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleKeyDown(e);
        }
    };
    
    return (
        <div className="flex items-center gap-2 w-full">
            <div className="flex-1 relative">
                <textarea 
                    ref={textareaRef}
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeys}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    className="w-full px-4 py-3 rounded-md border border-gray-700 outline-none text-sm bg-gray-800 text-gray-100 
                    transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 
                    disabled:opacity-50 resize-none min-h-[52px] max-h-[200px] font-mono"
                    disabled={disabled}
                    rows={1}
                />
                {input.includes('```') && (
                    <div className="absolute top-1 right-2 text-xs text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Code Mode
                    </div>
                )}
            </div>
            <button 
                onClick={sendMessage}
                className="px-5 py-3 rounded-md text-sm font-medium bg-blue-600 text-white cursor-pointer transition-colors hover:bg-blue-700 active:transform active:translate-y-px disabled:opacity-50 disabled:pointer-events-none"
                disabled={disabled}
            >
                Send
            </button> 
        </div>
    );
};

export default MessageInput; 