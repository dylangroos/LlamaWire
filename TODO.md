# LlamaWire: Ollama Hardware Benchmarking Client

## Core Client Features

### 0. Project Setup & Planning
- [x] Create initial `TODO.md`
- [x] Design and implement new file structure
- [x] Refactor UI into components (`Header`, `ChatMessages`, `MessageInput`)
- [x] Refactor API calls into `ollamaService.js`
- [x] Refactor TPS calculation into `useTpsCalculator` hook
- [x] Setup basic testing with Vitest (`Header`, `MessageInput`)
- [x] Setup GitHub Actions CI workflow to run tests

### 1. Ollama Connection Configuration
- [x] Add `OllamaUrlInput.jsx` component
- [x] Add state in `App.jsx` for URL
- [x] Use configured URL for API calls in `ollamaService.js`
- [ ] *Future:* Add validation for the URL format
- [ ] *Future:* Add better connection error handling/feedback for URL input

### 2. Model Selection
- [x] Add `getAvailableModels` function to `ollamaService.js`
- [x] Add `ModelSelector.jsx` component
- [x] Add state in `App.jsx` for available/selected models
- [x] Implement `useEffect` in `App.jsx` to fetch models on URL change
- [x] Use selected model for `/api/chat` calls
- [x] Handle loading/error states for model fetching

### 3. Core Chat Interface
- [x] Retain core chat functionality (sending messages, displaying history)
- [x] Ensure streaming updates are reasonably efficient (basic implementation done)
- [ ] Review and potentially optimize message history handling (e.g., performance with very long histories)
- [ ] Add UI indicator for when the model is actively generating/streaming

### 4. Benchmarking Metrics & Display
- [x] **Tokens Per Second (TPS):**
    - [x] Implement moving average calculation (`useTpsCalculator`)
    - [x] Display TPS in `Header` during streaming
    - [ ] *Future:* Review and potentially refine the accuracy/method of TPS calculation (e.g., tokenization method, windowing strategy)
- [ ] **Time To First Token (TTFT):**
    - [ ] Measure time from sending request to receiving the *first* content chunk in `ollamaService.js` or `App.jsx`
    - [ ] Add state in `App.jsx` to hold TTFT for the last response
    - [ ] Display TTFT (e.g., below the chat, in history)
- [ ] **Total Generation Time:**
    - [ ] Measure time from sending request to `handleStreamEnd` being called
    - [ ] Add state in `App.jsx` to hold total time for the last response
    - [ ] Display Total Time
- [ ] **UI Display:**
    - [ ] Design/implement a dedicated `MetricsDisplay.jsx` component to show TTFT, Total Time, etc., clearly.
- [x] **History:**
    - [x] Add `historyUtils.js` to save results (query, model, tps, url, timestamp) to `localStorage`
    - [x] Call `saveTpsRecord` on stream end
    - [x] Create `HistoryDisplay.jsx` boilerplate to show history
    - [ ] Integrate `HistoryDisplay.jsx` into `App.jsx` UI
    - [ ] Add "Clear History" functionality to `HistoryDisplay.jsx`

### 5. Error Handling
- [x] Basic error display for chat (`handleError` in `App.jsx`)
- [x] Basic error state for model fetching (`modelError` in `App.jsx`)
- [ ] Improve user feedback for different API/network errors (e.g., specific messages for connection refused vs. model not found)

### 6. Client Performance & Optimization
- [x] Use `useCallback` in hook and relevant places
- [ ] Review component rendering for optimizations (`React.memo`?)
- [ ] Minimize frontend processing during generation (ongoing concern)
- [ ] Profile application if performance issues arise

### 7. Packaging & Deployment
- [x] Create multi-stage `Dockerfile` using Nginx
- [x] Fix Docker build issues (file copying)
- [x] Enable multi-platform builds (`buildx`)
- [x] Add Docker run instructions to `README.md`
- [x] Link `README.md` to Docker Hub description (manual step on Docker Hub)

### 8. UI/UX Improvements
- [x] Add role-based color coding for messages
- [ ] Add button to clear chat history
- [ ] Improve overall layout/styling for chat, config, metrics, and history display.
- [ ] Consider theme options (light/dark)
- [ ] Add favicon? (Currently default Vite)

## High Priority Next Steps

1.  Integrate `HistoryDisplay.jsx` into `App.jsx` UI.
2.  Implement TTFT and Total Generation Time metrics.
3.  Design and implement `MetricsDisplay.jsx` component.
4.  Refine error handling and user feedback.
5.  Improve overall styling and layout.

## Notes
- Primary focus is **accurate hardware benchmarking** via interaction.
- Keep the client itself lightweight to avoid skewing results.
- Continue using modern React practices.
