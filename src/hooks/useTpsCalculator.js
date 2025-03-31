import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom Hook to calculate and manage Tokens Per Second (TPS) based on streaming data.
 * 
 * Returns:
 * - tps: The current calculated TPS value (string, formatted to 1 decimal place).
 * - recordChunk: Function to call with { timestamp, count } for each received data chunk.
 * - resetCalculator: Function to call to reset the calculation state (e.g., before a new stream starts).
 */
export const useTpsCalculator = (updateIntervalMs = 500, windowDurationMs = 1000) => {
    const [tps, setTps] = useState(0);
    const startTimeRef = useRef(null);
    const recentChunksRef = useRef([]);
    const intervalIdRef = useRef(null);

    // Function to update the TPS state based on chunks in the moving window
    const updateMovingAverageTPS = useCallback(() => {
        const now = performance.now();
        const windowStartTime = now - windowDurationMs;

        // Filter chunks within the window
        recentChunksRef.current = recentChunksRef.current.filter(
            chunk => chunk.timestamp >= windowStartTime
        );

        if (recentChunksRef.current.length === 0) {
            // Remove log
            if (tps !== 0) {
                setTps(0);  
            }
            // Stop interval if no data points are left in the window
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
            startTimeRef.current = null; // Reset start time too
            return;
        }

        // Calculate total tokens and actual duration covered by chunks in the window
        const tokensInWindow = recentChunksRef.current.reduce((sum, chunk) => sum + chunk.count, 0);
        const oldestTimestamp = recentChunksRef.current[0].timestamp;
        const actualDuration = now - oldestTimestamp; 
        const effectiveDurationMs = Math.max(actualDuration, 1); // Avoid division by zero

        const currentTps = (tokensInWindow / (effectiveDurationMs / 1000)).toFixed(1);
        
        // Remove log
        setTps(currentTps);

    }, [windowDurationMs, tps]);

    // Function to record a new chunk
    const recordChunk = useCallback(({ timestamp, count }) => {
        // Remove log

        recentChunksRef.current.push({ timestamp, count });

        // Start timer and interval on the very first chunk of a stream
        if (startTimeRef.current === null) {
            startTimeRef.current = timestamp;
        }
        // Start the interval if it's not already running
        if (!intervalIdRef.current) {
            intervalIdRef.current = setInterval(updateMovingAverageTPS, updateIntervalMs);
        }
    }, [updateMovingAverageTPS, updateIntervalMs]);

    // Function to reset the calculator state
    const resetCalculator = useCallback(() => {
        setTps(0);
        startTimeRef.current = null;
        recentChunksRef.current = [];
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
    }, []);

    // Effect for cleaning up the interval when the component using the hook unmounts
    useEffect(() => {
        // Return the cleanup function
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, []); // Empty dependency array ensures this runs only on mount and unmount

    // Return the state and control functions
    return { tps, recordChunk, resetCalculator };
}; 