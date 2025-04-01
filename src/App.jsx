import { useState, useRef, useEffect, useCallback } from 'react'
import './styles.css' // Import the new styles file
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 z-30 transition duration-300 ease-in-out bg-gray-800 w-64 flex flex-col`}>
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
              <img src="/logo.png" alt="LlamaWire Logo" className="object-cover object-center w-full h-full" />
          <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">Configuration</h3>
            <div className="space-y-4">
              <OllamaUrlInput ollamaUrl={ollamaUrl} setOllamaUrl={setOllamaUrl} />
              <ModelSelector 
                models={availableModels}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                isLoading={isLoadingModels}
                error={modelError}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-sm text-gray-400">
              {tps > 0 && <div className="mt-2">Speed: {tps} tokens/sec</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden absolute top-4 left-4 z-20 p-2 rounded-md bg-gray-800 text-gray-400 hover:text-gray-200 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Chat section that fills the screen */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ChatMessages messages={messages} />
          </div>
          
          <div className="p-4 border-t border-gray-800">
            <MessageInput 
              input={input} 
              setInput={setInput} 
              handleKeyDown={handleKeyDown} 
              sendMessage={sendMessage} 
              disabled={!selectedModel || isLoadingModels}
            />
          </div>
        </div>
      </div>
    </div>
  )
}