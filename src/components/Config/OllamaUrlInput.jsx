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
        <div className="space-y-2">
            <label htmlFor="ollama-url" className="block text-sm text-gray-400">Ollama URL:</label>
            <input 
                type="text"
                id="ollama-url"
                name="ollama-url"
                value={ollamaUrl} 
                onChange={handleChange} 
                placeholder="http://localhost:11434"
                className="w-full px-3 py-2 rounded text-sm bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:border-blue-500"
            />
            {/* You could add validation feedback here later */}
        </div>
    );
};

export default OllamaUrlInput;
