// src/hooks/useTravelGenie.ts
import { useState } from "react";

export const useTravelGenie = () => {
  const [chatHistory, setChatHistory] = useState<[string, string][]>([]);
  const [itinerary, setItinerary] = useState<any | null>(null);

  const sendMessage = async (msg: string) => {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, history: chatHistory }),
    });

    const data = await res.json();
    setChatHistory(data.history);

    if (data.trigger_core) {
      const response = await fetch("http://localhost:8000/generate-itinerary", {
        method: "POST",
      });
      const itData = await response.json();
      setItinerary(itData);
    }
  };

  return {
    chatHistory,
    itinerary,
    sendMessage,
  };
};
