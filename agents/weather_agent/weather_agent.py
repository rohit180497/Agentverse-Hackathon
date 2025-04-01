
import os
import requests
from datetime import datetime
from dotenv import load_dotenv
from uagents import Agent, Context, Protocol
from weather_models import WeatherRequest, WeatherResponse

# Load API Key
load_dotenv()
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

# Initialize agent
weather_agent = Agent(
    name="WeatherAgent",
    seed=None,
    endpoint="http://127.0.0.1:8001/submit",
    port=8001,
    # public=True
)

# Create protocol
weather_protocol = Protocol(name="WeatherProtocol")

@weather_protocol.on_message(model=WeatherRequest)
async def handle_weather(ctx: Context, sender: str, msg: WeatherRequest):
    ctx.logger.info(f"📡 Fetching weather for {msg.location} on {msg.travel_date}")

    try:
        url = f"https://api.openweathermap.org/data/2.5/forecast?q={msg.location}&appid={msg.api_key}&units=metric"
        response = requests.get(url)
        data = response.json()

        target_dt = datetime.strptime(msg.travel_date, "%Y-%m-%d")
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
                location=msg.location,
                travel_date=msg.travel_date,
                temperature=f"{main['temp']} °C",
                condition=weather["description"].capitalize(),
                wind_speed=f"{wind['speed']} m/s",
                humidity=f"{main['humidity']}%",
                summary=f"{msg.location} on {msg.travel_date} will be {weather['description']} with {main['temp']}°C, wind {wind['speed']} m/s and {main['humidity']}% humidity."
            )

            await ctx.send(sender, result)
        else:
            await ctx.send(sender, {"error": "No forecast found for the given date."})

    except Exception as e:
        ctx.logger.error(f"WeatherAgent error: {e}")
        await ctx.send(sender, {"error": str(e)})

# Register protocol
weather_agent.include(weather_protocol)

@weather_agent.on_event("startup")
async def announce(ctx: Context):
    ctx.logger.info(f"WeatherAgent is live at address: {ctx.agent.address}")

if __name__ == "__main__":
    weather_agent.run()
