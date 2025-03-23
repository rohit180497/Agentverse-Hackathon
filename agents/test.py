from route_agent import geocode_location, GOOGLE_MAPS_API_KEY
import requests

def get_route_info(source_name: str, destination_name: str):
    # Geocode
    source_lat, source_lng = geocode_location(source_name)
    dest_lat, dest_lng = geocode_location(destination_name)

    url = "https://routes.googleapis.com/directions/v2:computeRoutes"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "*"
    }

    body = {
        "origin": {
            "location": {
                "latLng": {"latitude": source_lat, "longitude": source_lng}
            }
        },
        "destination": {
            "location": {
                "latLng": {"latitude": dest_lat, "longitude": dest_lng}
            }
        },
        "travelMode": "DRIVE",
        "routingPreference": "TRAFFIC_AWARE"
    }

    response = requests.post(url, json=body, headers=headers)
    response.raise_for_status()
    data = response.json()
    route = data["routes"][0]

    # Extract additional fields
    duration = route.get("duration")
    distance = route.get("distanceMeters")
    polyline = route.get("polyline", {}).get("encodedPolyline", "")
    steps = route.get("legs", [{}])[0].get("steps", [])

    toll_price = route.get("travelAdvisory", {}).get("tollInfo", {}).get("estimatedPrice", [])
    fuel_micro = route.get("travelAdvisory", {}).get("fuelConsumptionMicroliters")
    fuel_liters = round(fuel_micro / 1_000_000, 2) if fuel_micro else None
    warnings = route.get("warnings", [])
    labels = route.get("routeLabels", [])

    summary = f"Route from {source_name} to {destination_name} is {round(distance / 1000, 2)} km and takes approx {round(int(duration.replace('s', '')) / 60, 1)} minutes."

    result = {
        "source": source_name,
        "destination": destination_name,
        "distance_meters": distance,
        "duration": duration,
        "fuel_estimate_liters": fuel_liters,
        "toll_info": toll_price,
        "route_labels": labels,
        "warnings": warnings,
        "polyline": polyline,
        "steps": steps[:3],  # Just previewing
        "summary": summary
    }

    return result

# 🔁 Run test
if __name__ == "__main__":
    result = get_route_info("Roxbury, Boston, MA", "New York, NY")
    for key, val in result.items():
        print(f"{key}: {val}")
