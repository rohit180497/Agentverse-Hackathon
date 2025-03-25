from core.agent_core import TravelGenieCore
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    source = "Boston"
    destination = "Lav Vegas"
    start_date = "2025-04-12"
    end_date = "2025-04-17"
    weather_api_key = os.getenv("OPEN_WEATHER_API_KEY")
    route_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
    explorer_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    core = TravelGenieCore(
        source=source,
        destination=destination,
        start_date=start_date,
        end_date=end_date,
        weather_api_key=weather_api_key,
        route_api_key=route_api_key,
        explorer_api_key = explorer_api_key
    )

    print("\n================ WEATHER PREPAREDNESS =================")
    # core.run_weather_preparedness()

    print("\n================ ROUTE SUMMARY =================")
    # core.run_route_summary()

    print("\n================ EXPLORATION SUMMARY =================")
    # core.run_exploration_guide()

    print("\n================ FLIGHT SEARCH SUMMARY =================")
    core.run_flight_search()
