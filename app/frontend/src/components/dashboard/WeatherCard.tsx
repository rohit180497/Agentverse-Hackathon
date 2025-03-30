import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/types/travel";
import {
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
  CloudDrizzle,
  CloudFog,
  AlertTriangle,
  Wind,
  Droplet,
} from "lucide-react";

interface WeatherCardProps {
  data?: WeatherData;
  isLoading: boolean;
}

const cleanUnit = (value: string, unit: string) => {
  return value.replace(new RegExp(`( ${unit})+`, "g"), ` ${unit}`).replace(new RegExp(`${unit}${unit}`, "g"), unit);
};

const getWeatherIcon = (condition: string) => {
  const lower = condition.toLowerCase();

  if (lower.includes("clear") || lower.includes("sunny")) return <Sun className="h-5 w-5 text-amber-500" />;
  if (lower.includes("partly cloudy") || lower.includes("mostly sunny") || lower.includes("Few clouds")) return <CloudSun className="h-5 w-5 text-yellow-400" />;
  if (lower.includes("cloudy") || lower.includes("overcast")) return <Cloud className="h-5 w-5 text-gray-400" />;
  if (lower.includes("rain") || lower.includes("showers")) return <CloudRain className="h-5 w-5 text-blue-400" />;
  if (lower.includes("drizzle")) return <CloudDrizzle className="h-5 w-5 text-cyan-400" />;
  if (lower.includes("thunderstorm") || lower.includes("storm")) return <CloudLightning className="h-5 w-5 text-purple-600" />;
  if (lower.includes("snow") || lower.includes("sleet")) return <CloudSnow className="h-5 w-5 text-white" />;
  if (lower.includes("flurries")) return <Snowflake className="h-5 w-5 text-blue-200" />;
  if (lower.includes("fog") || lower.includes("mist") || lower.includes("haze")) return <CloudFog className="h-5 w-5 text-gray-300" />;
  if (lower.includes("wind") || lower.includes("breezy")) return <Wind className="h-5 w-5 text-sky-400" />;
  if (lower.includes("tornado") || lower.includes("hurricane") || lower.includes("severe")) return <AlertTriangle className="h-5 w-5 text-red-600" />;

  return <Sun className="h-5 w-5 text-amber-500" />;
};

const WeatherCard = ({ data, isLoading }: WeatherCardProps) => {
  const renderWeatherBox = (title: string, cityWeather: any) => (
    <div className="bg-accent p-3 rounded-lg">
      <p className="text-sm font-medium mb-1 text-muted-foreground">{title}: {cityWeather.city}</p>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xl font-bold">{cleanUnit(cityWeather.temperature, "°C")}</div>
        {getWeatherIcon(cityWeather.condition)}
      </div>
      <p className="text-sm">{cityWeather.condition}</p>
      <p className="text-sm flex items-center gap-2 text-muted-foreground">
        💨 {cleanUnit(cityWeather.wind_speed, "m/s")} &nbsp;|&nbsp; 💧 {cleanUnit(cityWeather.humidity, "%")}
      </p>

    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-primary" />
          Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-6 w-1/3 bg-muted rounded"></div>
            <div className="h-6 w-1/2 bg-muted rounded mt-2"></div>
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderWeatherBox("Source", data.source_weather)}
              {renderWeatherBox("Destination", data.destination_weather)}
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
