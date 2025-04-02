
import React from "react";
import { MessageCircle, Calendar, Map } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="  rounded-lg">
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center p-2">
          <div className="bg-[#0FA0CE] rounded-full p-2 text-white mb-2">
            <MessageCircle size={20} />
          </div>
          <p className="text-lg">Tell us where you want to go</p>
        </div>
        
        <div className="flex flex-col items-center p-2">
          <div className="bg-[#0FA0CE] rounded-full p-2 text-white mb-2">
            <Calendar size={20} />
          </div>
          <p className="text-lg">Provide your travel dates</p>
        </div>
        
        <div className="flex flex-col items-center p-2">
          <div className="bg-[#0FA0CE] rounded-full p-2 text-white mb-2">
            <Map size={20} />
          </div>
          <p className="text-lg">Get complete itinerary</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
