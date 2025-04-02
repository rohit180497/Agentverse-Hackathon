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

  const getNavClass = (path: string) =>
    `text-xl font-semibold px-3 py-1 rounded-md transition-all duration-300
     ${location.pathname === path
        ? "bg-white/20 text-white"
        : "hover:bg-white/10 hover:text-white/80 text-white/90"}`;



  return (
    <main className="pt-24 px-4">
    <header className="fixed top-0 left-0 right-0 z-50 travel-gradient text-white py-2 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 🔥 Logo */}
          <img
            src="/logoBG.png"
            alt="Travel Genie Logo"
            className="h-20 w-20 rounded-full shadow-sm"
          />
        </div>

        <nav className="hidden md:flex space-x-6">
          <button className={getNavClass("/")} onClick={handleHomeClick}>
            Home
          </button>
          <button className={getNavClass("/about")} onClick={() => navigate("/about")}>
            About
          </button>
          <button className={getNavClass("/contact")} onClick={() => navigate("/contact")}>
            Contact
          </button>
        </nav>
      </div>
    </header>
  </main>
  );
};

export default Header;
