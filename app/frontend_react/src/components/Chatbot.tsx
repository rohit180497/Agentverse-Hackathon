
import { useState, RefObject } from "react";
import { Send } from "lucide-react";

interface ChatbotProps {
  chatHistory: Array<{text: string, sender: 'user' | 'bot', timestamp: Date}>;
  onSendMessage: (message: string) => void;
  bottomRef: RefObject<HTMLDivElement>;
}

export const Chatbot = ({ chatHistory, onSendMessage, bottomRef }: ChatbotProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="h-full w-full max-w-4xl flex flex-col">
      <div className="glass-card h-full flex flex-col">
        <div className="flex items-center justify-center py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-travel-primary">Travel Chat Assistant</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {chatHistory.map((entry, index) => (
              <div 
                key={index} 
                className={`flex ${entry.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`chat-bubble ${entry.sender}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p>{entry.text}</p>
                  <div className="text-xs opacity-70 mt-1">
                    {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your travel plans..."
              className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-travel-primary focus:border-transparent transition-all"
            />
            <button 
              type="submit" 
              className="bg-travel-primary text-white p-3 rounded-xl hover:bg-travel-accent transition-colors duration-300 flex items-center justify-center"
              disabled={!message.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
