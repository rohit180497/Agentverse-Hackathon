import requests
from datetime import datetime
from pydantic import BaseModel

class WeatherRequest(BaseModel):
    location: str
    travel_date: str
    api_key: str

class WeatherResponse(BaseModel):
    location: str
    travel_date: str
    temperature: str
    condition: str
    wind_speed: str
    humidity: str
    summary: str

class WeatherAgent:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_weather(self, location: str, travel_date: str) -> dict:
        try:
            url = f"https://api.openweathermap.org/data/2.5/forecast?q={location}&appid={self.api_key}&units=metric"
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            target_dt = datetime.strptime(travel_date, "%Y-%m-%d")
            closest = None
            min_diff = float("inf")

            for entry in data["list"]:
                entry_dt = datetime.fromtimestamp(entry["dt"])
                diff = abs((entry_dt - target_dt).total_seconds())
                if diff < min_diff:
                    min_diff = diff
                    closest = entry

            if closest:
                main = closest["main"]
                weather = closest["weather"][0]
                wind = closest["wind"]

                result = WeatherResponse(
                    location=location,
                    travel_date=travel_date,
                    temperature=f"{main['temp']} °C",
                    condition=weather["description"].capitalize(),
                    wind_speed=f"{wind['speed']} m/s",
                    humidity=f"{main['humidity']}%",
                    summary=(
                        f"{location} on {travel_date} will be {weather['description']} with "
                        f"{main['temp']}°C, wind {wind['speed']} m/s and {main['humidity']}% humidity."
                    )
                )
                return result.model_dump()
            else:
                return {"error": "No forecast found for the given date."}

        except Exception as e:
            return {"error": str(e)}

# # Example usage
# if __name__ == "__main__":
#     weather = WeatherAgent(api_key="YOUR_OPENWEATHER_API_KEY")
#     result = weather.get_weather("Boston", "2025-03-28")
#     print(result)
# 