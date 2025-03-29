
import { Plane } from "lucide-react";

const Header = () => {
  return (
    <header className="travel-gradient text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="h-8 w-8" />
          <h1 className="text-2xl font-bold">TravelGenie AI-Agent</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-white/80 transition-colors">Home</a>
          <a href="#" className="hover:text-white/80 transition-colors">About</a>
          <a href="#" className="hover:text-white/80 transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
