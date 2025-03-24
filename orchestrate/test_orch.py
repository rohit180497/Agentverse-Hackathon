from uagents import Agent, Bureau, Context
from orchestrator import orchestrator, FrontendRequest
import asyncio

# Create a Test Agent to simulate Frontend
test_agent = Agent(name="FrontendTestAgent")

@test_agent.on_event("startup")
async def send_test_request(ctx: Context):
    frontend_message = FrontendRequest(
        source_city="Boston, MA",
        destination_city="New York, NY",
        travel_start_date="2025-04-15",
        travel_end_date="2025-04-20",
        no_of_people=1
    )

    # send message to orchestrator
    await ctx.send(orchestrator.address, frontend_message)

# Initialize Bureau to manage agents
bureau = Bureau()
bureau.add(orchestrator)
bureau.add(test_agent)

if __name__ == "__main__":
    bureau.run()
