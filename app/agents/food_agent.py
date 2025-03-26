import requests
from pydantic import BaseModel
from typing import Optional, List


class FoodRequest(BaseModel):
    location: str
    api_key: str


class Restaurant(BaseModel):
    name: str
    address: str
    rating: float
    total_ratings: int
    types: List[str]
    photo_url: Optional[str]


class FoodResponse(BaseModel):
    location: str
    top_restaurants: List[Restaurant]


class FoodExplorerAgent:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_top_restaurants(self, location: str) -> dict:
        try:
            url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
            params = {
                "query": f"best restaurants in {location}",
                "type": "restaurant",
                "key": self.api_key
            }
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            restaurants = []
            for place in data.get("results", [])[:10]:
                photo_url = None
                if "photos" in place:
                    photo_reference = place["photos"][0]["photo_reference"]
                    photo_url = (
                        f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400"
                        f"&photoreference={photo_reference}&key={self.api_key}"
                    )

                restaurant = Restaurant(
                    name=place.get("name"),
                    address=place.get("formatted_address"),
                    rating=place.get("rating", 0.0),
                    total_ratings=place.get("user_ratings_total", 0),
                    types=place.get("types", []),
                    photo_url=photo_url
                )
                restaurants.append(restaurant)

            result = FoodResponse(location=location, top_restaurants=restaurants)
            return result.model_dump(mode="json")

        except Exception as e:
            return {"error": str(e)}


# Example usage
# if __name__ == "__main__":
#     import os
#     from dotenv import load_dotenv

#     load_dotenv()
#     GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

#     if not GOOGLE_API_KEY:
#         print("Please set GOOGLE_MAPS_API_KEY in your .env file")
#     else:
#         food_agent = FoodExplorerAgent(api_key=GOOGLE_API_KEY)
#         result = food_agent.get_top_restaurants("Boston")
#         print(result)
