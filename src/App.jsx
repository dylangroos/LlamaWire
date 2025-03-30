import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

export default function App() {
  const [messages, setMessages] = useState([{ role: "system", content: "Start chatting with Ollama..." }])
  const [model, setModel] = useState("phi4")
  const [input, setInput] = useState("")
  const [tps, setTps] = useState(0); // State for tokens per second
  const startTimeRef = useRef(null); // Ref for start time
  const recentChunksRef = useRef([]); // Ref to store {timestamp, count} for moving average
  const intervalIdRef = useRef(null); // Ref to store interval ID

  // Function to calculate and update moving average TPS
  const updateMovingAverageTPS = useCallback(() => {
    const now = performance.now();
    const windowDuration = 1000; // 2-second window
    const windowStartTime = now - windowDuration;

    // Filter chunks within the window
    recentChunksRef.current = recentChunksRef.current.filter(
      chunk => chunk.timestamp >= windowStartTime
    );

    if (recentChunksRef.current.length === 0) {
      setTps(0);
      return;
    }

    // Calculate total tokens in the window
    const tokensInWindow = recentChunksRef.current.reduce((sum, chunk) => sum + chunk.count, 0);

    // Calculate actual time span covered by chunks in the window
    const oldestTimestamp = recentChunksRef.current[0].timestamp;
    const actualDuration = now - oldestTimestamp; // Time since the oldest chunk in window
    const effectiveDurationMs = Math.max(actualDuration, 1); // Avoid division by zero, use at least 1ms

    const currentTps = (tokensInWindow / (effectiveDurationMs / 1000)).toFixed(1);
    setTps(currentTps);
  }, []); // No dependencies, relies on refs and sets state

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
          e.preventDefault(); // Prevent default Enter behavior (like newline)
          sendMessage();
      }
  };

  const sendMessage = async () => {
    // Prevent sending empty messages
    if (input.trim() === '') return;

    // Reset TPS calculation state
    setTps(0);
    startTimeRef.current = null;
    recentChunksRef.current = []; // Clear recent chunks
    // Clear any existing interval from previous runs
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    const userMessage = { role: "user", content: input };
    const assistantPlaceholder = { role: 'assistant', content: '' };
    // Combine adding user message and placeholder into one update
    setMessages(prev => [...prev, userMessage, assistantPlaceholder]);
    setInput("")

    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model, // Or whatever model is running
        // Send messages up to the user's latest message
        messages: messages.concat(userMessage).filter(m => m.role !== "system") 
      })
    })
    const reader = res.body.getReader()
    const decoder = new TextDecoder("utf-8")
    let buffer = ''; // Buffer to hold incomplete JSON lines

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // Append the decoded chunk to the buffer
      buffer += decoder.decode(value);

      // Process buffer line by line
      let boundary = buffer.indexOf('\n');
      while (boundary !== -1) {
        const jsonLine = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 1); // Update buffer with the remainder

        try {
          const parsedJson = JSON.parse(jsonLine);
          if (parsedJson.message && parsedJson.message.content) {
            const chunkContent = parsedJson.message.content;
            const chunkTokenCount = chunkContent.length; // Approx tokens = characters
            const timestamp = performance.now();

            // Record chunk for moving average calculation
            recentChunksRef.current.push({ timestamp, count: chunkTokenCount });

            // Start timer and interval on first valid chunk
            if (startTimeRef.current === null) {
              startTimeRef.current = timestamp; // Use the actual chunk timestamp
              // Start interval if not already running
              if (!intervalIdRef.current) {
                  intervalIdRef.current = setInterval(updateMovingAverageTPS, 500); // Update every 500ms
              }
            }

            // Update the last message (assistant's message) by assigning the content chunk
            setMessages(prev => {
              // Create a new array without mutating the original
              const newMessages = prev.slice(0, -1); // All messages except the last one
              const lastMessage = prev[prev.length - 1];

              // Ensure lastMessage exists and has a content property
              if (lastMessage && typeof lastMessage.content !== 'undefined') {
                  // Create a *new* last message object with appended content
                  const updatedLastMessage = {
                      ...lastMessage, // Copy properties from the old last message
                      content: lastMessage.content + chunkContent // Append chunk
                  };
                  newMessages.push(updatedLastMessage); // Add the new last message to the array
              } else {
                  // If something went wrong, just push the original last message back
                  newMessages.push(lastMessage);
              }
              return newMessages; // Return the completely new array
            })
          }
        } catch (error) {
          console.error("Failed to parse JSON chunk:", jsonLine, error);
          // Handle potential JSON parsing errors if necessary
        }

        boundary = buffer.indexOf('\n'); // Check for next newline in the updated buffer
      }
    }

    // Stream finished, clear the interval and reset TPS display
    if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
    }
  }

  return (
    <div className="app-container">
        {/* Header Section */}
        <div className="header">
            <img src="/logo.png" alt="LlamaWire Logo" />
            <h2>LlamaWire <span className="tps-display">{tps > 0 && `(${tps} tokens/sec)`}</span></h2>
            <div></div>
        </div>

        {/* Messages Section */}
        <div className="messages-container">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                  <strong>{m.role}:</strong>
                  {m.role === 'assistant' ? (
                      <div className="markdown-content">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                  ) : (
                      m.content
                  )}
              </div>
            ))}
        </div>

        {/* Input Section */}
        <div className="input-area">
            <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    </div>
  )
}
