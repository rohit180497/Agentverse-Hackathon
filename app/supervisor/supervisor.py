from supervisor.memory import SessionMemory
from supervisor.extractor import extract_trip_details

class SupervisorAgent:
    def __init__(self):
        self.memory = SessionMemory()

    def chat(self, user_input: str):
        extracted = extract_trip_details(user_input)

        if "error" in extracted:
            print("[⚠️ Extractor Error]", extracted["details"])
            return {
                "message": extracted.get("fallback_message", "Sorry, I couldn't understand. Could you rephrase?"),
                "trip_details": self.memory.get(),
                "ready": False
            }

        # Log extracted structured data
        # print("[Extracted Trip Info]", extracted)

        # self.memory.update(**{k: v for k, v in extracted.items() if v is not None})
        self.memory.update(**{k: v for k, v in extracted.items() if k in self.memory.trip_data and v is not None})


        if self.memory.is_complete():
            print("[🧳 All Trip Details Received]", self.memory.get_trip_details())
            return {
                "message": "✅ All trip details received. Starting TravelGenie agents...",
                "trip_details": self.memory.get_trip_details(),
                "ready": True
            }
        else:
            missing = self.memory.get_missing_fields()
            return {
                "message": f"✏️ I still need the following: {', '.join(missing)}.",
                "trip_details": self.memory.get_trip_details(),
                "ready": False
            }
