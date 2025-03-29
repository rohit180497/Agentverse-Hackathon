
import { useState, useEffect, useRef } from "react";
import { Send, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message, TravelQuery } from "@/types/travel";
import { cn } from "@/lib/utils";

interface ChatbotProps {
  onSubmit: (query: TravelQuery) => void;
  isGenerating: boolean;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

const Chatbot = ({ onSubmit, isGenerating, isMinimized, onToggleMinimize }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hi there! I'm TravelGenie, your AI travel assistant. I can help you plan your perfect trip! Please tell me your origin city, destination city, travel dates, and I'll create a personalized itinerary for you.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [stage, setStage] = useState<number>(0);
  const [travelData, setTravelData] = useState<Partial<TravelQuery>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const askNextQuestion = () => {
    const questions = [
      "Great! What is your origin city?",
      "And what is your destination city?",
      "What date will you start your travel? (YYYY-MM-DD)",
      "And what date will you return? (YYYY-MM-DD)",
    ];

    if (stage < questions.length) {
      setTimeout(() => {
        addMessage(questions[stage], "bot");
      }, 600);
    }
  };

  const addMessage = (text: string, sender: "user" | "bot") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSend = () => {
    if (!currentInput.trim()) return;

    addMessage(currentInput, "user");
    setCurrentInput("");

    // Process the input based on the current stage
    const updatedTravelData = { ...travelData };
    
    switch (stage) {
      case 0:
        updatedTravelData.originCity = currentInput.trim();
        break;
      case 1:
        updatedTravelData.destinationCity = currentInput.trim();
        break;
      case 2:
        updatedTravelData.startDate = currentInput.trim();
        break;
      case 3:
        updatedTravelData.returnDate = currentInput.trim();
        
        // All data collected, send the query
        const finalQuery: TravelQuery = {
          originCity: updatedTravelData.originCity!,
          destinationCity: updatedTravelData.destinationCity!,
          startDate: updatedTravelData.startDate!,
          returnDate: updatedTravelData.returnDate!,
        };
        
        addMessage("Generating Itinerary...", "bot");
        onSubmit(finalQuery);
        break;
    }

    setTravelData(updatedTravelData);
    
    if (stage < 3) {
      setStage((prev) => prev + 1);
      askNextQuestion();
    }
  };

  useEffect(() => {
    if (stage === 0) {
      askNextQuestion();
    }
  }, [stage]);

  return (
    <Card className={cn(
      "transition-all duration-500 overflow-hidden", 
      isMinimized ? "w-20 h-20 fixed bottom-4 right-4 rounded-full" : "w-full md:w-96 h-[500px]"
    )}>
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
            <div 
              ref={chatContentRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-2 max-w-[80%]",
                    message.sender === "user" ? "ml-auto" : "mr-auto"
                  )}
                >
                  {message.sender === "bot" && (
                    <div className="bg-primary text-white rounded-full p-1.5">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.text}
                  </div>
                  {message.sender === "user" && (
                    <div className="bg-secondary text-secondary-foreground rounded-full p-1.5">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  disabled={isGenerating || stage > 3}
                />
                <Button 
                  size="icon" 
                  onClick={handleSend} 
                  disabled={isGenerating || stage > 3}
                >
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
    </Card>
  );
};

export default Chatbot;
