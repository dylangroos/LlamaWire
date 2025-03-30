# LlamaWire 🦙⚡️

<p align="center"><img src="logo.png" alt="LlamaWire Logo" width="100"></p>

A simple web-based chat interface that connects to a locally running Ollama instance and streams responses in real-time. Features a basic tokens-per-second calculation during streaming.

## Features

*   Chat with Ollama models.
*   Real-time streaming of responses.
*   Moving average tokens-per-second display during streaming.

## Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
*   A running [Ollama](https://ollama.com/) instance with a downloaded model (e.g., `phi4`).
    *   Make sure the Ollama API is accessible (usually at `http://localhost:11434`).

## Setup & Running

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <your-repository-url>
    cd LlamaWire
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Ensure Ollama is Running:**
    Start your Ollama application and make sure the model you want to use (specified in `src/App.jsx`, currently `phi4`) is available.

4.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    This will typically start the application on `http://localhost:5173` (or another port specified by your Vite config).

5.  **Open your browser** and navigate to the provided local URL. Start chatting!

## Configuration

*   The Ollama model used can be changed in `src/App.jsx` within the `fetch` call (`model: "phi4"`).
*   The Ollama API endpoint is currently hardcoded to `http://localhost:11434/api/chat` in `src/App.jsx`.
