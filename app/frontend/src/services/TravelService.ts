
import { TravelQuery, TripItinerary } from "../types/travel";

// This service would actually make backend API calls in a production app
export const TravelService = {
  generateItinerary: async (query: TravelQuery): Promise<void> => {
    console.log("Generating itinerary for:", query);
    // This would be an actual API call to your backend
    // For now, we'll just return a promise that resolves after a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  },
  
  // This would fetch the actual itinerary data from your backend
  // For now it returns mock data after a delay
  fetchItinerary: async (query: TravelQuery): Promise<TripItinerary> => {
    console.log("Fetching itinerary for:", query);
    
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          route: {
            distance: "1,243 km",
            duration: "14 hours by air",
            map: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb"
          },
          weather: {
            temperature: 24,
            condition: "Sunny",
            icon: "sun",
            forecast: [
              { date: "2023-07-01", high: 25, low: 18, condition: "Sunny", icon: "sun" },
              { date: "2023-07-02", high: 26, low: 19, condition: "Partly Cloudy", icon: "cloud-sun" },
              { date: "2023-07-03", high: 27, low: 20, condition: "Cloudy", icon: "cloud" }
            ]
          },
          flights: [
            {
              airline: "TravelAir",
              flightNumber: "TA123",
              departureTime: "08:00 AM",
              arrivalTime: "10:30 AM",
              duration: "2h 30m",
              price: 299
            },
            {
              airline: "SkyJet",
              flightNumber: "SJ456",
              departureTime: "01:15 PM",
              arrivalTime: "03:45 PM",
              duration: "2h 30m",
              price: 329
            }
          ],
          popularPlaces: [
            {
              id: "1",
              name: "Central Park",
              image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
              rating: 4.8,
              address: "Central Park, New York, NY",
              description: "Beautiful park with stunning views and trails."
            },
            {
              id: "2",
              name: "Empire State Building",
              image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
              rating: 4.7,
              address: "350 5th Ave, New York, NY 10118",
              description: "Iconic skyscraper with observation decks."
            },
            {
              id: "3",
              name: "Times Square",
              image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
              rating: 4.6,
              address: "Times Square, New York, NY",
              description: "Vibrant entertainment district with bright billboards."
            },
            {
              id: "4",
              name: "Statue of Liberty",
              image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
              rating: 4.8,
              address: "New York, NY 10004",
              description: "Iconic statue and symbol of freedom."
            }
          ],
          restaurants: [
            {
              id: "1",
              name: "The Gourmet Kitchen",
              image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
              rating: 4.7,
              cuisine: "French",
              priceRange: "$$$",
              address: "123 Culinary St, New York, NY"
            },
            {
              id: "2",
              name: "Ocean Blue",
              image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
              rating: 4.5,
              cuisine: "Seafood",
              priceRange: "$$",
              address: "456 Coastal Ave, New York, NY"
            },
            {
              id: "3",
              name: "Spice Route",
              image: "public/lovable-uploads/49c114c4-ef60-421b-b962-5d6954973320.png",
              rating: 4.8,
              cuisine: "Indian",
              priceRange: "$$",
              address: "789 Flavor Blvd, New York, NY"
            },
            {
              id: "4",
              name: "Urban Pizzeria",
              image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
              rating: 4.6,
              cuisine: "Italian",
              priceRange: "$",
              address: "101 Main St, New York, NY"
            }
          ],
          events: [
            {
              id: "1",
              name: "Broadway Musical: Hamilton",
              date: "2023-07-15",
              time: "7:30 PM",
              venue: "Richard Rodgers Theatre",
              category: "Theater",
              description: "Award-winning musical about Alexander Hamilton."
            },
            {
              id: "2",
              name: "New York Philharmonic",
              date: "2023-07-18",
              time: "8:00 PM",
              venue: "Lincoln Center",
              category: "Concert",
              description: "Classical music performance."
            },
            {
              id: "3",
              name: "NYC Food Festival",
              date: "2023-07-21",
              time: "11:00 AM - 8:00 PM",
              venue: "Bryant Park",
              category: "Food & Drink",
              description: "Featuring local restaurants and cuisine."
            },
            {
              id: "4",
              name: "Art Exhibition Opening",
              date: "2023-07-25",
              time: "6:00 PM",
              venue: "MoMA",
              category: "Art",
              description: "Modern art exhibition opening night."
            }
          ],
          summary: {
            highlights: [
              "Beautiful beaches with crystal clear water",
              "Vibrant local culture and friendly locals",
              "Excellent cuisine featuring fresh seafood"
            ],
            tips: [
              "Bring sunscreen and a hat for sun protection",
              "Try the local specialty dishes",
              "Visit popular attractions early to avoid crowds"
            ],
            budget: "Estimated daily budget: $150-200 USD",
            bestTimeToVisit: "May to September for optimal weather"
          }
        });
      }, 3000);
    });
  }
};
