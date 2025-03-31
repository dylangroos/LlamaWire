import React from 'react';

// Assuming styles might be added later or handled globally
// import './ModelSelector.css';

// Props:
// - models: Array of available model objects (from /api/tags).
// - selectedModel: The currently selected model name string.
// - setSelectedModel: Function to update the selected model state in the parent.
// - isLoading: Boolean indicating if models are currently being fetched.
// - error: Potential error message string if fetching failed.
const ModelSelector = ({ models = [], selectedModel, setSelectedModel, isLoading, error }) => {

    const handleChange = (event) => {
        setSelectedModel(event.target.value);
    };

    return (
        <div className="model-selector-container">
            <label htmlFor="model-select">Model:</label>
            <select 
                id="model-select"
                name="model-select"
                value={selectedModel}
                onChange={handleChange}
                disabled={isLoading || error}
                style={{ marginLeft: '8px', padding: '4px', minWidth: '150px' }} 
            >
                {isLoading && <option value="" disabled>Loading models...</option>}
                {error && <option value="" disabled>Error loading models</option>}
                {!isLoading && !error && models.length === 0 && <option value="" disabled>No models found</option>}
                {!isLoading && !error && models.map((model) => (
                    <option key={model.digest} value={model.name}>
                        {model.name}
                    </option>
                ))}
            </select>
            {/* Optionally display the error message */}
            {/* {error && <span style={{ color: 'red', marginLeft: '10px' }}>{error}</span>} */}
        </div>
    );
};

export default ModelSelector; 