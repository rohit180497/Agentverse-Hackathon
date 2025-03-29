from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Tuple, Optional
from supervisor.supervisor import SupervisorAgent
from core.agent_core import TravelGenieCore
from core.iterinary import generate_itinerary_summary
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware


# Load environment variables
load_dotenv()

app = FastAPI(title="TravelGenie API", description="Multi-Agent Travel Planner", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or replace with ["http://localhost:8080"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = SupervisorAgent()
last_trip_details = {}

confirmation_keywords = [
    "yes", "yess", "okay", "ok", "okz", "yep", "yup", "yupp", "sure", "confirm",
    "go ahead", "i confirm", "yes i confirm"
]

# --- Request & Response Models ---
class HistoryItem(BaseModel):
    user: str
    bot: str

class ChatRequest(BaseModel):
    message: str
    history: List[HistoryItem]

class ChatResponse(BaseModel):
    history: List[HistoryItem]
    trigger_core: bool
    

class ItineraryRequest(BaseModel):
    history: List[HistoryItem]

class ItineraryResponse(BaseModel):
    history: List[HistoryItem]
    data: Optional[dict]

class TripDetails(BaseModel):
    source: str
    destination: str
    start_date: str
    end_date: str

# --- Chat Endpoint ---
@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    global last_trip_details
    message = req.message
    history: List[HistoryItem] = req.history

    try:
        if last_trip_details and any(word in message.lower() for word in confirmation_keywords):
            history.append(HistoryItem(user=message, bot="👍 Confirmed! Preparing your itinerary..."))
            return ChatResponse(history=history, trigger_core=True)

        history_tuples = [(item.user, item.bot) for item in history]
        result = agent.chat(message, history_tuples)

        if "error" in result:
            history.append(HistoryItem(user=message, bot=f"❌ {result['details']}"))
            return ChatResponse(history=history, trigger_core=False)

        if result.get("ready"):
            last_trip_details = result["trip_details"]
            trip_msg = result.get("message", "✅ All trip details received!") + "\n\nPlease type \"Yes\" to confirm and start planning your itinerary."
            history.append(HistoryItem(user=message, bot=trip_msg))
            print("111111111111111111111111111111111111")
            print(last_trip_details)
            return ChatResponse(history=history, trigger_core=False)

        response_msg = result.get("message", "⚠️ No response message returned.")
        history.append(HistoryItem(user=message, bot=response_msg))
        return ChatResponse(history=history, trigger_core=False)

    except Exception as e:
        history.append(HistoryItem(user=message, bot=f"Unexpected error: {str(e)}"))
        return ChatResponse(history=history, trigger_core=False)

# --- Generate Itinerary Endpoint ---
@app.post("/generate-itinerary", response_model=ItineraryResponse)
def generate_itinerary(req: ItineraryRequest):
    global last_trip_details
    chat_history: List[HistoryItem] = req.history
    print("2222222222222222222222222")
    print(last_trip_details)
    if not last_trip_details:
        chat_history.append(HistoryItem(user="", bot="No trip details found. Please provide your trip info."))
        return ItineraryResponse(history=chat_history, data=None)

    try:
        core = TravelGenieCore(
            source=last_trip_details["source"],
            destination=last_trip_details["destination"],
            start_date=last_trip_details["start_date"],
            end_date=last_trip_details["end_date"],
            weather_api_key=os.getenv("OPEN_WEATHER_API_KEY"),
            route_api_key=os.getenv("GOOGLE_MAPS_API_KEY"),
            explorer_api_key=os.getenv("GOOGLE_MAPS_API_KEY"),
            google_api_key=os.getenv("GOOGLE_MAPS_API_KEY"),
            event_api_key=os.getenv("TICKETMASTER_API_KEY"),
            amadeus_api_key=os.getenv("AMADEUS_API_KEY"),
            amadeus_api_secret=os.getenv("AMADEUS_SECRET_KEY")
        )

        weather = core.run_weather_preparedness()
        route = core.run_route_summary()
        explore = core.run_exploration_guide()
        food = core.run_food_exploration()
        flights = core.run_flight_search()
        events = core.run_event_explorer()

        llm_input = core.extract_llm_summary_fields(weather, route, explore, food, flights, events)
        summary = generate_itinerary_summary(llm_input)
         

        agent.memory.clear()

        chat_history.append(HistoryItem(user="", bot="TravelGenie is now preparing your personalized itinerary...\n\n✅ Your itinerary is ready! ✨"))

        return ItineraryResponse(
            history=chat_history,
            data={
                "weather": weather,
                "route": route,
                "explore": explore,
                "food": food,
                "flights": flights,
                "events": events,
                "summary": summary,
                "source":last_trip_details["source"],
                "destination":last_trip_details["destination"],
                "startDate":last_trip_details["start_date"],
                "returnDate":last_trip_details["end_date"],
            }
        )

    except Exception as e:
        chat_history.append(HistoryItem(user="", bot=f"🚨 TravelGenie failed: {str(e)}"))
        return ItineraryResponse(history=chat_history, data=None)

# --- Individual Agent Endpoints ---
def build_core_from_details(details: TripDetails) -> TravelGenieCore:
    return TravelGenieCore(
        source=details.source,
        destination=details.destination,
        start_date=details.start_date,
        end_date=details.end_date,
        weather_api_key=os.getenv("OPEN_WEATHER_API_KEY"),
        route_api_key=os.getenv("GOOGLE_MAPS_API_KEY"),
        explorer_api_key=os.getenv("GOOGLE_MAPS_API_KEY"),
        google_api_key=os.getenv("GOOGLE_MAPS_API_KEY"),
        event_api_key=os.getenv("TICKETMASTER_API_KEY"),
        amadeus_api_key=os.getenv("AMADEUS_API_KEY"),
        amadeus_api_secret=os.getenv("AMADEUS_SECRET_KEY")
    )

@app.post("/weather")
def weather_endpoint(details: TripDetails):
    core = build_core_from_details(details)
    return core.run_weather_preparedness()

@app.post("/route")
def route_endpoint(details: TripDetails):
    core = build_core_from_details(details)
    return core.run_route_summary()

@app.post("/explore")
def explore_endpoint(details: TripDetails):
    core = build_core_from_details(details)
    return core.run_exploration_guide()

@app.post("/food")
def food_endpoint(details: TripDetails):
    core = build_core_from_details(details)
    return core.run_food_exploration()

@app.post("/flights")
def flights_endpoint(details: TripDetails):
    core = build_core_from_details(details)
    return core.run_flight_search()

@app.post("/events")
def events_endpoint(details: TripDetails):
    core = build_core_from_details(details)
    return core.run_event_explorer()

# Run using: uvicorn fastapi_app:app --reload
# Swagger UI: http://localhost:8000/docs
