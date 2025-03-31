import { useState, useRef, useEffect, useCallback } from 'react'
import './assets/App.css'
import Header from './components/Layout/Header'
import ChatMessages from './components/ChatInterface/ChatMessages'
import MessageInput from './components/ChatInterface/MessageInput'
import OllamaUrlInput from './components/Config/OllamaUrlInput'
import { streamChatCompletion } from './services/ollamaService'

// Import the custom hook
import { useTpsCalculator } from './hooks/useTpsCalculator'

export default function App() {
  const [messages, setMessages] = useState([{ role: "system", content: "Start chatting with Ollama..." }])
  const [model, setModel] = useState("gemma3")
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434')
  const [input, setInput] = useState("")

  // Use the custom hook for TPS calculation
  const { tps, recordChunk, resetCalculator: resetTpsCalculator } = useTpsCalculator()

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }
    
  const sendMessage = async () => {
    if (input.trim() === '') return

    // Reset TPS calculator using the function from the hook
    resetTpsCalculator()

    const userMessage = { role: "user", content: input }
    const currentMessages = [...messages, userMessage]
    const assistantPlaceholder = { role: 'assistant', content: '' }
    
    setMessages([...currentMessages, assistantPlaceholder])
    setInput("")

    const messagesPayload = currentMessages.filter(m => m.role !== "system")

    // Define callbacks for the service
    const handleChunk = ({ content, timestamp, count }) => {
        // Record chunk using the function from the hook
        recordChunk({ timestamp, count })

        // Update the last message (assistant's message) by appending the chunk
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
        // The hook automatically stops the interval when chunks stop arriving,
        // so we may not need to do anything extra here regarding TPS.
        // If we explicitly wanted to reset display to 0 on end, call resetTpsCalculator()
        console.log("Stream ended.")
    }

    const handleError = (error) => {
        console.error("Ollama service error:", error)
        setMessages(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: `Error: ${error.message}` }
        ])
        // Reset TPS calculator on error too
        resetTpsCalculator() 
    }

    // Call the service function
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