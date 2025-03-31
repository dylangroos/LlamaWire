import React from 'react';

// Assuming styles might be added later or handled globally
// import './OllamaUrlInput.css';
// TODO: implement this
// Props: 
// - ollamaUrl: current URL string value
// - setOllamaUrl: function to update the URL state in the parent
const OllamaUrlInput = ({ ollamaUrl, setOllamaUrl }) => {
    
    const handleChange = (event) => {
        // Update the state in the parent component whenever the input changes
        setOllamaUrl(event.target.value);
    };

    return (
        <div className="ollama-url-input-container">
            <label htmlFor="ollama-url">Ollama URL:</label>
            <input 
                type="text" // Or type="url" for slightly better semantics/mobile keyboards
                id="ollama-url"
                name="ollama-url"
                value={ollamaUrl} 
                onChange={handleChange} 
                placeholder="http://localhost:11434" // Example placeholder
                // Basic styling example (inline, consider moving to CSS)
                style={{ marginLeft: '8px', padding: '4px', width: '250px' }} 
            />
            {/* You could add validation feedback here later */}
        </div>
    );
};

export default OllamaUrlInput;
