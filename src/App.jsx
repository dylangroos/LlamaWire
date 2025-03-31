import { useState, useRef, useEffect, useCallback } from 'react'
import './assets/App.css'
import Header from './components/Layout/Header'
import ChatMessages from './components/ChatInterface/ChatMessages'
import MessageInput from './components/ChatInterface/MessageInput'
import OllamaUrlInput from './components/Config/OllamaUrlInput'
import ModelSelector from './components/Config/ModelSelector'
import { streamChatCompletion, getAvailableModels } from './services/ollamaService'

// Import the custom hook
import { useTpsCalculator } from './hooks/useTpsCalculator'

// Import the history utility
import { saveTpsRecord } from './utils/historyUtils';

export default function App() {
  const [messages, setMessages] = useState([{ role: "system", content: "Start chatting with Ollama..." }])
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434')
  const [input, setInput] = useState("")

  // Use the custom hook for TPS calculation
  const { tps, recordChunk, resetCalculator: resetTpsCalculator } = useTpsCalculator()

  // Ref to store the input used for the current query
  const currentQueryInputRef = useRef("");

  // State for models
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(""); // Start with no model selected
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState(null);

  // Effect to fetch models when Ollama URL changes
  useEffect(() => {
    if (!ollamaUrl) return; // Don't fetch if URL is empty

    const fetchModels = async () => {
      setIsLoadingModels(true);
      setModelError(null);
      setAvailableModels([]); // Clear previous models
      setSelectedModel("");   // Reset selected model
      try {
        const models = await getAvailableModels(ollamaUrl);
        setAvailableModels(models);
        // Optionally, select the first model by default if available
        if (models.length > 0) {
          setSelectedModel(models[0].name);
        } else {
           setModelError("No models found at this URL.");
        }
      } catch (error) {
        // The service already logs errors, just set the error state
        setModelError("Failed to fetch models. Check URL and Ollama status.");
      } finally {
        setIsLoadingModels(false);
      }
    };

    // Debounce fetching slightly to avoid spamming on rapid typing
    const timeoutId = setTimeout(fetchModels, 500);
    return () => clearTimeout(timeoutId); // Cleanup timeout on URL change or unmount

  }, [ollamaUrl]); // Re-run effect when ollamaUrl changes

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }
    
  const sendMessage = async () => {
    const currentInput = input.trim();
    if (currentInput === '' || !selectedModel) { // Also check if a model is selected
         console.warn("Cannot send message: Empty input or no model selected.");
         return;
    }

    currentQueryInputRef.current = currentInput;
    resetTpsCalculator()

    const userMessage = { role: "user", content: currentInput }
    const currentMessages = [...messages, userMessage]
    const assistantPlaceholder = { role: 'assistant', content: '' }
    
    setMessages([...currentMessages, assistantPlaceholder])
    setInput("")

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
        const finalTps = tps;
        saveTpsRecord({
            query: currentQueryInputRef.current,
            model: selectedModel, // Use selectedModel state
            tps: finalTps,
            timestamp: new Date().toISOString(),
            ollamaUrl: ollamaUrl
        });
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
        selectedModel, // Use selectedModel state
        messagesPayload, 
        handleChunk, 
        handleStreamEnd, 
        handleError
    )
  }

  return (
    <div className="app-container">
        {/* Configuration Section */}
        <div style={{ padding: '10px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap'}}> 
          <OllamaUrlInput ollamaUrl={ollamaUrl} setOllamaUrl={setOllamaUrl} />
          <ModelSelector 
            models={availableModels}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            isLoading={isLoadingModels}
            error={modelError}
          />
        </div>

        {/* Pass selectedModel to Header if needed, or just tps */}
        <Header tps={tps} /> 

        <ChatMessages messages={messages} />

        <MessageInput 
            input={input} 
            setInput={setInput} 
            handleKeyDown={handleKeyDown} 
            sendMessage={sendMessage} 
            disabled={!selectedModel || isLoadingModels} // Disable input if no model or loading
        />
        
        {/* Only render history display if needed */}
        {/* <HistoryDisplay /> */} 
    </div>
  )
}