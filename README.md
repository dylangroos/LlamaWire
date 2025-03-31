# LlamaWire 🦙⚡️ # Under Construction...

<p align="center"><img src="public/dark-logo.png" alt="LlamaWire Logo" width="500"></p>

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

## Running with Docker (Recommended)

If you have Docker installed, you can run LlamaWire directly from the pre-built image available on Docker Hub. This is the easiest way to get started without needing Node.js installed locally.

1.  **Ensure Ollama is Running:**
    Make sure your Ollama instance is running and accessible from your network. If you are running Docker on the same machine as Ollama, note the following:
    *   **Linux:** Use the host IP address or `host.docker.internal` if configured.
    *   **macOS/Windows (Docker Desktop):** You can often use the special DNS name `host.docker.internal` to refer to your host machine from within the container. For example, your Ollama endpoint might be `http://host.docker.internal:11434`.
    *   You will need to configure the Ollama URL within the LlamaWire application once it's running (this feature needs to be added). Currently, it defaults to `http://localhost:11434`, which *will not work* from inside the container unless Ollama itself is also running in a container on the same Docker network.

2.  **Pull the latest image:**
    ```bash
    docker pull groos12/llama-wire:latest
    ```

3.  **Run the container:**
    ```bash
    # Map port 8080 on your machine to port 80 in the container
    docker run --rm -p 8080:80 groos12/llama-wire:latest
    ```
    *   `--rm`: Automatically removes the container when it stops.
    *   `-p 8080:80`: Maps port `8080` on your host to port `80` (where Nginx runs) in the container. You can change `8080` if that port is busy (e.g., `-p 3001:80`).

4.  **Open your browser** and navigate to `http://localhost:8080` (or the host port you chose).

## Configuration

*   The Ollama model used can be changed in `src/App.jsx` within the `fetch` call (`model: "phi4"`).
*   The Ollama API endpoint is currently hardcoded to `http://localhost:11434/api/chat` in `src/App.jsx`.
    *   **Docker Note:** When running LlamaWire in Docker, `localhost` refers to the *container itself*, not your host machine. You need to use the appropriate network address for your Ollama instance (e.g., `http://host.docker.internal:11434` for Docker Desktop, or the host's IP address). An upcoming feature will allow configuring this URL in the UI.

[![Docker Pulls](https://img.shields.io/docker/pulls/groos12/llama-wire.svg)](https://hub.docker.com/r/groos12/llama-wire)
