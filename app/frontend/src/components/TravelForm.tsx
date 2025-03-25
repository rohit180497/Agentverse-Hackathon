
import React, { useState } from "react";
import CitySelector from "./CitySelector";
import DateSelector from "./DateSelector";
import PeopleSelector from "./PeopleSelector";
import { Plane, MapPin, Calendar, Users, ArrowRight } from "lucide-react";

interface TravelFormProps {
  onSearch: (formData: any) => void;
}

const TravelForm: React.FC<TravelFormProps> = ({ onSearch }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [people, setPeople] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!origin) errors.origin = "Please select your city of origin";
    if (!destination) errors.destination = "Please select your destination";
    if (!startDate) errors.startDate = "Please select a departure date";
    if (!returnDate) errors.returnDate = "Please select a return date";
    if (startDate && returnDate && startDate > returnDate) {
      errors.returnDate = "Return date must be after departure date";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSearch({
        origin,
        destination,
        startDate,
        returnDate,
        people
      });
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto animate-scale-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-travel-dark/80 flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5" />
              Origin City
            </label>
            <CitySelector 
              value={origin} 
              onChange={setOrigin} 
              placeholder="Where are you traveling from?"
              error={formErrors.origin}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-travel-dark/80 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Destination City
            </label>
            <CitySelector 
              value={destination} 
              onChange={setDestination} 
              placeholder="Where are you going to?"
              error={formErrors.destination}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-travel-dark/80 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Departure Date
            </label>
            <DateSelector 
              date={startDate} 
              onDateChange={setStartDate} 
              placeholder="Select departure date"
              error={formErrors.startDate}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-travel-dark/80 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Return Date
            </label>
            <DateSelector 
              date={returnDate} 
              onDateChange={setReturnDate} 
              placeholder="Select return date"
              error={formErrors.returnDate}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-travel-dark/80 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Number of People
            </label>
            <PeopleSelector 
              value={people} 
              onChange={setPeople} 
            />
          </div>
          
          <div className="flex items-end">
            <button 
              type="submit" 
              className="primary-button w-full"
            >
              Find Perfect Trip
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TravelForm;
