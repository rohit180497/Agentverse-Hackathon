# RouteAgent
**Domain:** travel

This agent calculates driving route details between a given source and destination using the Google Maps API. It returns distance, estimated travel time, fuel consumption, toll information, route labels (like fuel efficiency), and any warnings.

It leverages both the Google Geocoding API and Routes API to generate enriched travel insights.

---

### 📅 Example Input
```python
RouteRequest(
    source="Roxbury, Boston, MA",
    destination="New York, NY"
)
```

### 📊 Example Output
```python
RouteResponse(
    source='Roxbury, Boston, MA',
    destination='New York, NY',
    distance_meters=344017,
    duration='12605s',
    fuel_estimate_liters=23.7,
    toll_info=[{'currencyCode': 'USD', 'units': '15'}],
    route_labels=['DEFAULT_ROUTE', 'FUEL_EFFICIENT'],
    warnings=['This route has tolls'],
    summary='Route from Roxbury, Boston, MA to New York, NY is 344.02 km and takes approx 210 minutes.'
)
```

---

### 🔄 Usage Example
Copy and paste the following code into a new blank agent to interact with this RouteAgent:

```python
from uagents import Agent, Context, Model
from pydantic import BaseModel

class RouteRequest(Model):
    source: str
    destination: str

class RouteResponse(Model):
    source: str
    destination: str
    distance_meters: int
    duration: str
    fuel_estimate_liters: float | None = None
    toll_info: list | None = None
    route_labels: list | None = None
    warnings: list | None = None
    summary: str

agent = Agent()

ROUTE_AGENT_ADDRESS = "{{ .Agent.Address }}"  # Replace with actual RouteAgent address

@agent.on_event("startup")
async def send_message(ctx: Context):
    await ctx.send(ROUTE_AGENT_ADDRESS, RouteRequest(
        source="Roxbury, Boston, MA",
        destination="New York, NY"
    ))

@agent.on_message(model=RouteResponse)
async def handle_response(ctx: Context, sender: str, msg: RouteResponse):
    ctx.logger.info(f"Route summary: {msg.summary}")
    ctx.logger.info(f"Fuel: {msg.fuel_estimate_liters} liters | Toll: {msg.toll_info}")
    ctx.logger.info(f"Labels: {msg.route_labels} | Warnings: {msg.warnings}")

if __name__ == "__main__":
    agent.run()
```

---

### 💼 Agent Deployment

To deploy this agent:
1. Install dependencies:
```bash
pip install uagents requests python-dotenv
```

2. Create a `.env` file with:
```env
GOOGLE_MAPS_API_KEY=your_google_api_key_here
```

3. Set your agent as public and register it on [Agentverse](https://agentverse.ai)

---

### ⚡ Notes
- Requires both **Google Geocoding API** and **Google Routes API** to be enabled in your GCP project.
- To restrict your API key securely, refer to the [Google Maps Platform docs](https://developers.google.com/maps/gmp-get-started).

---

### 📍 API Pricing
- Google Maps offers $200/month free usage.
- Charges apply for excessive geocoding and routing calls.
- Refer to: https://cloud.google.com/maps-platform/pricing

---

### 🕹️ Tags
![tag : innovation-lab](https://img.shields.io/badge/innovation--lab-3D8BD3)

