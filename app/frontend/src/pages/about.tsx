import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-6">
        <div className="max-w-4xl mx-auto mt-10">
          <h1 className="text-3xl font-bold mb-4">About TravelGenie</h1>
          <p className="text-muted-foreground text-lg">
            TravelGenie is your intelligent AI travel assistant that helps you build
            a personalized itinerary based on your trip preferences.
            This project was built as part of the Agentverse Hackathon 2025 using FastAPI, React, and multiple AI agents including weather, route, food, and event finders.
          </p>
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

export default About;
