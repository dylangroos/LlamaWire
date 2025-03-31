/**
 * Calls the Ollama /api/chat endpoint and streams the response.
 * 
 * @param {string} baseUrl - The base URL of the Ollama API (e.g., http://localhost:11434).
 * @param {string} model - The name of the model to use.
 * @param {Array<object>} messagesPayload - The array of message objects to send.
 * @param {function} onChunk - Callback function called with { content, timestamp, count } for each message chunk received.
 * @param {function} onStreamEnd - Callback function called when the stream finishes successfully.
 * @param {function} onError - Callback function called if an error occurs during fetch or streaming.
 */
export const streamChatCompletion = async (baseUrl, model, messagesPayload, onChunk, onStreamEnd, onError) => {
    const apiUrl = `${baseUrl.replace(/\/$/, '')}/api/chat`; // Ensure no trailing slash

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: model,
                messages: messagesPayload,
                stream: true // Ensure streaming is requested
            })
        });

        if (!response.ok) {
            // Handle HTTP errors (e.g., 404, 500)
            const errorBody = await response.text();
            throw new Error(`HTTP error ${response.status}: ${errorBody || response.statusText}`);
        }

        if (!response.body) {
            throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                // Signal stream end
                if (onStreamEnd) onStreamEnd();
                break;
            }

            buffer += decoder.decode(value, { stream: true });

            let boundary = buffer.indexOf('\n');
            while (boundary !== -1) {
                const jsonLine = buffer.substring(0, boundary);
                buffer = buffer.substring(boundary + 1);

                try {
                    if (jsonLine.trim()) { // Avoid parsing empty lines
                        const parsedJson = JSON.parse(jsonLine);
                        if (parsedJson.message && parsedJson.message.content) {
                            const chunkContent = parsedJson.message.content;
                            const chunkTokenCount = chunkContent.length; // Approx tokens
                            const timestamp = performance.now();
                            // Send chunk data back to the caller
                            if (onChunk) onChunk({ content: chunkContent, timestamp, count: chunkTokenCount });
                        } else if (parsedJson.done && parsedJson.done === true) {
                             // Ollama might send a final status object when done is true
                             // We already handle done via reader.read(), but good to be aware
                        }
                    }
                } catch (parseError) {
                    console.error("Failed to parse JSON chunk:", jsonLine, parseError);
                    // Depending on policy, you might want to call onError here or just log
                }
                boundary = buffer.indexOf('\n');
            }
        }

    } catch (error) {
        console.error("Error during fetch or streaming:", error);
        if (onError) onError(error);
    }
}; 