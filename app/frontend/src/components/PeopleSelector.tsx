
import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PeopleSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const PeopleSelector: React.FC<PeopleSelectorProps> = ({ 
  value, 
  onChange, 
  min = 1, 
  max = 10 
}) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex items-center">
      <Button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="travel-input flex items-center justify-center p-0 w-10 h-10"
        variant="outline"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <div className="travel-input flex-1 mx-2 flex items-center justify-center h-10">
        <span className="text-lg font-medium">{value}</span>
        <span className="ml-2 text-sm text-muted-foreground">
          {value === 1 ? "Person" : "People"}
        </span>
      </div>
      
      <Button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="travel-input flex items-center justify-center p-0 w-10 h-10"
        variant="outline"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PeopleSelector;
