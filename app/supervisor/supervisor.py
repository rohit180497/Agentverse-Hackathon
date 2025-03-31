from supervisor.memory import SessionMemory
from supervisor.extractor import extract_trip_details
from supervisor.intent_classifier import is_travel_query 
from datetime import datetime

class SupervisorAgent:
    def __init__(self):
        self.memory = SessionMemory()

    def chat(self, user_input: str, chat_history: None):
        chat_history = chat_history or []
        
        is_travel_check = is_travel_query(user_input, chat_history)
        print("Check: ", is_travel_check)
        try:
            if not is_travel_query(user_input, chat_history):
                print(is_travel_query)

                print("[🧭 Not a travel-related message]")
                return {
                    "message": (
                        "Hey there! I'm TravelGenie, your go-to trip planner! ✈️\n"
                        "Need help organizing an amazing trip? Just let me know where you're coming from, where you're headed, and when you're planning to travel. I'll take care of the rest! 😊\n\n"
                    ),
                    "trip_details": self.memory.get_trip_details(),
                    "ready": False
                }
            
            extracted = extract_trip_details(user_input)

            if "error" in extracted:
                print("[⚠️ Extractor Error]", extracted["details"])
                return {
                    "message": extracted.get("fallback_message", "Sorry, I couldn't understand. Could you rephrase?"),
                    "trip_details": self.memory.get_trip_details(),
                    "ready": False
                }

            # self.memory.update(**{k: v for k, v in extracted.items() if v is not None})
            self.memory.update(**{k: v for k, v in extracted.items() if k in self.memory.trip_data and v is not None})

            # Validation: source ≠ destination and start_date ≠ end_date
            if self.memory.trip_data["source"] and self.memory.trip_data["destination"]:
                if self.memory.trip_data["source"].lower() == self.memory.trip_data["destination"].lower():
                    return {
                        "message": "Your source and destination are the same. Please update one of them to continue planning.",
                        "trip_details": self.memory.get_trip_details(),
                        "ready": False
                    }

            if self.memory.trip_data["start_date"] and self.memory.trip_data["end_date"]:
                if self.memory.trip_data["start_date"] == self.memory.trip_data["end_date"]:
                    return {
                        "message": "Your start and return dates are the same. Please provide a valid travel range.",
                        "trip_details": self.memory.get_trip_details(),
                        "ready": False
                    }

            if self.memory.is_complete():
                try:
                    start_date = datetime.strptime(self.memory.trip_data["start_date"], "%Y-%m-%d")
                    end_date = datetime.strptime(self.memory.trip_data["end_date"], "%Y-%m-%d")
                    trip_duration = (end_date - start_date).days
                    if trip_duration > 14:  #trip threshold
                        return {
                            "message": "Please provide valid travel dates. The trip is too long to generate itinerary.",
                            "trip_details": self.memory.get_trip_details(),
                            "ready": False
                        }
                except Exception as e:
                    print("[⚠️ Date Parsing Error]", e)
                    return {
                        "message": "There was an error reading your travel dates. Please try again.",
                        "trip_details": self.memory.get_trip_details(),
                        "ready": False
                    }
                print("[🧳 All Trip Details Received]", self.memory.get_trip_details())
                return {
                    "message": (
                        f"All trip details received!\n\n"
                        f"From {self.memory.trip_data['source'].upper()} to {self.memory.trip_data['destination'].upper()}\n"
                        f"Travel Dates: {self.memory.trip_data['start_date']} to {self.memory.trip_data['end_date']}\n\n"
                    ),
                    "trip_details": self.memory.get_trip_details(),
                    "ready": True
                }
            else:
                missing = self.memory.get_missing_fields()
                pretty_missing = [field.replace("_", " ").title() for field in missing]

                return {
                    "message": (
                        f"I'm just a step away! To get started, I still need a few more trip details from you. "
                        f"{', '.join(pretty_missing)}.\n\n"
                        f"Just type it in and I'll take care of the rest!!"
                    ),
                    "trip_details": self.memory.get_trip_details(),
                    "ready": False
                }
        except Exception as e:
            # Handle any unexpected errors
            print("[🚨 SupervisorAgent Error]", str(e))
            return {
                "message": "🚨 Oops! Something went wrong while processing your request. Please try again.",
                "trip_details": self.memory.get_trip_details(),
                "ready": False
            }