import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react'
import { ChatService } from './ChatService'

// Message interface
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  isStreaming?: boolean;
}

function App() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatService = useRef<ChatService>(ChatService.getInstance());
  const cancelStreamRef = useRef<(() => void) | null>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up the streaming cancel function when component unmounts
  useEffect(() => {
    return () => {
      if (cancelStreamRef.current) {
        cancelStreamRef.current();
      }
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
    };
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'ai',
      isStreaming: true,
    };
    
    setMessages(prev => [...prev, userMessage, aiMessage]);
    setInput('');
    setIsLoading(true);
    
    // Use streaming response
    cancelStreamRef.current = chatService.current.streamResponse(
      input,
      (chunk) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage && lastMessage.sender === 'ai') {
            lastMessage.content += chunk;
          }
          
          return newMessages;
        });
      }
    );
    
    // After streaming completes, remove streaming flag
    setTimeout(() => {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (lastMessage && lastMessage.sender === 'ai') {
          lastMessage.isStreaming = false;
        }
        
        return newMessages;
      });
      
      setIsLoading(false);
    }, 4000); // Simulated streaming duration
  };

  // Handle keydown for Cmd/Ctrl+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Chat header */}
      <header className="border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold flex items-center">
            <Bot className="mr-2 text-highlight" size={24} />
            <span>AI Assistant</span>
          </h1>
        </div>
      </header>
      
      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center opacity-50">
              <Bot size={48} className="mx-auto mb-4 text-highlight" />
              <p>Start a conversation with the AI assistant</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-highlight ml-auto text-white' 
                  : 'bg-gray-800 mr-auto'
              }`}
            >
              {message.content}
              {message.isStreaming && (
                <span className="inline-block ml-1 animate-pulse">▋</span>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input form */}
      <form 
        onSubmit={handleSubmit} 
        className="border-t border-gray-800 p-4"
      >
        <div className="flex items-center bg-gray-900 rounded-lg overflow-hidden">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-transparent outline-none"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="p-3 text-highlight disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Press Cmd/Ctrl + Enter to send
        </div>
      </form>
    </div>
  )
}

export default App
