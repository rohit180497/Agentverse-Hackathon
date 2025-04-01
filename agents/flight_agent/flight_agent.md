# ✈️ FlightFinderAgent

![tag : innovation-lab](https://img.shields.io/badge/innovation--lab-3D8BD3) ![tag : travel](https://img.shields.io/badge/travel-orange) ![tag : flights](https://img.shields.io/badge/flights-blue) ![tag : booking](https://img.shields.io/badge/booking-green) ![tag : amadeus](https://img.shields.io/badge/amadeus-lightgrey) ![tag : mobility](https://img.shields.io/badge/mobility-yellow) ![tag : transportation](https://img.shields.io/badge/transportation-red)

**Domain:** Travel / Mobility / Flight Search  
**Agent Type:** Specialized AI Agent for flight options using Amadeus API  
**Status:** Public and Live on Agentverse

---

## 🧭 Overview

`FlightFinderAgent` is a smart AI agent that searches for real-time flight options between two cities using the **Amadeus API**. It provides key details like price, duration, carrier, and timings, making it ideal for building intelligent travel planners and booking systems.

Given the origin, destination, and travel dates, this agent returns:
- Top 10 cheapest flight options
- Price & currency
- Departure/Arrival times
- Airline carrier and duration

---

## 📥 Input Format

Send a `FlightRequest` model:
```python
class FlightRequest(Model):
    origin_city: str
    destination_city: str
    departure_date: str  # Format: YYYY-MM-DD
    return_date: Optional[str] = None
    adults: int = 1
    api_key: str         # Amadeus API Key
    secret_key: str      # Amadeus API Secret
```

### ✅ Example Input
```python
FlightRequest(
    origin_city="Boston",
    destination_city="New York",
    departure_date="2025-04-05",
    return_date="2025-04-10",
    adults=1,
    api_key="<YOUR_AMADEUS_API_KEY>",
    secret_key="<YOUR_AMADEUS_SECRET>"
)
```

---

## 📤 Output Format

Returns a list of `FlightResponse` options:
```python
class FlightResponse(Model):
    price: str
    currency: str
    segments: List[FlightSegment]

class FlightSegment(Model):
    from_airport: str
    to_airport: str
    departure: str
    arrival: str
    carrier_code: str
    duration: str
```

---

### ✅ Example Output

```
10 flight option(s) received: 

Option 1 - 💸 238.99 USD
  ✈️ BOS → ATL | 2025-04-05T06:00:00 → 2025-04-05T08:47:00 | F9 | PT2H47M
  ✈️ ATL → LGA | 2025-04-05T13:18:00 → 2025-04-05T15:30:00 | F9 | PT2H12M
  ✈️ LGA → ATL | 2025-04-10T16:20:00 → 2025-04-10T18:55:00 | F9 | PT2H35M
  ✈️ ATL → BOS | 2025-04-10T21:57:00 → 2025-04-11T00:31:00 | F9 | PT2H34M

Option 2 - 💸 240.96 USD
  ✈️ BOS → ATL | 2025-04-05T06:00:00 → 2025-04-05T08:47:00 | F9 | PT2H47M
  ✈️ ATL → LGA | 2025-04-05T13:18:00 → 2025-04-05T15:30:00 | F9 | PT2H12M
  ✈️ LGA → DFW | 2025-04-10T22:00:00 → 2025-04-11T00:42:00 | F9 | PT3H42M
  ✈️ DFW → BOS | 2025-04-11T06:00:00 → 2025-04-11T10:45:00 | F9 | PT3H45M

Option 3 - 💸 300.99 USD
  ✈️ BOS → SLK | 2025-04-05T07:25:00 → 2025-04-05T09:17:00 | B6 | PT1H52M
  ✈️ SLK → JFK | 2025-04-05T10:22:00 → 2025-04-05T12:25:00 | B6 | PT2H3M
  ✈️ LGA → BOS | 2025-04-10T10:59:00 → 2025-04-10T12:13:00 | B6 | PT1H14M
```

---

## ⚙️ How to Use This Agent

### 1. Install Requirements
```bash
pip install uagents requests python-dotenv
```

---

## 🔑 Get Your Amadeus API Key

1. Visit [https://developers.amadeus.com](https://developers.amadeus.com)
2. Sign up → Create an App → Choose **Self-Service** plan
3. Copy your `API Key` and `Secret`
4. Save in `.env`:
   ```env
   AMADEUS_API_KEY=your_key_here
   AMADEUS_SECRET_KEY=your_secret_here
   ```

---

## 📂 Source Code
[GitHub Project](https://github.com/rohit180497/Agentverse-Hackathon/tree/main/agents/flight_agent)

---

## 👨‍💻 Credits

Built for the **Fetch.ai Global AI Agents League Hackathon**  
By: [Rohit Kosamkar](https://github.com/rohit180497)

---

*Feel free to contribute or raise issues for improvements.*