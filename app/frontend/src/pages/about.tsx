import Header from "@/components/Header";
// import { Github } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto p-6">
        <div className="max-w-4xl mx-auto mt-10 glass-card p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-travel-primary mb-4">
            About TravelGenie
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            <strong>TravelGenie</strong> is your intelligent AI-powered travel
            companion that builds personalized itineraries for your adventures.
            Whether you're a solo traveler or planning a group trip, TravelGenie
            simplifies your journey planning with smart suggestions on routes,
            flights, weather prep, food places, and events.
          </p>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-semibold text-travel-accent mb-2">
              Hackathon Showcase
            </h2>
            <p className="text-muted-foreground text-md leading-relaxed">
              This project was proudly built for the{" "}
              <strong>Global AI-Agent League Hackathon 2025</strong> hosted by{" "}
              <em>AgentVerse</em>, where developers crafted collaborative
              autonomous agents to solve real-world problems using LLMs and tool
              integration.
            </p>
            <ul className="list-disc list-inside mt-3 text-muted-foreground">
              <li>Multi-agent architecture powered by FastAPI</li>
              <li>Frontend built using React + Shadcn UI + Tailwind</li>
              <li>
                Agents built for Route, Weather, Flights, Events, and Food
                discovery
              </li>
              <li>LLM integration using Gemini + LangChain</li>
            </ul>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-semibold text-travel-accent mb-2">
              Why TravelGenie?
            </h2>
            <p className="text-muted-foreground text-md leading-relaxed">
              In an era of AI automation, TravelGenie showcases how agent
              collaboration and natural language interfaces can create seamless
              travel planning experiences. From understanding your intent to
              crafting weather-aware and cost-effective travel plans — it’s your
              personal travel assistant on autopilot.
            </p>
          </div>

          {/* GitHub Button */}
          <div className="mt-8 flex justify-center">
            <a
              href="https://github.com/rohit180497/Agentverse-Hackathon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-travel-primary text-white px-5 py-2 rounded-lg hover:bg-travel-accent transition-all shadow"
            >
              <FaGithub size={20} className="text-black" />
              <span className="ml-2 text-black">View on GitHub</span>
            </a>
          </div>

          {/* Architecture GIF */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-2 text-travel-primary">
              System Architecture
            </h3>
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm flex justify-center">
              <img
                src="/TravelGenie_Architecture.gif"
                alt="TravelGenie Architecture"
                className="max-w-xl w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t bg-muted/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TravelGenie AI-Agent. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default About;
