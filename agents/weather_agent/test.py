from uagents import Agent, Context
from pydantic import BaseModel

# Request model (same as your agent expects)
class WeatherRequest(BaseModel):
    location: str
    travel_date: str
    api_key: str

# Response model
class WeatherResponse(BaseModel):
    location: str
    travel_date: str
    temperature: str
    condition: str
    wind_speed: str
    humidity: str
    summary: str

# Your deployed agent's address
WEATHER_AGENT_ADDRESS = "agent1q2zc0ctnxwyzd7xxgafwzwcd7tkzg7w790zjret9vwm2f38gmm5dv7wm22j"

API_KEY = "Your_API_Key"  # Replace with your actual API key

agent = Agent(name="WeatherTestAgent")

@agent.on_event("startup")
async def trigger(ctx: Context):
    await ctx.send(WEATHER_AGENT_ADDRESS, WeatherRequest(
        location="London",
        travel_date="2025-03-27",
        api_key=API_KEY
    ))

@agent.on_message(model=WeatherResponse)
async def handle_response(ctx: Context, sender: str, msg: WeatherResponse):
    ctx.logger.info("✅ Weather data received:")
    ctx.logger.info(msg.model_dump_json(indent=2))

if __name__ == "__main__":
    agent.run()
