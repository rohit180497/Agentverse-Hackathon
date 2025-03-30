import { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message, TripItinerary, TravelQuery } from "@/types/travel";
import { cn } from "@/lib/utils";
import axios from "axios";


interface ChatbotProps {
  isGenerating: boolean;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onItineraryReady: (data: TripItinerary, query: TravelQuery) => void;
}

const extractQueryFromHistory = (data: TravelQuery): TravelQuery => {
  const queryLine = history[0]?.user.toLowerCase(); // crude parsing

  return {
    originCity: "",
    destinationCity: "",
    startDate: "",
    returnDate: "",
  };
};


const Chatbot = ({ isGenerating, isMinimized, onToggleMinimize, onItineraryReady }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    text: "👋 Hi! I'm TravelGenie. Tell me about your trip and I'll build your itinerary!",
    sender: "bot",
    timestamp: new Date(),
  }]);
  const [currentInput, setCurrentInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!currentInput.trim()) return;

    const userMessage = currentInput.trim();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: userMessage,
        sender: "user",
        timestamp: new Date(),
      },
    ]);
    setCurrentInput("");

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: userMessage,
        history: chatHistory,
      });
      console.log(res.data)
      const { history, trigger_core } = res.data;
      const latest = history[history.length - 1];

      setChatHistory(history);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: latest.bot,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);

      if (trigger_core) {
        const itineraryRes = await axios.post("http://localhost:8000/generate-itinerary", {
          history,
        });

        // ✅ Notify parent to update dashboard
        onItineraryReady(itineraryRes.data.data, extractQueryFromHistory(history));
        console.log("🧭 Final itinerary object:", itineraryRes.data);
        // ✅ Show message in chat
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: "✅ Your itinerary is ready! Displaying it now...",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);

        // ✅ Auto-minimize chatbot
        //onToggleMinimize();
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "🚨 Oops! Something went wrong.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-500 overflow-hidden",
        isMinimized
          ? "w-20 h-20 fixed bottom-4 right-4 rounded-full"
          : "w-full max-w-[700px] h-[500px] shadow-lg"
      )}
    >

      {!isMinimized ? (
        <>
          <CardHeader className="bg-travel-500 text-white p-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5" />
              TravelGenie Assistant
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0 text-white"
                onClick={onToggleMinimize}
              >
                -
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[calc(500px-48px)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-2 max-w-[80%]",
                    msg.sender === "user" ? "ml-auto" : "mr-auto"
                  )}
                >
                  {msg.sender === "bot" && (
                    <div className="bg-primary text-white rounded-full p-1.5">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === "user" && (
                    <div className="bg-secondary text-secondary-foreground rounded-full p-1.5">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isGenerating}
                />
                <Button size="icon" onClick={handleSend} disabled={isGenerating}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </>
            ) : (
              <Button
                variant="ghost"
                onClick={onToggleMinimize}
                className="w-full h-full rounded-full p-0 flex items-center justify-center"
              >
                <Bot className="h-10 w-10 text-primary" />
              </Button>
            )}
          </Card> // ✅ Properly close the <Card>
        );
      };
      
      export default Chatbot;
      
