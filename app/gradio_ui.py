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
<<<<<<< HEAD
=======
last_trip_details = {}

<<<<<<< HEAD
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
=======
# Global store for trip details
>>>>>>> 518b876541f0a18d1c276cd627028591b6c7074d
last_trip_details = {}

confirmation_keywords = ["yes", "yess", "okay", "ok", "okz", "yep", "yup", "yupp", "yupp", "sure", "confirm", "go ahead", "i confirm", "yes i confirm"]

# --- Main Chat Handler ---
def chat_fn(message, history):
    global last_trip_details
    try:
<<<<<<< HEAD
        # Check if user confirmed trip
        if last_trip_details and any(word in message.lower() for word in confirmation_keywords):
            print("[✅ User Confirmed Trip Details]")
            history.append((message, "👍 Confirmed! Preparing your itinerary..."))
            return run_travelgenie_core(history)

        # Otherwise, extract trip details
=======
>>>>>>> 928f0050b0fc8001493a51ba958e5b2bf0a2354c
>>>>>>> 518b876541f0a18d1c276cd627028591b6c7074d
        result = agent.chat(message, history)

        if "error" in result:
            print("[Error from SupervisorAgent]", result)
            return "", history + [(message, f"❌ {result['trip_details']}")]

        print("[Agent Response]", result.get("message"))

        if result.get("ready"):
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 518b876541f0a18d1c276cd627028591b6c7074d
            trip = result["trip_details"]
            last_trip_details = trip
            trip_msg = result.get("message", "✅ All trip details received!") + "\n\nPlease type \"Yes\" to confirm and start planning your itinerary."
            print("[Awaiting User Confirmation to Trigger TravelGenieCore...]")
            return "", history + [(message, trip_msg)]
<<<<<<< HEAD
=======

        return "", history + [(message, result.get("message", "⚠️ No response message returned."))]

=======
            if result.get("ready"):
                trip = result["trip_details"]
            print("[🚀 Triggering TravelGenieCore with:]", trip)
>>>>>>> 518b876541f0a18d1c276cd627028591b6c7074d

        return "", history + [(message, result.get("message", "⚠️ No response message returned."))]

<<<<<<< HEAD
=======
            core = TravelGenieCore(
                source=trip["source"],
                destination=trip["destination"],
                start_date=trip["start_date"],
                end_date=trip["end_date"],
                weather_api_key=os.getenv("OPEN_WEATHER_API_KEY"),
                route_api_key=os.getenv("GOOGLE_MAPS_API_KEY"),
                explorer_api_key=os.getenv("GOOGLE_MAPS_API_KEY"),
                google_api_key=os.getenv("GOOGLE_MAPS_API_KEY"),
                event_api_key=os.getenv("TICKETMASTER_API_KEY"),
                amadeus_api_key = os.getenv("AMADEUS_API_KEY"),
                amadeus_api_secret = os.getenv("AMADEUS_SECRET_KEY")                    
            )

            # Run all TravelGenie agents
            weather = core.run_weather_preparedness()
            print("Weather response ready", weather)
            route = core.run_route_summary()
            print("Route response ready", route)
            explore = core.run_exploration_guide()
            print("Explore response ready", explore)
            food = core.run_food_exploration()
            print("Food response ready", food)
            flights = core.run_flight_search()
            print("Flight response ready", flights)
            events = core.run_event_explorer()
            print("Event response ready", events)

            llm_input = core.extract_llm_summary_fields(weather, route, explore, food, flights, events)
            print("LLM Input Prepared", llm_input)
            print("Final Summary Prepared")

            return "final_summary Prepared"


        return result.get("message", "⚠️ No response message returned.")
    
>>>>>>> 928f0050b0fc8001493a51ba958e5b2bf0a2354c
>>>>>>> 518b876541f0a18d1c276cd627028591b6c7074d
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
<<<<<<< HEAD

    # Clear chat
=======

<<<<<<< HEAD
    # Clear chat
=======
    # User message input + call agent + update chat
    def user_input(user_msg, chat_history):
        if not user_msg.strip():
            return "", chat_history
        
        print(">> User:", user_msg)
        response = chat_fn(user_msg, chat_history)
        print("<< Agent:", response)
        
        chat_history.append((user_msg, response))
        return "", chat_history

    send_btn.click(user_input, [msg, chatbot], [msg, chatbot])
    msg.submit(user_input, [msg, chatbot], [msg, chatbot])

    # Run TravelGenieCore
    core_btn.click(run_travelgenie_core, [chatbot], [chatbot])

>>>>>>> 928f0050b0fc8001493a51ba958e5b2bf0a2354c
>>>>>>> 518b876541f0a18d1c276cd627028591b6c7074d
    clear_btn.click(lambda: ([], ""), outputs=[chatbot, msg])

if __name__ == "__main__":
    demo.launch()
