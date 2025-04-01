import os
import requests
from dotenv import load_dotenv
from uagents import Agent, Context, Protocol, Model
from pydantic import BaseModel
from typing import List, Optional

# Load .env credentials
load_dotenv()

# ---------------- Models ----------------
class FlightRequest(Model):
    origin_city: str
    destination_city: str
    departure_date: str
    return_date: Optional[str] = None
    adults: int
    api_key: str
    secret_key: str

class FlightSegment(Model):
    from_airport: str
    to_airport: str
    departure: str
    arrival: str
    carrier_code: str
    duration: str

class FlightResponse(Model):
    price: str
    currency: str
    segments: List[FlightSegment]

class FlightResults(Model):
    options: List[FlightResponse]

# ---------------- Agent ----------------
flight_agent = Agent(
    name="FlightFinderAgent",
    seed="flightagent123",
    endpoint="http://127.0.0.1:8002/submit",
    port=8002,
    # public=True
)

flight_protocol = Protocol(name="FlightSearchProtocol")

# ---------------- Utils ----------------
def get_access_token(api_key: str, secret_key: str) -> str:
    url = "https://test.api.amadeus.com/v1/security/oauth2/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": api_key,
        "client_secret": secret_key
    }
    response = requests.post(url, data=data)
    response.raise_for_status()
    return response.json()["access_token"]

def get_iata_code(city: str, token: str) -> str:
    url = "https://test.api.amadeus.com/v1/reference-data/locations"
    params = {"keyword": city, "subType": "CITY"}
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(url, headers=headers, params=params)
    res.raise_for_status()
    data = res.json()
    return data["data"][0]["iataCode"] if data.get("data") else ""

# ---------------- Main Handler ----------------
@flight_protocol.on_message(model=FlightRequest)
async def handle_flight(ctx: Context, sender: str, msg: FlightRequest):
    ctx.logger.info(f"🔍 Searching flights from {msg.origin_city} to {msg.destination_city}")

    try:
        token = get_access_token(msg.api_key, msg.secret_key)
        origin = get_iata_code(msg.origin_city, token)
        destination = get_iata_code(msg.destination_city, token)

        if not origin or not destination:
            await ctx.send(sender, FlightResults(options=[]))
            return

        url = "https://test.api.amadeus.com/v2/shopping/flight-offers"
        headers = {"Authorization": f"Bearer {token}"}
        params = {
            "originLocationCode": origin,
            "destinationLocationCode": destination,
            "departureDate": msg.departure_date,
            "adults": msg.adults,
            "currencyCode": "USD",
            "max": 10
        }
        if msg.return_date:
            params["returnDate"] = msg.return_date

        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()

        results = []
        for offer in response.json().get("data", []):
            price = offer["price"]["total"]
            currency = offer["price"]["currency"]
            segments = []
            for itinerary in offer["itineraries"]:
                for segment in itinerary["segments"]:
                    segments.append(FlightSegment(
                        from_airport=segment["departure"]["iataCode"],
                        to_airport=segment["arrival"]["iataCode"],
                        departure=segment["departure"]["at"],
                        arrival=segment["arrival"]["at"],
                        carrier_code=segment["carrierCode"],
                        duration=segment["duration"]
                    ))
            results.append(FlightResponse(price=price, currency=currency, segments=segments))

        await ctx.send(sender, FlightResults(options=results))

    except Exception as e:
        ctx.logger.error(f"FlightFinderAgent error: {e}")
        await ctx.send(sender, FlightResults(options=[]))

# Register protocol
flight_agent.include(flight_protocol)

@flight_agent.on_event("startup")
async def announce(ctx: Context):
    ctx.logger.info(f"🛫 FlightFinderAgent is live at address: {ctx.agent.address}")

if __name__ == "__main__":
    flight_agent.run()