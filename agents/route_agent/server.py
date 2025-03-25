from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from test import agent, RouteRequest, message_queue
import uvicorn
from threading import Thread

app = FastAPI()

@app.post("/trigger")
async def trigger(request: Request):
    try:
        data = await request.json()
        print("✅ Received from frontend:", data)

        route_req = RouteRequest(
            source=data["source"],
            destination=data["destination"],
            api_key="API-KEY"
        )

        await message_queue.put(route_req)
        return JSONResponse(content={"status": "Queued RouteRequest to send"})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)

def run_agent():
    agent.run()

if __name__ == "__main__":
    Thread(target=run_agent).start()
    uvicorn.run(app, host="127.0.0.1", port=8001)