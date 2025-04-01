from uagents import Agent, Context, Model
from typing import List, Optional
from dotenv import load_dotenv
import os

# Load Amadeus credentials
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

# ---------------- Config ----------------
FLIGHT_AGENT_ADDRESS = "agent1qd3qj9wsjwdasgqu2w3gzwjgzc3cjx7pwdl26th3r67y46umgulwxu4emrg"  # Replace with your hosted agent
AMADEUS_API_KEY = os.getenv("AMADEUS_API_KEY")
AMADEUS_SECRET_KEY = os.getenv("AMADEUS_SECRET_KEY")

# ---------------- Test Agent ----------------
test_agent = Agent(name="FlightTesterAgent")

@test_agent.on_event("startup")
async def test_flight_query(ctx: Context):
    ctx.logger.info("🚀 Sending flight search request to FlightFinderAgent...")
    await ctx.send(FLIGHT_AGENT_ADDRESS, FlightRequest(
        origin_city="Boston",
        destination_city="New York",
        departure_date="2025-04-05",
        return_date="2025-04-10",
        adults=1,
        api_key=AMADEUS_API_KEY,
        secret_key=AMADEUS_SECRET_KEY
    ))

@test_agent.on_message(model=FlightResults)
async def handle_results(ctx: Context, sender: str, msg: FlightResults):
    if not msg.options:
        ctx.logger.info("❌ No flights found or error occurred.")
    else:
        ctx.logger.info(f"✅ {len(msg.options)} flight option(s) received:")
        for i, flight in enumerate(msg.options, 1):
            ctx.logger.info(f"\nOption {i} - 💸 {flight.price} {flight.currency}")
            for seg in flight.segments:
                ctx.logger.info(f"  ✈️ {seg.from_airport} → {seg.to_airport} | {seg.departure} → {seg.arrival} | {seg.carrier_code} | {seg.duration}")

if __name__ == "__main__":
    test_agent.run()