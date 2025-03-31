import { useState, useRef, useEffect, useCallback } from 'react'
import './assets/App.css'
import Header from './components/Layout/Header'
import ChatMessages from './components/ChatInterface/ChatMessages'
import MessageInput from './components/ChatInterface/MessageInput'
import OllamaUrlInput from './components/Config/OllamaUrlInput'
import { streamChatCompletion } from './services/ollamaService'

// Import the custom hook
import { useTpsCalculator } from './hooks/useTpsCalculator'

// Import the history utility
import { saveTpsRecord } from './utils/historyUtils';

export default function App() {
  const [messages, setMessages] = useState([{ role: "system", content: "Start chatting with Ollama..." }])
  const [model, setModel] = useState("gemma3")
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434')
  const [input, setInput] = useState("")

  // Use the custom hook for TPS calculation
  const { tps, recordChunk, resetCalculator: resetTpsCalculator } = useTpsCalculator()

  // Ref to store the input used for the current query
  const currentQueryInputRef = useRef("");

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }
    
  const sendMessage = async () => {
    const currentInput = input.trim(); // Capture input before clearing
    if (currentInput === '') return;

    currentQueryInputRef.current = currentInput; // Store the input for later saving

    resetTpsCalculator()

    const userMessage = { role: "user", content: currentInput }
    const currentMessages = [...messages, userMessage]
    const assistantPlaceholder = { role: 'assistant', content: '' }
    
    setMessages([...currentMessages, assistantPlaceholder])
    setInput("") // Clear input field now

    const messagesPayload = currentMessages.filter(m => m.role !== "system")

    const handleChunk = ({ content, timestamp, count }) => {
        recordChunk({ timestamp, count })
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1]
            if (lastMessage && lastMessage.role === 'assistant') { 
                 const updatedLastMessage = {
                    ...lastMessage,
                    content: lastMessage.content + content
                }
                return [...prev.slice(0, -1), updatedLastMessage]
            } 
            return prev
        })
    }

    const handleStreamEnd = () => {
        console.log("Stream ended.")
        // Save the record to localStorage
        const finalTps = tps; // Capture the TPS value at the end of the stream
        saveTpsRecord({
            query: currentQueryInputRef.current, // Use the stored input
            model: model,
            tps: finalTps,
            timestamp: new Date().toISOString(), // Add a timestamp
            ollamaUrl: ollamaUrl // Optionally store the URL used
        });
        // Optional: Maybe call resetTpsCalculator() here if you want the display to reset immediately after saving?
    }

    const handleError = (error) => {
        console.error("Ollama service error:", error)
        setMessages(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: `Error: ${error.message}` }
        ])
        resetTpsCalculator() 
    }

    await streamChatCompletion(
        ollamaUrl, 
        model, 
        messagesPayload, 
        handleChunk, 
        handleStreamEnd, 
        handleError
    )
  }

  return (
    <div className="app-container">
        <div style={{ padding: '10px'}}>
          <OllamaUrlInput ollamaUrl={ollamaUrl} setOllamaUrl={setOllamaUrl} />
        </div>
        {/* Pass tps value from the hook to the Header */}
        <Header tps={tps} model={model} />
        {/* Use the ChatMessages component, passing messages as a prop */}
        <ChatMessages messages={messages} />
        {/* Use the MessageInput component */}
        <MessageInput 
            input={input} 
            setInput={setInput} 
            handleKeyDown={handleKeyDown} 
            sendMessage={sendMessage} 
        />
    </div>
  )
}