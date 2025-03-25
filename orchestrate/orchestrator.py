from uagents import Agent, Context, Protocol
from pydantic import BaseModel
import google.generativeai as genai
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

api_key = os.getenv("GOOGLE_MAPS_API_KEY")
if not api_key:
    raise ValueError("❌ GOOGLE_MAPS_API_KEY not set correctly in .env file")

# ----------- Models -----------
class FrontendRequest(BaseModel):
    source_city: str
    destination_city: str
    travel_start_date: str
    travel_end_date: str
    no_of_people: int

class RouteRequest(BaseModel):
    source: str
    destination: str
    api_key: str

class RouteAgentResponse(BaseModel):
    source: str
    destination: str
    distance_meters: float
    duration: str
    fuel_estimate_liters: float
    toll_info: list
    route_labels: list
    warnings: list
    summary: str

# ----------- Agent Setup -----------
ROUTE_AGENT_ADDRESS = "agent1qfetzztsmf373m7qa4x6l5mjveykecm87cu9m7myaxd7ukp0rwrjkkax9wt"

orchestrator = Agent(name="TravelOrchestratorAgent",
                     port=8020,
                     endpoint="https://5bc8-2601-19b-f00-6290-acac-8697-7235-aff.ngrok-free.app/submit")

protocol = Protocol(name="TravelOrchestratorProtocol")

# ----------- LLM Prompt Function -----------
def cot_prompt_route(route_response):
    prompt = f"""
    You're a professional travel route advisor. Given the following data:

    Source: {route_response.source}
    Destination: {route_response.destination}
    Distance: {route_response.distance_meters/1609.34:.2f} miles
    Duration: {int(route_response.duration[:-1])/60:.1f} minutes
    Fuel Estimate: {route_response.fuel_estimate_liters} liters
    Warnings: {', '.join(route_response.warnings)}

    Step by step, describe this journey clearly and concisely. Provide a professional summary suitable for travelers.
    """
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text

# ----------- Message Handlers -----------

@protocol.on_message(model=FrontendRequest)
async def handle_frontend_request(ctx: Context, sender: str, msg: FrontendRequest):
    ctx.logger.info("✅ Received FrontendRequest:")
    ctx.logger.info(msg.model_dump_json(indent=2))

    route_request = RouteRequest(
        source=msg.source_city,
        destination=msg.destination_city,
        api_key=api_key
    )

    ctx.logger.info(f"📡 Sending RouteRequest to RouteAgent at {ROUTE_AGENT_ADDRESS}")
    await ctx.send(ROUTE_AGENT_ADDRESS, route_request)

@protocol.on_message(model=RouteAgentResponse)
async def handle_route_response(ctx: Context, sender: str, msg: RouteAgentResponse):
    ctx.logger.info("📬 Received response from RouteAgent:")
    ctx.logger.info(json.dumps(msg.model_dump(), indent=2))

    ctx.logger.info("🤖 Invoking Gemini for CoT summary generation...")
    summary = cot_prompt_route(msg)

    ctx.logger.info("💡 Gemini-generated Route Summary:")
    ctx.logger.info(summary)

# ----------- Startup Log -----------

orchestrator.include(protocol)

@orchestrator.on_event("startup")
async def on_startup(ctx: Context):
    ctx.logger.info(f"🚀 TravelOrchestratorAgent running at: {ctx.agent.address}")

if __name__ == "__main__":
    orchestrator.run()
