import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateItinerary(details) {
    const { destination, startDate, endDate, travelers, budget } = details;
    const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
    
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting generation with model: ${modelName}`);
        const model = this.genAI.getGenerativeModel({ model: modelName });
        
        const prompt = `
          You are a premium AI travel planner. Create a detailed travel itinerary for the following trip:
          - Destination: ${destination}
          - Dates: ${startDate} to ${endDate}
          - Travelers: ${travelers}
          - Total Budget: ${budget} INR

          Strict Requirements:
          1. All cost estimates MUST be in INR.
          2. The output MUST be a valid JSON object only. No markdown formatting, no code blocks.
          3. Itinerary should be day-by-day.
          4. Include a smart packing list tailored to the weather of the destination during those dates.
          5. Include a budget breakdown by category (Accommodation, Food, Transport, Activities).
          6. Provide a daily local tip for each day.

          JSON Schema:
          {
            "tripSummary": {
              "destination": "string",
              "totalEstimatedCost": number,
              "weatherOverview": "string"
            },
            "days": [
              {
                "day": number,
                "date": "string",
                "theme": "string",
                "activities": [
                  { "name": "string", "info": "string", "cost": number, "timing": "string" }
                ],
                "localTip": "string"
              }
            ],
            "budgetBreakdown": {
              "accommodation": number,
              "food": number,
              "transport": number,
              "activities": number
            },
            "packingList": {
              "clothing": ["string"],
              "gear": ["string"],
              "documents": ["string"]
            }
          }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);

      } catch (error) {
        console.warn(`Model ${modelName} failed:`, error.message);
        lastError = error;
        
        // Switch to next model if hit by Rate Limit (429), Model Not Found (404), or Service Unavailable (503)
        const isRecoverable = 
          error.message.includes("429") || 
          error.message.includes("quota") ||
          error.message.includes("404") ||
          error.message.includes("not found") ||
          error.message.includes("503") ||
          error.message.includes("overloaded");

        if (isRecoverable) {
          console.info(`Attempting fallback from ${modelName} due to recoverable error...`);
          continue;
        }
        
        // Stop if it's an Auth error (401/403) or other fatal issues
        break;
      }
    }

    throw new Error(lastError?.message || "Failed to generate itinerary with available models.");
  }

  static getMockData(destination) {
    return {
      tripSummary: {
        destination: destination,
        totalEstimatedCost: 85000,
        weatherOverview: "Pleasant and sunny with average temperatures around 22°C."
      },
      days: [
        {
          day: 1,
          date: "2024-06-01",
          theme: "Cultural Immersion",
          activities: [
            { name: "Old Town Exploration", info: "Guided walking tour through historic districts.", cost: 1500, timing: "10:00 AM - 1:00 PM" },
            { name: "Local Culinary Workshop", info: "Learn to cook authentic regional dishes.", cost: 4500, timing: "4:00 PM - 7:00 PM" }
          ],
          localTip: "Wear comfortable walking shoes and keep some small change for street vendors."
        },
        {
          day: 2,
          date: "2024-06-02",
          theme: "Nature & Relaxation",
          activities: [
            { name: "Botanical Garden Visit", info: "Relaxing morning amongst rare flora.", cost: 800, timing: "9:00 AM - 11:30 AM" },
            { name: "Sunset Cruise", info: "Evening cruise along the coast with dinner.", cost: 6000, timing: "5:30 PM - 8:30 PM" }
          ],
          localTip: "Carry a light jacket as it can get breezy on the water in the evening."
        }
      ],
      budgetBreakdown: {
        accommodation: 45000,
        food: 20000,
        transport: 10000,
        activities: 10000
      },
      packingList: {
        clothing: ["Light linen shirts", "Comfortable walking shoes", "Sunglasses"],
        gear: ["Portable power bank", "Universal travel adapter"],
        documents: ["Travel insurance copy", "Digital maps offline"]
      }
    };
  }
}
