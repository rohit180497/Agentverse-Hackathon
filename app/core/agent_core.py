from agents.weather_agent import WeatherAgent
from agents.route_agent import RouteAgent
from agents.explorer_agent import ExplorerAgent
from agents.flight_scrapper_agent import FlightSearcher
from agents.food_agent import FoodExplorerAgent
from agents.event_agent import EventAgent   
from core.reasoning import generate_preparedness_advice, generate_route_advice, generate_exploration_advice, generate_flight_advice


class TravelGenieCore:
    def __init__(self, source, destination, start_date, end_date, weather_api_key, 
                 route_api_key, explorer_api_key, google_api_key, event_api_key):
        self.source = source
        self.destination = destination
        self.start_date = start_date
        self.end_date = end_date
        self.weather_agent = WeatherAgent(weather_api_key)
        self.route_agent = RouteAgent(route_api_key)
        self.explorer_agent = ExplorerAgent(api_key=explorer_api_key)
        self.food_agent = FoodExplorerAgent(api_key=google_api_key)
        self.event_agent = EventAgent(api_key=event_api_key)
        self.flight_searcher = FlightSearcher(
            from_city=source,
            to_city=destination,
            departure_date=start_date,
            return_date=end_date
        )

    def run_weather_preparedness(self):
        print("🌤 Getting weather for source and destination...")

        source_weather = self.weather_agent.get_weather(self.source, self.start_date)
        dest_weather = self.weather_agent.get_weather(self.destination, self.start_date)

        print("Source Weather:", source_weather.get("summary", source_weather))
        print("Destination Weather:", dest_weather.get("summary", dest_weather))

        if "error" in source_weather or "error" in dest_weather:
            return {"error": "Failed to fetch weather data."}

        message = generate_preparedness_advice(
            self.source, self.destination,
            source_weather, dest_weather
        )

        print("\n🧳 Travel Advice:\n", message)
        return message

    def run_route_summary(self):
        print("Getting route details...")

        route_info = self.route_agent.get_route(self.source, self.destination)

        if "error" in route_info:
            print("Error getting route:", route_info["error"])
            return {"error": route_info["error"]}

        print("Route Summary:", route_info["summary"])

        message = generate_route_advice(
            self.source,
            self.destination,
            route_info
        )

        print("\nRoute Advice:\n", message)
        return message

    def run_exploration_guide(self):
        print(f"Exploring top attractions in {self.destination}...")
        attractions_data = self.explorer_agent.get_attractions(self.destination)
        # print(attractions_data)
        if "error" in attractions_data:
            print("Explore Error:", attractions_data["error"])
        else:
            advice = generate_exploration_advice(self.destination, attractions_data)
            print("\nExploration Suggestions:\n", advice)
    
    def run_flight_search(self):
        print("\nSearching for flights...")
        results = self.flight_searcher.run_search()
        print(results)
        if results.get("status") == "success":
            advice = generate_flight_advice(results)
            print("\nFlight Summary:\n", advice)
            return advice
        else:
            print("Flight error:", results.get("error"))
            return results.get("error")
        
    def run_food_exploration(self):
        print("Exploring top restaurants in destination...")

        food_results = self.food_agent.get_top_restaurants(self.destination)

        if "error" in food_results:
            print("Error fetching food recommendations:", food_results["error"])
            return {"error": "Failed to fetch food recommendations."}

        print("Top Restaurants:")
        for r in food_results.get("top_restaurants", []):
            print(f"- {r['name']} ({r['rating']}): {r['address']}")

        return food_results

    def run_event_explorer(self):
        print("Fetching upcoming events in destination city...")
        result = self.event_agent.get_events(self.destination, self.start_date)
        print(result)
        if "error" in result:
            print("Event agent error:", result["error"])
            return result

        # summary = generate_event_summary(self.destination, result)
        # print("\nEvents Summary:\n", summary)
        return result