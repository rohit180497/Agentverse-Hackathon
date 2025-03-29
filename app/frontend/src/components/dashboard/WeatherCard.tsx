
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherInfo } from "@/types/travel";
import { CloudSun, Sun, Cloud } from "lucide-react";

interface WeatherCardProps {
  data?: WeatherInfo;
  isLoading: boolean;
}

const WeatherCard = ({ data, isLoading }: WeatherCardProps) => {
  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case "sun":
        return <Sun className="h-6 w-6 text-amber-500" />;
      case "cloud-sun":
        return <CloudSun className="h-6 w-6 text-blue-400" />;
      case "cloud":
        return <Cloud className="h-6 w-6 text-gray-400" />;
      default:
        return <Sun className="h-6 w-6 text-amber-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-primary" />
          Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="flex justify-between">
              <div className="h-12 w-12 bg-muted rounded-full"></div>
              <div className="h-12 w-1/3 bg-muted rounded"></div>
            </div>
            <div className="h-24 bg-muted rounded-md mt-4"></div>
          </div>
        ) : data ? (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getWeatherIcon(data.icon)}
                <div>
                  <p className="text-2xl font-semibold">{data.temperature}°C</p>
                  <p className="text-muted-foreground">{data.condition}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-2">
              {data.forecast.map((day, index) => (
                <div key={index} className="text-center p-2 bg-accent rounded-md">
                  <p className="text-xs text-muted-foreground">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                  <div className="my-1 flex justify-center">
                    {getWeatherIcon(day.icon)}
                  </div>
                  <p className="text-sm font-medium">{day.high}° / {day.low}°</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Weather information will appear here
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
