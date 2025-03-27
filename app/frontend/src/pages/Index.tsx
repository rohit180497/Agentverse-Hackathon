
import { useState, useRef, useEffect } from "react";
import { Chatbot } from "@/components/Chatbot";
import { Dashboard } from "@/components/Dashboard";
import { Header } from "@/components/Header";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{text: string, sender: 'user' | 'bot', timestamp: Date}>>([
    {
      text: "Hi there! I'm TravelGenie, your AI travel companion. Where would you like to travel to?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [tripInfo, setTripInfo] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    travelers: 1
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleUserMessage = (message: string) => {
    // Add user message to chat
    setChatHistory(prev => [...prev, {
      text: message,
      sender: 'user',
      timestamp: new Date()
    }]);
    
    // Simulate AI response
    setTimeout(() => {
      // Example logic to parse user input - in real app this would be handled by an LLM
      if (!tripInfo.destination && message.toLowerCase().includes('to')) {
        const destination = message.toLowerCase().split('to')[1].trim().split(' ')[0];
        setTripInfo(prev => ({...prev, destination: destination.charAt(0).toUpperCase() + destination.slice(1)}));
        
        setChatHistory(prev => [...prev, {
          text: `Great! You want to travel to ${destination.charAt(0).toUpperCase() + destination.slice(1)}. When are you planning to depart?`,
          sender: 'bot',
          timestamp: new Date()
        }]);
      } 
      else if (!tripInfo.departureDate && (message.toLowerCase().includes('tomorrow') || message.toLowerCase().includes('next') || message.toLowerCase().includes('on'))) {
        // Simulate date parsing
        const today = new Date();
        const departureDateObj = new Date(today);
        departureDateObj.setDate(today.getDate() + 7); // Just add 7 days as example
        const departureDate = departureDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        setTripInfo(prev => ({...prev, departureDate}));
        
        setChatHistory(prev => [...prev, {
          text: `Got it! You'll be departing on ${departureDate}. And when will you return?`,
          sender: 'bot',
          timestamp: new Date()
        }]);
      }
      else if (!tripInfo.returnDate && (message.toLowerCase().includes('back') || message.toLowerCase().includes('return'))) {
        // Simulate date parsing for return
        const today = new Date();
        const returnDateObj = new Date(today);
        returnDateObj.setDate(today.getDate() + 14); // Add 14 days as example
        const returnDate = returnDateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        setTripInfo(prev => ({...prev, returnDate, origin: 'Boston'})); // Also set origin as example
        
        // All info collected, show final response and transition to dashboard
        setChatHistory(prev => [...prev, {
          text: `Perfect! I'll plan your trip from Boston to ${tripInfo.destination}, departing on ${tripInfo.departureDate} and returning on ${returnDate}. Let me gather some information for you...`,
          sender: 'bot',
          timestamp: new Date()
        }]);
        
        // Trigger dashboard display after a delay
        setTimeout(() => {
          setShowDashboard(true);
        }, 2000);
      }
      else {
        // Generic response
        setChatHistory(prev => [...prev, {
          text: "I'm sorry, I didn't understand that. Could you tell me where you'd like to travel to?",
          sender: 'bot',
          timestamp: new Date()
        }]);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className={`transition-all duration-500 ${showDashboard ? 'flex justify-center pt-2' : ''}`}>
        <Header />
      </div>
      
      <div className="flex-1 flex relative">
        <div className={`dashboard-container ${showDashboard ? 'visible' : ''}`}>
          <Dashboard tripInfo={tripInfo} />
        </div>
        
        <div className={`chat-container ${showDashboard ? 'shifted h-screen pt-2 pb-2' : 'h-[calc(100vh-10rem)]'}`}>
          <Chatbot 
            chatHistory={chatHistory} 
            onSendMessage={handleUserMessage}
            bottomRef={bottomRef}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
