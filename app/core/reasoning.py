from jinja2 import Template
from tabulate import tabulate
from llm.gemini_client import get_gemini_response

def load_prompt_template(path):
    with open(path, "r", encoding="utf-8") as file:
        return Template(file.read())

def generate_preparedness_advice(source, destination, source_weather, dest_weather):
    template = load_prompt_template("prompts/weather_prep_prompt.txt")
    prompt = template.render(
        source=source,
        destination=destination,
        source_weather=source_weather["summary"],
        destination_weather=dest_weather["summary"]
    )

    response = get_gemini_response(prompt)
    return response.strip()

def generate_route_advice(source, destination, route_info):
    template = load_prompt_template("prompts/route_advice_prompt.txt")
    prompt = template.render(
        source=source,
        destination=destination,
        summary=route_info["summary"],
        distance=round(route_info["distance_meters"] * 0.001, 2),
        duration=route_info["duration"],
        fuel=route_info.get("fuel_estimate_liters", "unknown"),
        tolls=route_info.get("toll_info", []),
        warnings=route_info.get("warnings", [])
    )
    # print("Gemini Prompt:\n", prompt)
    return get_gemini_response(prompt).strip()

def generate_exploration_advice(destination, attractions_data):
    template = load_prompt_template("prompts/explore_prompt.txt")
    prompt = template.render(location=destination, attractions=attractions_data["attractions"])
    # print("\nGemini Prompt:\n", prompt)
    return get_gemini_response(prompt).strip()

def generate_flight_advice(flight_data):
    if not isinstance(flight_data, dict):
        return "Invalid flight data format."

    if "error" in flight_data:
        return f"Flight Search Error: {flight_data['error']}"

    flights = flight_data.get("flights", [])
    if not flights:
        return "No flights found."

    rows = []
    for f in flights:
        try:
            rows.append([
                f.get("From", "N/A"), f.get("To", "N/A"),
                f.get("Airline", "N/A"), f.get("Depart", "N/A"),
                f.get("Arrive", "N/A"), f.get("Duration", "N/A"),
                f.get("Stops", "N/A"), f.get("Price", "N/A")
            ])
        except Exception as e:
            print(f"⚠️ Error parsing flight: {e}")

    headers = ["From", "To", "Airline", "Depart", "Arrive", "Duration", "Stops", "Price"]
    return "✈️ **Available Flights:**\n\n" + tabulate(rows, headers=headers, tablefmt="github")