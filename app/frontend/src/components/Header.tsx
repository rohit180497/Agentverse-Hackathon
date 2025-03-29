const Header = () => {
  return (
    <header className="travel-gradient text-white py-2 px-4 shadow-md"> {/* ↓ Reduced padding */}
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2"> {/* ↓ Reduced gap */}
          {/* 🔥 Bigger & Rounded Logo */}
          <img
            src="/logoBG.png"
            alt="Travel Genie Logo"
            className="h-16 w-16 rounded-full shadow-sm" // ↑ Increased size
          />
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
