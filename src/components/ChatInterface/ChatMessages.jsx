import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

// Assuming you might move message-specific styles later
// import './ChatMessages.css';

// Receive messages array as a prop
const ChatMessages = ({ messages }) => {
    const messagesEndRef = useRef(null);

    // Helper function to determine the Tailwind classes based on role
    const getRoleClasses = (role) => {
        if (role === 'system') return 'text-red-300';
        if (role === 'user') return 'text-blue-300';
        if (role === 'assistant') return 'text-green-300';
        return ''; // Default empty class
    };

    // Function to determine message container styling
    const getMessageClasses = (role) => {
        const baseClasses = 'mb-3 p-4 rounded-lg shadow-sm';
        
        if (role === 'user') {
            return `${baseClasses} bg-blue-900 ml-6 rounded-tl-sm`;
        } else if (role === 'assistant') {
            return `${baseClasses} bg-gray-800 mr-6 rounded-tr-sm`;
        } else if (role === 'system') {
            return `${baseClasses} bg-gray-900 italic opacity-90`;
        }
        
        return baseClasses;
    };

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    // Custom components for React Markdown (without the syntax highlighter)
    const components = {
        // Style code blocks without external syntax highlighter
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <pre className={`language-${match[1]}`}>
                    <code className={className} {...props}>
                        {children}
                    </code>
                </pre>
            ) : (
                <code className="bg-gray-700 text-gray-200 px-1 py-0.5 rounded text-sm" {...props}>
                    {children}
                </code>
            );
        },
        // Style headings
        h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-100">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3 text-gray-100">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2 text-gray-100">{children}</h3>,
        // Style paragraphs
        p: ({ children }) => <p className="my-3 text-gray-200">{children}</p>,
        // Style lists
        ul: ({ children }) => <ul className="list-disc pl-6 my-3 text-gray-200">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 my-3 text-gray-200">{children}</ol>,
        // Style links
        a: ({ href, children }) => (
            <a href={href} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        ),
        // Style blockquotes
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-600 pl-4 py-2 my-3 bg-gray-700/30 rounded-r text-gray-300">
                {children}
            </blockquote>
        ),
        // Style tables
        table: ({ children }) => (
            <div className="overflow-x-auto my-4">
                <table className="min-w-full bg-gray-700/30 rounded-lg overflow-hidden">
                    {children}
                </table>
            </div>
        ),
        thead: ({ children }) => <thead className="bg-gray-700/50">{children}</thead>,
        th: ({ children }) => <th className="px-4 py-2 text-left text-gray-200 font-semibold">{children}</th>,
        td: ({ children }) => <td className="border-t border-gray-700 px-4 py-2 text-gray-300">{children}</td>,
    };

    return (
        <div className="h-full overflow-y-auto p-4 pt-14 lg:pt-4 scroll-smooth">
            {messages.map((m, i) => (
                <div key={i} className={getMessageClasses(m.role)}>
                    <strong className="font-semibold mr-2">
                        <span className={getRoleClasses(m.role)}>{m.role}:</span>
                    </strong> 
                    {m.role === 'assistant' ? (
                        <div className="mt-2 prose prose-invert prose-sm max-w-none">
                            {m.content && (
                                <ReactMarkdown components={components}>
                                    {m.content}
                                </ReactMarkdown>
                            )}
                        </div>
                    ) : (
                        <div className="mt-2 text-gray-100">{m.content}</div>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages; 