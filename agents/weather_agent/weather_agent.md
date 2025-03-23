# Open WeatherAgent

![tag : innovation-lab](https://img.shields.io/badge/innovation--lab-3D8BD3) ![tag : weather](https://img.shields.io/badge/weather-blue) ![tag : forecast](https://img.shields.io/badge/forecast-green) ![tag : travel](https://img.shields.io/badge/travel-orange) ![tag : openweather](https://img.shields.io/badge/openweather-lightgrey) ![tag : mobility](https://img.shields.io/badge/mobility-yellow) ![tag : transportation](https://img.shields.io/badge/transportation-red)

**Domain:** Travel / Mobility / Weather Forecasting  
**Agent Type:** Specialized AI Agent for 5-day weather forecast  
**Status:** Public and Live on Agentverse

---

## Overview
`WeatherAgent` is a smart AI agent that provides weather forecast information for a given location and travel date using the **OpenWeatherMap API**. This agent is useful for travel planning, logistics, and route optimization.

Given a city name and travel date, the agent returns:
- Forecasted temperature
- Weather condition
- Wind speed
- Humidity level
- Summary of conditions on the selected date

---

## Input Format
Send a `WeatherRequest` model:
```python
class WeatherRequest(BaseModel):
    location: str       # City name or location string
    travel_date: str    # Date in format YYYY-MM-DD
    api_key: str        # Your OpenWeatherMap API key
```

### Example Input
```python
WeatherRequest(
    location="Boston",
    travel_date="2025-03-27",
    api_key="<YOUR_API_KEY>"
)
```

---

## Output Format
Agent replies with a `WeatherResponse` model:
```python
class WeatherResponse(BaseModel):
    location: str
    travel_date: str
    temperature: str
    condition: str
    wind_speed: str
    humidity: str
    summary: str
```

### Example Output
```json
{
  "location": "Boston",
  "travel_date": "2025-03-27",
  "temperature": "12.4 °C",
  "condition": "Partly cloudy",
  "wind_speed": "5.6 m/s",
  "humidity": "68%",
  "summary": "Boston on 2025-03-27 will be partly cloudy with 12.4°C, wind 5.6 m/s and 68% humidity."
}
```

---

## How to Use This Agent

### 1. Install Requirements
```bash
pip install uagents requests python-dotenv
```

### 2. Get Your OpenWeatherMap API Key
- Visit [https://home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys)
- Sign up / Log in and generate a free API key
- Create a `.env` file in your project:
  ```
  OPENWEATHER_API_KEY=your_actual_api_key
  ```

### 3. Create a Blank Agent to Test This Agent
You can create a simple test agent that interacts with `WeatherAgent`.

If you are running locally, ensure you configure your agent with an explicit endpoint and port:
```python
# Create test agent
test_agent = Agent(
    name="WeatherTestAgent",
    endpoint="http://127.0.0.1:8011/submit",
    port=8011
)
```

### 4. Send a Request From Another Agent
```python
from uagents import Agent, Context
from weather_models import WeatherRequest, WeatherResponse
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")

# Request model 
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

WEATHER_AGENT_ADDRESS = "agent1q2zc0ctnxwyzd7xxgafwzwcd7tkzg7w790zjret9vwm2f38gmm5dv7wm22j"

agent = Agent(name="TestWeatherAgent")

@agent.on_event("startup")
async def trigger(ctx: Context):
    await ctx.send(WEATHER_AGENT_ADDRESS, WeatherRequest(
        location="Boston",
        travel_date="2025-03-27",
        api_key=API_KEY
    ))

@agent.on_message(model=WeatherResponse)
async def handle(ctx: Context, sender: str, msg: WeatherResponse):
    ctx.logger.info("Weather data received:")
    ctx.logger.info(msg.model_dump_json(indent=2))

if __name__ == "__main__":
    agent.run()
```

---

## Notes
- You must supply a valid **OpenWeatherMap API key**.
- This agent uses the 5-day/3-hour forecast API.
- Weather data is matched to the nearest available forecast timestamp.
- Ideal for integration with trip planners, route agents, or travel assistants.

---

## Source Code
[GitHub Project](https://github.com/rohit180497/Agentverse-Hackathon/tree/main/agents/weather_agent)

## Credits
Developed for the **Fetch.ai Global AI Agents League Hackathon**  
Built by: [Rohit Kosamkar](https://github.com/rohit180497)

Feel free to contribute or open issues for feedback and improvements.
