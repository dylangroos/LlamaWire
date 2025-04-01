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
        <div className="space-y-2">
            <label htmlFor="model-select" className="block text-sm text-gray-400">Model:</label>
            <select 
                id="model-select"
                name="model-select"
                value={selectedModel}
                onChange={handleChange}
                disabled={isLoading || error}
                className="w-full px-3 py-2 rounded text-sm bg-gray-700 border border-gray-600 text-gray-200 focus:outline-none focus:border-blue-500 disabled:opacity-60"
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
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default ModelSelector; 