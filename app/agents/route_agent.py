import requests
from pydantic import BaseModel

class RouteRequest(BaseModel):
    source: str
    destination: str
    api_key: str

class RouteResponse(BaseModel):
    source: str
    destination: str
    distance_meters: int
    duration: str
    fuel_estimate_liters: float | None = None
    toll_info: list | None = None
    route_labels: list | None = None
    warnings: list | None = None
    summary: str

class RouteAgent:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def geocode_location(self, place_name: str):
        geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            "address": place_name,
            "key": self.api_key
        }
        response = requests.get(geocode_url, params=params)
        response.raise_for_status()
        data = response.json()

        if data["status"] == "OK":
            location = data["results"][0]["geometry"]["location"]
            return location["lat"], location["lng"]
        else:
            raise Exception(f"Geocoding failed for '{place_name}': {data['status']}")

    def get_route(self, source: str, destination: str) -> dict:
        try:
            source_lat, source_lng = self.geocode_location(source)
            dest_lat, dest_lng = self.geocode_location(destination)

            url = "https://routes.googleapis.com/directions/v2:computeRoutes"
            headers = {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": self.api_key,
                "X-Goog-FieldMask": "*"
            }

            body = {
                "origin": {"location": {"latLng": {"latitude": source_lat, "longitude": source_lng}}},
                "destination": {"location": {"latLng": {"latitude": dest_lat, "longitude": dest_lng}}},
                "travelMode": "DRIVE",
                "routingPreference": "TRAFFIC_AWARE"
            }

            response = requests.post(url, json=body, headers=headers)
            response.raise_for_status()
            data = response.json()
            print("Route dataaaaaaaaaaaaaaaaaaaaaaa:", data)
            if not data.get("routes"):
                result_model = RouteResponse(
                    source="",
                    destination="",
                    distance_meters=0,
                    duration="",
                    fuel_estimate_liters=None,
                    toll_info=[],
                    route_labels=[],
                    warnings=["Unable to fetch route."],
                    summary=""
                )
                return result_model.model_dump()
            route = data["routes"][0]

            duration = route.get("duration")
            distance = route.get("distanceMeters")
            toll_info = route.get("travelAdvisory", {}).get("tollInfo", {}).get("estimatedPrice", [])
            fuel_micro = route.get("travelAdvisory", {}).get("fuelConsumptionMicroliters")
            fuel_liters = round(fuel_micro / 1_000_000, 2) if fuel_micro else None
            warnings = route.get("warnings", [])
            labels = route.get("routeLabels", [])

            summary = (
                f"Route from {source} to {destination} is "
                f"{round(distance * 0.000621371, 2)} miles and takes approx "
                f"{round(int(duration.replace('s', '')) / 60, 1)} minutes."
            )

            result_model = RouteResponse(
                source=source,
                destination=destination,
                distance_meters=distance,
                duration=duration,
                fuel_estimate_liters=fuel_liters,
                toll_info=toll_info,
                route_labels=labels,
                warnings=warnings,
                summary=summary
            )

            return result_model.model_dump()

        except Exception as e:
            result_model = RouteResponse(
                    source="",
                    destination="",
                    distance_meters=0,
                    duration="",
                    fuel_estimate_liters=None,
                    toll_info=[],
                    route_labels=[],
                    warnings=["Exception:"& str(e)],
                    summary=""
                )
            return result_model.model_dump()

# Example :
# agent = RouteAgent(api_key="AIzaSy...")
# result = agent.get_route("Boston, MA", "New York, NY")
# print(result)