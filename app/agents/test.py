from route_agent import RouteAgent
from weather_agent import WeatherAgent
from explorer_agent import ExplorerAgent
from flight_scrapper_agent import FlightSearcher
from datetime import datetime
import json
# agent = RouteAgent(api_key="api_key")
# result = agent.get_route("Boston, MA", "New York, NY")
# print(result)

# weather = WeatherAgent(api_key="API_KEY")
# result = weather.get_weather("Boston", "2025-03-30")
# print(result)

# explorer = ExplorerAgent(api_key="API-key")
# results = explorer.get_attractions("Mumbai")
# print(json.dumps(results, indent=2))

# searcher = FlightSearcher(
#         from_city="Las Vegas",
#         to_city="New York",
#         departure_date="2025-4-10",
#         return_date="2025-4-17"
#     )

# flight_details = searcher.run_search()
# print(flight_details)