# Multi-LLM Chat

A React chat app that lets you talk to models from several AI providers in one interface. You can switch between Google Gemini, OpenAI, Anthropic Claude, DeepSeek and xAI Grok from a dropdown, keep several conversations at once, and watch replies stream in as they are generated.

Built with React 19 and Vite.

## Features

- **Multiple providers.** Pick a model from the assistant dropdown. You can switch models in the middle of a conversation.
- **Streaming replies.** Responses appear token by token.
- **Multiple chats.** Start a new chat from the sidebar and switch between earlier ones. Each chat is titled with the first few words of its first message.
- **Markdown rendering.** Assistant replies are rendered as Markdown.
- **Light, dark and system themes.**
- **Responsive layout.** On small screens the sidebar collapses behind a menu button.

## Supported models

| Provider  | Models                          | Environment variable         |
| --------- | ------------------------------- | ---------------------------- |
| Google AI | Gemini 2.5 Flash, Gemini 2.5 Pro | `VITE_GOOGLE_AI_API_KEY`    |
| OpenAI    | GPT-4o mini, ChatGPT-4o         | `VITE_OPEN_AI_API_KEY`       |
| Anthropic | Claude 3.5 Haiku                | `VITE_ANTHROPIC_AI_API_KEY`  |
| DeepSeek  | DeepSeek-V3 (`deepseek-chat`)   | `VITE_DEEPSEEK_AI_API_KEY`   |
| xAI       | Grok 3 Mini                     | `VITE_X_AI_API_KEY`          |

You only need keys for the providers you plan to use. Gemini 2.5 Flash is selected by default.

## Getting started

### Prerequisites

- Node.js 20.19 or later (required by Vite 8)
- An API key from at least one of the providers above

### Install and run

```bash
git clone https://github.com/<your-username>/multi-llm-chat.git
cd multi-llm-chat
npm install
cp .env.example .env.local
```

Open `.env.local` and add your API keys:

```bash
VITE_GOOGLE_AI_API_KEY=your-google-api-key
VITE_OPEN_AI_API_KEY=your-open-ai-key
VITE_ANTHROPIC_AI_API_KEY=your-anthropic-api-key
VITE_DEEPSEEK_AI_API_KEY=your-deepseek-api-key
VITE_X_AI_API_KEY=your-x-ai-api-key
```

Then start the dev server:

```bash
npm run dev
```

The app runs at http://localhost:5173.

### Scripts

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the development server with hot reload |
| `npm run build`   | Build for production into `dist/`         |
| `npm run preview` | Serve the production build locally        |
| `npm run lint`    | Run ESLint                                |

## Security note

This app calls the AI providers directly from the browser. Vite includes every `VITE_`-prefixed variable in the JavaScript bundle, so **anyone who loads a deployed build can read your API keys**.

That is fine for running the app locally. Before deploying it publicly, move the API calls behind a small backend or serverless function that holds the keys, and have the frontend call that instead.

`.env.local` is listed in `.gitignore`, so your keys will not be committed.

## Project structure

```
src/
├── App.jsx                 # App layout and chat state
├── assistants/             # One adapter per provider
│   ├── googleai.js
│   ├── openai.js
│   ├── anthropicai.js
│   ├── deepseekai.js       # Reuses the OpenAI adapter with DeepSeek's base URL
│   └── xai.js              # Reuses the OpenAI adapter with xAI's base URL
└── components/
    ├── Assistant/          # Model picker
    ├── Chat/               # Sends messages and handles streaming
    ├── Controls/           # Message input and send button
    ├── Messages/           # Message list with Markdown rendering
    ├── Sidebar/            # Chat history and "New Chat"
    ├── Theme/              # Theme picker
    └── Loader/             # Loading indicator
```

## Adding a provider

Each provider is a class in `src/assistants/` with a `chatStream(content, history)` async generator that yields text chunks. (A non-streaming `chat(content, history)` method is also included.) `history` is an array of `{ role, content }` messages.

1. Create `src/assistants/yourprovider.js` exporting an `Assistant` class. If the provider has an OpenAI-compatible API, extend the OpenAI adapter and pass a client with a custom `baseURL`, as `deepseekai.js` does.
2. Register the class in `assistantMap` in `src/components/Assistant/Assistant.jsx`.
3. Add an `<option value="yourprovider:model-name">` to the dropdown in the same file.
4. Add the new API key variable to `.env.example`.

## Tech stack

- [React 19](https://react.dev) and [Vite](https://vite.dev)
- CSS Modules for styling
- Official SDKs: [`openai`](https://www.npmjs.com/package/openai), [`@anthropic-ai/sdk`](https://www.npmjs.com/package/@anthropic-ai/sdk), [`@google/genai`](https://www.npmjs.com/package/@google/genai)
- [`react-markdown`](https://github.com/remarkjs/react-markdown) and [`react-textarea-autosize`](https://github.com/Andarist/react-textarea-autosize)
