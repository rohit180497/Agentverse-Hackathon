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
