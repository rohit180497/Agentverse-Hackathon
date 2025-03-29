
import { CloudSun } from "lucide-react";

interface WeatherCardProps {
  destination: string;
}

export const WeatherCard = ({ destination }: WeatherCardProps) => {
  return (
    <div className="dashboard-card h-full">
      <div className="flex items-center mb-4">
        <div className="icon-container">
          <CloudSun className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold ml-3">Weather Forecast</h3>
      </div>
      
      <div className="mt-2">
        <h4 className="text-xl font-semibold">Sunny with occasional clouds</h4>
        <p className="text-gray-600 text-sm mt-1">Average temperature: 22°C (72°F)</p>
      </div>
    </div>
  );
};
