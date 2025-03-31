import requests
from typing import List
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

# --------------------- Models ---------------------
class FlightSegment(BaseModel):
    from_airport: str
    to_airport: str
    departure: str
    arrival: str
    carrier_code: str
    duration: str

class FlightOption(BaseModel):
    price: str
    currency: str
    segments: List[FlightSegment]

# ------------------ Amadeus API Wrapper ------------------
class AmadeusFlightSearch:
    def __init__(self, api_key: str, api_secret: str):
        self.api_key = api_key
        self.api_secret = api_secret
        self.access_token = self._get_access_token()
        self.iata_cache = {}  # local memory cache

    def _get_access_token(self) -> str:
        url = "https://test.api.amadeus.com/v1/security/oauth2/token"
        data = {
            "grant_type": "client_credentials",
            "client_id": self.api_key,
            "client_secret": self.api_secret
        }
        response = requests.post(url, data=data)
        if response.status_code != 200:
            raise Exception(f"Failed to get access token: {response.text}")
        return response.json()["access_token"]

    def get_iata_code(self, city_name: str) -> str:
        city_key = city_name.lower().strip()

        if city_key in self.iata_cache:
            return self.iata_cache[city_key]

        url = "https://test.api.amadeus.com/v1/reference-data/locations"
        params = {"keyword": city_name, "subType": "CITY"}
        headers = {"Authorization": f"Bearer {self.access_token}"}

        res = requests.get(url, headers=headers, params=params)
        if res.status_code == 429:
            print("Rate limited: Too many location requests. Try again later.")
            return ""
        res.raise_for_status()
        data = res.json()

        if not data.get("data"):
            # raise ValueError(f"No IATA code found for city: '{city_name}'")
            print(f"No IATA code found for city: '{city_name}'")
            iata_code = ""
            return iata_code
        iata_code = data["data"][0]["iataCode"]
        self.iata_cache[city_key] = iata_code
        return iata_code

    def search_flights(
        self,
        origin_city: str,
        destination_city: str,
        departure_date: str,
        return_date: str = None,
        adults: int = 1,
        max_results: int = 10
    ) -> List[FlightOption]:
        origin = self.get_iata_code(origin_city)
        destination = self.get_iata_code(destination_city)
        print("origin, destination",origin, destination)
        raw_data = []
        if origin == "" or destination == "":
            print("Invalid IATA code for origin or destination.")
            return raw_data
        url = "https://test.api.amadeus.com/v2/shopping/flight-offers"
        headers = {"Authorization": f"Bearer {self.access_token}"}
        params = {
            "originLocationCode": origin,
            "destinationLocationCode": destination,
            "departureDate": departure_date,
            "adults": adults,
            "currencyCode": "USD",
            "max": max_results
        }
        if return_date:
            params["returnDate"] = return_date

        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 429:
            raise Exception("❌ Rate limited: Too many flight searches. Try again later.")
        response.raise_for_status()

        
        for i, offer in enumerate(response.json().get("data", []), start=1):
            price = f"{offer['price']['total']} {offer['price']['currency']}"
            for itinerary in offer["itineraries"]:
                for segment in itinerary["segments"]:
                    flat_row = {
                        "option": i,
                        "price": price,
                        "from": segment["departure"]["iataCode"],
                        "to": segment["arrival"]["iataCode"],
                        "departure": segment["departure"]["at"],
                        "arrival": segment["arrival"]["at"],
                        "airline": segment["carrierCode"],
                        "duration": segment["duration"]
                    }
                    raw_data.append(flat_row)

        return raw_data

# ------------------ Main Execution ------------------
if __name__ == "__main__":
    API_KEY = os.getenv("AMADEUS_API_KEY")
    API_SECRET = os.getenv("AMADEUS_SECRET_KEY")

    if not API_KEY or not API_SECRET:
        raise EnvironmentError("❌ Missing API credentials in environment variables.")

    client = AmadeusFlightSearch(api_key=API_KEY, api_secret=API_SECRET)

    try:
        flights = client.search_flights(
            origin_city="Boston",
            destination_city="New York",  
            departure_date="2025-04-05",
            return_date="2025-04-10",
            adults=1
        )

        print("\n🛫 Top Flight Options:")
        for i, flight in enumerate(flights, 1):
            print(f"\nOption {i} - Price: {flight.price} {flight.currency}")
            for seg in flight.segments:
                print(f"  {seg.from_airport} → {seg.to_airport} on {seg.departure} by {seg.carrier_code} ({seg.duration})")

    except Exception as e:
        print("❌ Error:", e)
