import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  return (
    <header className="travel-gradient text-white py-2 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 🔥 Logo */}
          <img
            src="/logoBG.png"
            alt="Travel Genie Logo"
            className="h-16 w-16 rounded-full shadow-sm"
          />
        </div>

        <nav className="hidden md:flex space-x-6">
          <button
            className="hover:text-white/80 transition-colors"
            onClick={handleHomeClick}
          >
            Home
          </button>
          <button
            className="hover:text-white/80 transition-colors"
            onClick={() => navigate("/about")}
          >
            About
          </button>
          <button
            className="hover:text-white/80 transition-colors"
            onClick={() => navigate("/contact")}
          >
            Contact
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
