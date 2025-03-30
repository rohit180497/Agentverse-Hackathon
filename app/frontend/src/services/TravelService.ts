import axios from "axios";
import { TravelQuery, TripItinerary } from "@/types/travel";

const API_BASE = "http://localhost:8000";

export const TravelService = {
  async generateItinerary(query: TravelQuery) {
    const firstMessage = {
      user: `I'm travelling from ${query.originCity} to ${query.destinationCity} on ${query.startDate} and returning on ${query.returnDate}`,
      bot: ""
    };

    await axios.post(`${API_BASE}/chat`, {
      message: firstMessage.user,
      history: [],
    });

    await axios.post(`${API_BASE}/chat`, {
      message: "yes",
      history: [firstMessage],
    });
  },

  async fetchItinerary(query: TravelQuery): Promise<TripItinerary> {
    const history = [
      {
        user: `I'm travelling from ${query.originCity} to ${query.destinationCity} on ${query.startDate} and returning on ${query.returnDate}`,
        bot: ""
      },
      { user: "yes", bot: "" }
    ];

    const res = await axios.post(`${API_BASE}/generate-itinerary`, {
      history,
    });

    return res.data.data;
  }
};
