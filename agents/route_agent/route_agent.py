from uagents import Agent, Context, Protocol
from pydantic import BaseModel
import requests

# Define the expected input model
class RouteRequest(BaseModel):
    source: str
    destination: str
    api_key: str

# Define the response model
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

# Initialize public agent
route_agent = Agent(
    name="RouteAgent",
    seed=None,
    public=True
)

# Helper to geocode addresses
def geocode_location(place_name: str, api_key: str):
    geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": place_name,
        "key": api_key
    }
    response = requests.get(geocode_url, params=params)
    response.raise_for_status()
    data = response.json()

    if data["status"] == "OK":
        location = data["results"][0]["geometry"]["location"]
        return location["lat"], location["lng"]
    else:
        raise Exception(f"Geocoding failed for '{place_name}': {data['status']}")

# Define protocol
route_protocol = Protocol("RouteProtocol")

@route_protocol.on_message(model=RouteRequest)
async def handle_route(ctx: Context, sender: str, message: RouteRequest):
    try:
        source_name = message.source
        destination_name = message.destination
        api_key = message.api_key

        ctx.logger.info(f"Routing: {source_name} → {destination_name}")

        source_lat, source_lng = geocode_location(source_name, api_key)
        dest_lat, dest_lng = geocode_location(destination_name, api_key)

        url = "https://routes.googleapis.com/directions/v2:computeRoutes"
        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
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
        route = data["routes"][0]

        duration = route.get("duration")
        distance = route.get("distanceMeters")
        toll_info = route.get("travelAdvisory", {}).get("tollInfo", {}).get("estimatedPrice", [])
        fuel_micro = route.get("travelAdvisory", {}).get("fuelConsumptionMicroliters")
        fuel_liters = round(fuel_micro / 1_000_000, 2) if fuel_micro else None
        warnings = route.get("warnings", [])
        labels = route.get("routeLabels", [])

        summary = (
            f"Route from {source_name} to {destination_name} is "
            f"{round(distance * 0.000621371, 2)} miles and takes approx "
            f"{round(int(duration.replace('s', '')) / 60, 1)} minutes."
        )

        result_model = RouteResponse(
            source=source_name,
            destination=destination_name,
            distance_meters=distance,
            duration=duration,
            fuel_estimate_liters=fuel_liters,
            toll_info=toll_info,
            route_labels=labels,
            warnings=warnings,
            summary=summary
        )

        await ctx.send(sender, result_model)

    except Exception as e:
        ctx.logger.error(f"RouteAgent error: {e}")
        await ctx.send(sender, {"error": str(e)})

# Register protocol
route_agent.include(route_protocol)

@route_agent.on_event("startup")
async def say_hello(ctx: Context):
    ctx.logger.info(f"RouteAgent is live! Address: {ctx.agent.address}")

if __name__ == "__main__":
    route_agent.run()
