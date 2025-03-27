import gradio as gr
from supervisor.supervisor import SupervisorAgent
from core.agent_core import TravelGenieCore

from dotenv import load_dotenv
import os

# Initialize agent
agent = SupervisorAgent()

# Global flag to manage TravelGenieCore trigger after confirmation
confirmation_sent = False
last_trip_details = None


# Core chat function with error handling
def chat_fn(message, history):
    try:
        result = agent.chat(message)

        if "error" in result:
            print("[Error from SupervisorAgent]", result)
            return f"Error: {result['details']}"
        
        print("[✅Agent Response]", result.get("message"))

        if result.get("ready"):
            trip = result["trip_details"]
            print("[🚀 Triggering TravelGenieCore with:]", trip)

            core = TravelGenieCore(
                source=trip["source"],
                destination=trip["destination"],
                start_date=trip["start_date"],
                end_date=trip["end_date"],
                weather_api_key=os.getenv("OPEN_WEATHER_API_KEY"),
                route_api_key=os.getenv("GOOGLE_MAPS_API_KEY"),
                explorer_api_key=os.getenv("GOOGLE_MAPS_API_KEY"),
                google_api_key=os.getenv("GOOGLE_MAPS_API_KEY"),
                event_api_key=os.getenv("TICKETMASTER_API_KEY")
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
            # flights = core.run_flight_search()
            # print("Flight response ready", flights)
            events = core.run_event_explorer()
            print("Event response ready", events)

            return "final_summary Prepared"


        return result.get("message", "⚠️ No response message returned.")
    
    except Exception as e:
        print("[🚨 Unhandled Exception]", str(e))
        return f"🚨 Unexpected error: {str(e)}"

# Gradio UI
with gr.Blocks(theme=gr.themes.Soft()) as demo:
    gr.Markdown("## ✈️ TravelGenie: Plan Your Trip via Chat")

    chatbot = gr.Chatbot(height=400, show_label=False)

    with gr.Row():
        msg = gr.Textbox(placeholder="Type your trip details...", scale=8)
        send_btn = gr.Button("Send", variant="primary", scale=1)
        clear_btn = gr.Button("Clear", scale=1)

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
    clear_btn.click(lambda: ([], ""), outputs=[chatbot, msg])

if __name__ == "__main__":
    demo.launch()
