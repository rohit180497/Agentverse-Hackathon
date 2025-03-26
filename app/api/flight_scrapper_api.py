# app/api/flight_api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agents.flight_scrapper_agent import FlightSearcher
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "🚀 TravelGenie Flight Scraper API is running!"}

class FlightSearchRequest(BaseModel):
    from_city: str
    to_city: str
    departure_date: str  # format: YYYY-MM-DD
    return_date: str      # format: YYYY-MM-DD

@app.post("/search-flights")
def search_flights(payload: FlightSearchRequest):
    try:
        print("🔍 Flight search API triggered")

        searcher = FlightSearcher(
            from_city=payload.from_city,
            to_city=payload.to_city,
            departure_date=payload.departure_date,
            return_date=payload.return_date
        )

        result = searcher.run_search()
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run using: uvicorn api.flight_api:app --reload
if __name__ == "__main__":
    uvicorn.run("api.flight_api:app", host="0.0.0.0", port=8000, reload=True)
