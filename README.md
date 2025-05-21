# Minimalist AI Chat Interface

A sleek, minimalist chat interface designed for AI agents built with the Agent Development Kit (ADK). This project provides a clean, user-friendly interface for interacting with AI assistants.

## Features

- Clean, minimalist UI with a black background and highlight color (#F05A28)
- Real-time streaming of AI responses with typing indicator
- Support for keyboard shortcuts (Cmd/Ctrl + Enter to send messages)
- Responsive design for all screen sizes
- Custom scrollbar styling
- Placeholder implementation ready for ADK integration

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Vite

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

### Development

Start the development server:

```
npm run dev
```

or

```
yarn dev
```

### Building for Production

```
npm run build
```

or

```
yarn build
```

## ADK Integration

The interface includes a `ChatService.ts` file that serves as a placeholder for the Agent Development Kit integration. To connect with an actual ADK-based agent:

1. Update the `sendMessage` method in `ChatService.ts` to connect to your ADK endpoint
2. Implement proper streaming response handling in the `streamResponse` method

## License

MIT

## Acknowledgments

- This project was built with React, Tailwind CSS, and Vite
- Icons from Lucide React