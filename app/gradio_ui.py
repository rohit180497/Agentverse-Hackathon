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
            return run_travelgenie_core(history)

        # Otherwise, extract trip details
        result = agent.chat(message, history)

        if "error" in result:
            print("[Error from SupervisorAgent]", result)
            return "", history + [(message, f"❌ {result['details']}")]

        print("[Agent Response]", result.get("message"))

        if result.get("ready"):
            trip = result["trip_details"]
            last_trip_details = trip
            trip_msg = result.get("message", "✅ All trip details received!") + "\n\nPlease type \"Yes\" to confirm and start planning your itinerary."
            print("[Awaiting User Confirmation to Trigger TravelGenieCore...]")
            return "", history + [(message, trip_msg)]

        return "", history + [(message, result.get("message", "⚠️ No response message returned."))]

    except Exception as e:
        print("[Unhandled Exception]", str(e))
        return "", history + [(message, f"Unexpected error: {str(e)}")]


# --- Trigger TravelGenieCore Agents ---
def run_travelgenie_core(chat_history):
    try:
        if not last_trip_details:
            return chat_history + [("", "No trip details found. Please provide your trip info.")]
        print("last trip details",last_trip_details)
        print("chat hostory",chat_history)
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
        print("weather",weather)
        print("route",route)
        print("explore",explore)
        print("food",food)
        print("flights",flights)
        print("events",events)

        llm_input = core.extract_llm_summary_fields(weather, route, explore, food, flights, events)
        print("LLM Summary Input:", llm_input)

        iterinary_summary = generate_itinerary_summary(llm_input)
        print("✅ Itinerary Summary:", iterinary_summary)

        # Clear memory after generating the itinerary
        agent.memory.clear()

        final_msg = "TravelGenie is now preparing your personalized itinerary...\n\n✅ Your itinerary is ready! ✨"
        return "", chat_history + [("", final_msg)]

    except Exception as e:
        return chat_history + [("", f"🚨 TravelGenie failed: {str(e)}")]


# --- Gradio UI ---
with gr.Blocks(theme=gr.themes.Soft()) as demo:
    gr.Markdown("## ✈️ TravelGenie: Plan Your Trip via Chat")

    chatbot = gr.Chatbot(height=400, show_label=False)
    msg = gr.Textbox(placeholder="Type your trip details...", scale=8)
    send_btn = gr.Button("Send", variant="primary")
    clear_btn = gr.Button("Clear")

    # Submit user input
    send_btn.click(chat_fn, [msg, chatbot], [msg, chatbot])
    msg.submit(chat_fn, [msg, chatbot], [msg, chatbot])

    # Clear chat
    clear_btn.click(lambda: ([], ""), outputs=[chatbot, msg])

if __name__ == "__main__":
    demo.launch()
