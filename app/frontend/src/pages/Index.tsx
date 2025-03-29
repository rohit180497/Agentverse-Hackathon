
import { useState } from "react";
import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import TravelDashboard from "@/components/dashboard/TravelDashboard";
import { TravelQuery, TripItinerary } from "@/types/travel";
import { TravelService } from "@/services/TravelService";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [travelQuery, setTravelQuery] = useState<TravelQuery | null>(null);
  const [itinerary, setItinerary] = useState<TripItinerary | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dashboardVisible, setDashboardVisible] = useState(false);

  const handleSubmitQuery = async (query: TravelQuery) => {
    setTravelQuery(query);
    setIsGenerating(true);
    
    try {
      // Step 1: Show "Generating Itinerary" message
      await TravelService.generateItinerary(query);
      
      // Step 2: Once that's done, fetch the actual itinerary
      const itineraryData = await TravelService.fetchItinerary(query);
      
      // Step 3: Update the UI with the fetched data
      setItinerary(itineraryData);
      setDashboardVisible(true);
      
      // Step 4: Minimize chat after itinerary is ready
      setIsMinimized(true);
      
      toast({
        title: "Itinerary Ready",
        description: "Your personalized travel plan has been generated!",
      });
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast({
        title: "Error",
        description: "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleChatMinimize = () => {
    setIsMinimized(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto mb-8 text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 mt-10">Welcome to TravelGenie AI-Agent</h1>
          <p className="text-xl text-muted-foreground">
            Your intelligent travel companion. Let me plan your perfect trip!
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {dashboardVisible ? (
            <div className="flex-1">
              <TravelDashboard 
                query={travelQuery!} 
                data={itinerary} 
                isLoading={isGenerating} 
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="max-w-xl w-full text-center p-8 bg-accent rounded-lg animate-fade-in">
                <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
                <ul className="space-y-4 text-left">
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Tell TravelGenie about your origin city and destination</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Provide your travel dates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Get a personalized travel itinerary with routes, weather, flights, popular places, and more</span>
                  </li>
                </ul>
                <p className="mt-6 text-muted-foreground">Start by chatting with TravelGenie on the right →</p>
              </div>
            </div>
          )}
          
          <div className={`${isMinimized && dashboardVisible ? "" : "w-full md:w-96"}`}>
            <Chatbot 
              onSubmit={handleSubmitQuery} 
              isGenerating={isGenerating} 
              isMinimized={isMinimized}
              onToggleMinimize={toggleChatMinimize}
            />
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t bg-muted/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TravelGenie AI-Agent. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
