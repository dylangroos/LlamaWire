import React from 'react';

// Assuming you might move header-specific styles later
// import './Header.css';

// Receive tps as a prop
const Header = ({ tps, model }) => {
    return (
        <div className="flex flex-col items-center justify-center mt-2">
            <div className="w-16 h-12 overflow-hidden">
                <img src="/logo.png" alt="LlamaWire Logo" className="object-cover object-center w-full h-full" />
            </div>
            <h2 className="text-xl font-semibold text-gray-100 mt-2">
                LlamaWire 
                <span className="text-blue-300 ml-2">
                    {tps > 0 && `(${tps} tokens/sec)`}
                </span> 
                <span className="text-gray-400 ml-2">
                    {model}
                </span>
            </h2>
        </div>
    );
};

export default Header; 