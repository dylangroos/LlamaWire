import React, { useState, useEffect } from 'react';
import { getTpsHistory } from '../../utils/historyUtils'; // Adjust path as needed

// Assuming styles might be added later or handled globally
// import './HistoryDisplay.css';

const HistoryDisplay = () => {
    const [historyData, setHistoryData] = useState([]);

    // Load history from localStorage when the component mounts
    useEffect(() => {
        const loadedHistory = getTpsHistory();
        // Reverse to show newest first (optional)
        setHistoryData(loadedHistory.reverse()); 
    }, []); // Empty dependency array means this runs once on mount

    // Helper to format timestamp (optional)
    const formatTimestamp = (isoString) => {
        try {
            return new Date(isoString).toLocaleString();
        } catch (e) {
            return isoString; // Fallback
        }
    };

    return (
        <div className="history-display-container" style={{ margin: '20px', padding: '15px', border: '1px solid #ccc', maxHeight: '400px', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>TPS History</h3>
            {historyData.length === 0 ? (
                <p>No history recorded yet.</p>
            ) : (
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {historyData.map((record, index) => (
                        <li key={index} style={{ borderBottom: '1px dashed #eee', marginBottom: '10px', paddingBottom: '10px' }}>
                            <div><strong>Timestamp:</strong> {formatTimestamp(record.timestamp)}</div>
                            <div><strong>Model:</strong> {record.model}</div>
                            <div><strong>URL:</strong> {record.ollamaUrl || 'N/A'}</div>
                            <div><strong>TPS:</strong> {record.tps}</div>
                            <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                <strong>Query:</strong> {record.query}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
             {/* TODO: Add a button to clear history? */}
        </div>
    );
};

export default HistoryDisplay; 