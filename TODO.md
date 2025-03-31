# LlamaWire: Ollama Benchmarking Client Plan

## Core Client Features
### 0. Planning
- [ ] Make `TODO.md`
- [ ] Redesign file structure

### 1. Ollama Connection Configuration
- [ ] Add UI input field for Ollama server URL (e.g., `http://localhost:11434`)
- [ ] Store the URL in state and use it for API calls
- [ ] Add validation for the URL format
- [ ] Handle connection errors gracefully (display feedback to user)

### 2. Model Selection
- [ ] Fetch available models from the configured Ollama instance (`/api/tags`)
- [ ] Add a dropdown or selector in the UI to choose the model
- [ ] Use the selected model in API requests

### 3. Chat Interface
- [ ] Retain core chat functionality (sending messages, displaying history)
- [ ] Ensure streaming updates are efficient
- [ ] Review and optimize message history handling for `/api/chat`
- [ ] Add UI indicator for when the model is generating

### 4. Benchmarking Metrics & Display
- [ ] **Tokens Per Second (TPS):**
    - [ ] Review and potentially refine the current moving average calculation for accuracy
    - [ ] Display TPS prominently and update in real-time during streaming
- [ ] **Time To First Token (TTFT):**
    - [ ] Measure time from sending request to receiving the *first* content chunk
    - [ ] Display TTFT for each response
- [ ] **Total Generation Time:**
    - [ ] Measure time from sending request to receiving the *final* chunk (`done: true`)
    - [ ] Display total time for each response
- [ ] **Overall Latency:**
    - [ ] Consider measuring full round-trip time (including network)
- [ ] **UI Display:**
    - [ ] Design a clear section in the UI to display these metrics per response or aggregated.

### 5. Error Handling
- [ ] Improve handling of API errors from Ollama (e.g., model not found, connection issues)
- [ ] Display clear error messages to the user in the UI

### 6. Client Performance & Optimization
- [ ] Ensure React component rendering is optimized (e.g., use `useCallback`, `React.memo` where appropriate)
- [ ] Minimize frontend processing during generation to avoid impacting benchmarks
- [ ] Profile the application to identify any bottlenecks

### 7. Packaging & Deployment
- [ ] Review and update `Dockerfile` for easy containerization
- [ ] Ensure build process is streamlined (`npm run build` or `yarn build`)
- [ ] Add instructions in `README.md` on how to configure and run the client for benchmarking

### 8. UI/UX Improvements
- [ ] Add a button to clear chat history
- [ ] Improve layout for better readability of chat and metrics
- [ ] Consider theme options (light/dark based on existing logos?)

## Implementation Order Suggestion

1.  Implement Ollama URL configuration.
2.  Implement dynamic model selection.
3.  Refine chat interface and streaming.
4.  Implement TTFT and Total Generation Time metrics.
5.  Refine TPS calculation and UI display for all metrics.
6.  Improve error handling.
7.  Optimize client performance.
8.  Update packaging (`Dockerfile`) and documentation (`README.md`).
9.  Add general UI/UX improvements.

## Notes
- Focus on accuracy of benchmark metrics.
- Keep the client itself lightweight.
- Use modern React practices (Hooks).
