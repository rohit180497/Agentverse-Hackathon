
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateSelectorProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  error?: string;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  date, 
  onDateChange, 
  placeholder = "Select date",
  error
}) => {
  return (
    <div className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "travel-input justify-start text-left font-normal h-auto py-3 hover:bg-transparent",
              !date && "text-muted-foreground",
              error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            className="p-3 pointer-events-auto rounded-lg"
          />
        </PopoverContent>
      </Popover>
      
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>
      )}
    </div>
  );
};

export default DateSelector;
