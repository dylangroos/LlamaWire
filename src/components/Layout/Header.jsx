import React from 'react';

// Assuming you might move header-specific styles later
// import './Header.css';

// Receive tps as a prop
const Header = ({ tps }) => {
    return (
        <div className="header">
            <img src="/logo.png" alt="LlamaWire Logo" />
            {/* Display TPS passed via props */}
            <h2>LlamaWire <span className="tps-display">{tps > 0 && `(${tps} tokens/sec)`}</span></h2>
            {/* This div seems empty, might be for layout? Keeping it for now. */}
            <div></div> 
        </div>
    );
};

export default Header; 