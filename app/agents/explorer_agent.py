import requests
from pydantic import BaseModel
from typing import Optional
from pydantic import RootModel


# ----------- Models -----------
class ExploreRequest(BaseModel):
    location: str
    api_key: str

class Attraction(BaseModel):
    name: str
    address: str
    rating: float
    total_ratings: int
    photo_url: Optional[str]
    location: dict
    types: list[str]

class ExploreResponse(BaseModel):
    location: str
    attractions: list[Attraction]

# ----------- Class Wrapper -----------
class ExplorerAgent:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_attractions(self, location: str) -> dict:
        try:
            url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
            params = {
                "query": f"top attractions in {location}",
                "key": self.api_key
            }
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            attractions = []
            for place in data.get("results", [])[:10]:
                photo_url = None
                if "photos" in place:
                    photo_reference = place["photos"][0]["photo_reference"]
                    photo_url = (
                        f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400"
                        f"&photoreference={photo_reference}&key={self.api_key}"
                    )

                attraction = Attraction(
                    name=place.get("name"),
                    address=place.get("formatted_address"),
                    rating=place.get("rating"),
                    total_ratings=place.get("user_ratings_total"),
                    photo_url=photo_url,
                    location=place["geometry"]["location"],
                    types=place.get("types", [])
                )
                attractions.append(attraction)

            result = ExploreResponse(location=location, attractions=attractions)
            return result.model_dump(mode="json")

        except Exception as e:
            return {"error": str(e)}

# Example usage
# if __name__ == "__main__":
#     explorer = ExplorerAgent(api_key="YOUR_GOOGLE_MAPS_API_KEY")
#     results = explorer.get_attractions("Paris")
#     print(results)
