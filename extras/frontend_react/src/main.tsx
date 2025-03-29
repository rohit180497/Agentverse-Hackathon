import { useRef, useState } from "react";
// import { Chatbot } from "@/components/ui/Chatbot";
// import { Dashboard } from "@/components/dashboard/Dashboard";

import { Chatbot } from "@/components/Chatbot";
import { Dashboard } from "@/components/Dashboard";



export interface TripInfo {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
}

type Sender = "user" | "bot";

interface ChatMessage {
  text: string;
  sender: Sender;
  timestamp: Date;
}


export const Main = () => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const [tripInfo, setTripInfo] = useState<Partial<TripInfo>>({});
  const [showDashboard, setShowDashboard] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (message: string) => {
    // When sending a message
    const userMessage: ChatMessage = {
        text: message,
        sender: "user",
        timestamp: new Date()
    };
    
    setChatHistory((prev) => [...prev, userMessage]);
    

    try {
      const response = await fetch("/api/parse-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      // When receiving a bot message
    const botMessage: ChatMessage = {
        text: data.reply,
        sender: "bot",
        timestamp: new Date()
    };
  
  setChatHistory((prev) => [...prev, botMessage]);
      

      // Update extracted trip parameters
      if (data.tripInfo) {
        setTripInfo((prev) => {
          const updated = { ...prev, ...data.tripInfo };

          // if all 5 trip values are present, show dashboard
          if (
            updated.origin &&
            updated.destination &&
            updated.departureDate &&
            updated.returnDate &&
            updated.travelers !== undefined
          ) {
            setShowDashboard(true);
          }

          return updated;
        });
      }
    } catch (err) {
      console.error("Failed to process message", err);
      setChatHistory((prev) => [
        ...prev,
        {
          text: "⚠️ Sorry, something went wrong. Try again!",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }

    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="p-4 flex flex-col h-screen">
      {!showDashboard ? (
        <Chatbot chatHistory={chatHistory} onSendMessage={handleSendMessage} bottomRef={bottomRef} />
      ) : (
        <Dashboard
          tripInfo={
            tripInfo as TripInfo // safe because we already validated it before showing
          }
        />
      )}
    </div>
  );
};
