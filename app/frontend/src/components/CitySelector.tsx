
import React, { useState, useEffect, useRef } from "react";
import { Command, Search } from "lucide-react";
import { cities } from "@/data/cities";

interface CitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Select a city",
  error 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Filter cities based on search input
  const filteredCities = search.trim() === "" 
    ? [] 
    : cities.filter(city => 
        city.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (city: string) => {
    onChange(city);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value || search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (value) onChange("");
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`travel-input pr-10 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search className="w-4 h-4" />
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>
      )}
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 py-1 max-h-60 overflow-auto animate-fade-in"
        >
          {filteredCities.length > 0 ? (
            filteredCities.map((city, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors text-sm"
                onClick={() => handleSelect(city)}
              >
                {city}
              </button>
            ))
          ) : search.trim() !== "" ? (
            <div className="px-4 py-3 text-sm text-gray-500">No cities found</div>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">Start typing to search cities</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySelector;
