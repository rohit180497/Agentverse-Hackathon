import gradio as gr
from supervisor.supervisor import SupervisorAgent
from core.agent_core import TravelGenieCore
from core.iterinary import generate_itinerary_summary
from dotenv import load_dotenv
import os

# Load env
load_dotenv()

# Initialize agent
agent = SupervisorAgent()
last_trip_details = {}

confirmation_keywords = ["yes", "yess", "okay", "ok", "okz", "yep", "yup", "yupp", "yupp", "sure", "confirm", "go ahead", "i confirm", "yes i confirm"]

# --- Main Chat Handler ---
def chat_fn(message, history):
    global last_trip_details
    try:
        # Check if user confirmed trip
        if last_trip_details and any(word in message.lower() for word in confirmation_keywords):
            print("[✅ User Confirmed Trip Details]")
            history.append((message, "👍 Confirmed! Preparing your itinerary..."))

            # Respond first with confirmation, then let frontend call /generate-itinerary
            return {
                "history": history,
                "trigger_core": True
            }

        # Otherwise, extract trip details
        result = agent.chat(message, history)

        if "error" in result:
            print("[Error from SupervisorAgent]", result)
            return {
                "history": history + [(message, f"❌ {result['details']}")],
                "trigger_core": False
            }

        print("[Agent Response]", result.get("message"))

        if result.get("ready"):
            trip = result["trip_details"]
            last_trip_details = trip
            trip_msg = result.get("message", "✅ All trip details received!") + "\n\nPlease type \"Yes\" to confirm and start planning your itinerary."
            print("[Awaiting User Confirmation to Trigger TravelGenieCore...]")
            print(trip)
            return {
                "history": history + [(message, trip_msg)],
                "trigger_core": False
            }
            

        return {
            "history": history + [(message, result.get("message", "⚠️ No response message returned."))],
            "trigger_core": False
        }

    except Exception as e:
        print("[Unhandled Exception]", str(e))
        return {
            "history": history + [(message, f"Unexpected error: {str(e)}")],
            "trigger_core": False
        }


# --- Trigger TravelGenieCore Agents ---
def run_travelgenie_core(chat_history):
    try:
        if not last_trip_details:
            return {
                "history": chat_history + [("", "No trip details found. Please provide your trip info.")],
                "data": None
            }

        print("last trip details", last_trip_details)
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
        print("LLM Summary Input:", llm_input)

        iterinary_summary = generate_itinerary_summary(llm_input)
        print("✅ Itinerary Summary:", iterinary_summary)

        # Clear memory after generating the itinerary
        agent.memory.clear()

        return {
            "history": chat_history + [("", "TravelGenie is now preparing your personalized itinerary...\n\n✅ Your itinerary is ready! ✨")],
            "data": {
                "weather": weather,
                "route": route,
                "explore": explore,
                "food": food,
                "flights": flights,
                "events": events,
                "summary": iterinary_summary
            }
        }

    except Exception as e:
        return {
            "history": chat_history + [("", f"🚨 TravelGenie failed: {str(e)}")],
            "data": None
        }
