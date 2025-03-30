
import { useState } from "react";
import Header from "@/components/Header";
import Chatbot from "@/components/Chatbot";
import TravelDashboard from "@/components/dashboard/TravelDashboard";
import { TravelQuery, TripItinerary } from "@/types/travel";
import { TravelService } from "@/services/TravelService";
import { toast } from "@/components/ui/use-toast";
import HowItWorks from "@/components/HowItWorks";
import LoaderOverlay from "@/components/loaderOverlay";
import { useRouter } from "next/router";


// const tempHeader = () => {
//   const router = useRouter();

//   const handleHomeClick = () => {
//     router.replace(router.asPath); // triggers page refresh
//   };

//   return (
//     // ...
//     <span onClick={handleHomeClick} className="cursor-pointer hover:underline">Home</span>
//     // ...
//   );
// };

const Index = () => {
  const [travelQuery, setTravelQuery] = useState<TravelQuery | null>(null);
  const [itinerary, setItinerary] = useState<TripItinerary | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [showLoader, setShowLoader] = useState(false);


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
      {showLoader && <LoaderOverlay />}
      <Header />

      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto mb-8 text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 mt-10">Welcome to TravelGenie AI-Agent</h1>
          <p className="text-xl text-muted-foreground">
            Your intelligent travel companion. Let me plan your perfect trip!
          </p>
        </div>

        <div className="flex flex-col items-center max-w-6xl mx-auto">


          {!dashboardVisible ? (
            <>
              {/* How It Works centered */}
              <div className="w-full max-w-[700px]  mb-6">
                <HowItWorks />
              </div>

              {/* Chatbot below How It Works, centered full-width */}

              <div>
                <Chatbot
                  isGenerating={isGenerating}
                  isMinimized={isMinimized}
                  onToggleMinimize={toggleChatMinimize}
                  onShowLoader={setShowLoader}
                  onItineraryReady={(data, query) => {
                    setItinerary(data);
                    setTravelQuery(query);
                    setDashboardVisible(true);
                    setIsMinimized(true);
                  }}
                />
              </div>
            </>
          ) : (
            // Floating bottom-right style after dashboard is visible
            <>
              <div className="flex-1">
                <TravelDashboard
                  query={travelQuery!}
                  data={itinerary}
                  isLoading={isGenerating}
                />
              </div>


              <div className="fixed bottom-20 right-6 z-50 w-full md:w-96">

                <Chatbot
                  isGenerating={isGenerating}
                  isMinimized={isMinimized}
                  onToggleMinimize={toggleChatMinimize}
                  onItineraryReady={(data, query) => {
                    setItinerary(data);
                    setTravelQuery(query);
                    setDashboardVisible(true);
                    setIsMinimized(true);
                    setShowLoader(false);
                  }}
                  onShowLoader={setShowLoader}
                />
              </div>
            </>
          )}



        </div>
        {showLoader && !dashboardVisible && <LoaderOverlay/>
        }

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

