import './style.css';
import { GeminiService } from './GeminiService';
import { Renderer } from './Renderer';

const destinationInput = document.getElementById('destination');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const travelersInput = document.getElementById('travelers');
const budgetInput = document.getElementById('budget');
const generateBtn = document.getElementById('generate-btn');
const resultsArea = document.getElementById('results-area');
const statusDot = document.getElementById('status-dot');

// Initialize API
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let geminiService = null;

if (apiKey && apiKey !== 'your_api_key_here') {
  geminiService = new GeminiService(apiKey);
  statusDot.style.background = '#10b981'; // Green for ready
} else {
  console.warn("Gemini API Key missing in .env file.");
}

generateBtn.addEventListener('click', async () => {
  const details = {
    destination: destinationInput.value,
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    travelers: travelersInput.value,
    budget: budgetInput.value
  };

  // 1. Validation
  if (!validateForm(details)) return;

  // 2. Loading State
  Renderer.renderLoading(resultsArea);
  generateBtn.disabled = true;
  generateBtn.innerText = "Planning...";

  try {
    let data;
    // Use mock data if API key is not set for demo purposes
    if (!geminiService) {
      console.info("Using mock data because API key is missing.");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
      data = GeminiService.getMockData(details.destination);
    } else {
      data = await geminiService.generateItinerary(details);
    }

    // 3. Render Results
    Renderer.renderResults(resultsArea, data, details.budget);
    
    // Smooth scroll to results
    resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (error) {
    resultsArea.innerHTML = `
      <div class="glass-card" style="padding: 2rem; border-color: var(--secondary-accent)">
        <h3 style="color: var(--secondary-accent)">Oops! Something went wrong</h3>
        <p class="muted">${error.message}</p>
        <button class="btn-primary" style="margin-top: 1rem" onclick="window.location.reload()">Try Again</button>
      </div>
    `;
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerText = "Generate Itinerary";
  }
});

function validateForm(details) {
  if (!details.destination || !details.startDate || !details.endDate || !details.budget) {
    alert("Please fill in all fields.");
    return false;
  }

  const start = new Date(details.startDate);
  const end = new Date(details.endDate);
  const now = new Date();
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(now.getMonth() + 6);

  if (start < now.setHours(0,0,0,0)) {
    alert("Start date cannot be in the past.");
    return false;
  }

  if (start > sixMonthsFromNow) {
    alert("Travel must be within 6 months from today.");
    return false;
  }

  if (end < start) {
    alert("End date must be after the start date.");
    return false;
  }

  return true;
}

