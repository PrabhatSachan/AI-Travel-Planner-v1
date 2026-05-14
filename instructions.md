# Implementation Instructions: AI Travel Itinerary Planner

This document provides guidelines for implementing the AI Travel Itinerary Planner. Follow these instructions to ensure consistency in design and functionality.

## Project Overview
A premium web application that generates AI-powered travel itineraries based on destination, dates (max 6 months out), number of travelers, and budget (INR). It uses the **Google Gemini 2.0 Flash** (or higher) API for real-time data accuracy and superior performance.

## Tech Stack
- **Framework**: Vite (Vanilla JS template)
- **Styling**: Vanilla CSS (no Tailwind unless requested)
- **AI Engine**: `@google/generative-ai`
    - **CRITICAL**: Use exact model names: **`gemini-2.0-flash`** or **`gemini-2.5-flash`** (or latest available). Lower versions like `gemini-1.5` or `gemini-pro` are not accessible in this environment. Always verify the latest string literals in the SDK.
- **Assets**: High-quality generated imagery (e.g., `hero-bg.png`)

## Design Principles
1. **Liquid Glass Aesthetic**: Use glassmorphism (`backdrop-filter: blur()`), subtle gradients, and translucent surfaces.
2. **Dark-First Theme**: Core background `#0a0a0b`, with vibrant violet (`#8b5cf6`) and sunset (`#f43f5e`) accents.
3. **Premium Typography**: Use 'Inter' or 'Outfit' via Google Fonts.
4. **Micro-Animations**: Smooth transitions for card entries, hover effects on buttons, and a premium "thinking" animation for the AI.

## Core Features & Logic
- **Date Validation**: Travel must be in the future and at most 6 months from the current date.
- **Budgeting**: All estimates must be in **INR**. Gemini should be prompted to provide realistic daily cost breakdowns.
- **Detailed Output Screen**:
    - **Header**: High-impact trip summary (Destination, Dates, Travelers, Total Budget vs. Estimated Cost).
    - **Day-by-Day Itinerary**:
        - Vertical timeline or card-based view.
        - Each day includes: Date, Daily Theme, Attractions (Name, Brief Info, Cost in INR, Suggested Timing).
        - **Daily Local Tip**: Contextual advice (e.g., "Best time to visit", "Local etiquette").
    - **Budget Intelligence Panel**:
        - Dynamic visualization of expenses.
        - Category breakdown: Accommodation, Food, Transport, Activities.
        - Comparison of "Planned Budget" vs. "AI Estimated Total".
    - **Smart Packing Assistant**:
        - Weather-tailored suggestions (e.g., "Light linen for 30°C days").
        - Categorized: Clothing, Gear, Documents.
    - **Weather Forecast Card**: Real-time or seasonal atmospheric overview.
- **Responsive Layout**: Mobile-first design that scales beautifully to desktop with side-by-side view for itinerary and budget on larger screens.

## Implementation Roadmap
1. **Setup**: Initialize Vite, install `@google/generative-ai`.
2. **CSS Foundation**: Define the design system, variables, and glassmorphism utilities in `index.css`.
3. **HTML Structure**: Create a semantic layout with a Hero section, API Key input, and Itinerary display area.
4. **JS Core**:
    - Implement the `GeminiService` to handle API calls.
    - Build form validation and state management.
    - Create a dynamic renderer for the itinerary days.
5. **Polishing**: Add animations and verify responsive behavior.

## Verification
- Ensure the budget calculations are logically consistent across days.
- Verify that the "AI Thinking" state feels premium and responsive.
- Check that the packing suggestions align with the destination's current season.
