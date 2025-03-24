from uagents import Agent, Context, Protocol
from pydantic import BaseModel
import google.generativeai as genai
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

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

ROUTE_AGENT_ADDRESS = "agent1qfetzztsmf373m7qa4x6l5mjveykecm87cu9m7myaxd7ukp0rwrjkkax9wt"

orchestrator = Agent(name="TravelOrchestratorAgent")
protocol = Protocol(name="TravelOrchestratorProtocol")

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

@protocol.on_message(model=FrontendRequest)
async def handle_frontend_request(ctx: Context, sender: str, msg: FrontendRequest):
    route_request = RouteRequest(
        source=msg.source_city,
        destination=msg.destination_city,
        api_key=os.getenv("GOOGLE_MAPS_API_KEY")
    )
    await ctx.send(ROUTE_AGENT_ADDRESS, route_request)

@protocol.on_message(model=RouteAgentResponse)  # ✅ Fixed here
async def handle_route_response(ctx: Context, sender: str, msg: RouteAgentResponse):
    summary = cot_prompt_route(msg)
    ctx.logger.info("💡 Gemini-generated route summary:")
    ctx.logger.info(summary)

orchestrator.include(protocol)

@orchestrator.on_event("startup")
async def on_startup(ctx: Context):
    ctx.logger.info(f"🚀 Orchestrator running at: {ctx.agent.address}")

if __name__ == "__main__":
    orchestrator.run()
