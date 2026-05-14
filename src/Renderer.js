export class Renderer {
  static renderResults(container, data, targetBudget) {
    container.innerHTML = "";
    
    // 1. Header Summary
    const summaryHtml = `
      <div class="glass-card fade-up" style="padding: 2rem; margin-bottom: 2rem; border-left: 6px solid var(--primary-accent)">
        <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem">Trip to ${data.tripSummary.destination}</h2>
        <p class="muted">${data.tripSummary.weatherOverview}</p>
        <div style="margin-top: 1.5rem; display: flex; gap: 2rem; align-items: center">
          <div>
            <span class="muted" style="font-size: 0.8rem; text-transform: uppercase">AI Estimated Cost</span>
            <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary-accent)">₹${data.tripSummary.totalEstimatedCost.toLocaleString()}</div>
          </div>
          <div style="width: 1px; height: 40px; background: var(--glass-border)"></div>
          <div>
            <span class="muted" style="font-size: 0.8rem; text-transform: uppercase">Your Budget</span>
            <div style="font-size: 1.8rem; font-weight: 700; color: ${data.tripSummary.totalEstimatedCost > targetBudget ? 'var(--secondary-accent)' : '#10b981'}">₹${Number(targetBudget).toLocaleString()}</div>
          </div>
        </div>
        ${data.tripSummary.totalEstimatedCost > targetBudget ? 
          `<div style="margin-top: 1rem; color: var(--secondary-accent); font-size: 0.9rem">⚠️ This trip might exceed your budget by ₹${(data.tripSummary.totalEstimatedCost - targetBudget).toLocaleString()}</div>` : 
          `<div style="margin-top: 1rem; color: #10b981; font-size: 0.9rem">✓ You're within budget!</div>`}
      </div>
    `;

    // 2. Budget Breakdown & Packing List Side-by-Side
    const panelsHtml = `
      <div class="budget-panel fade-up" style="animation-delay: 0.1s">
        <div class="glass-card" style="padding: 2rem">
          <h3 style="margin-bottom: 1.5rem">Budget Breakdown</h3>
          <div style="display: flex; flex-direction: column; gap: 1rem">
            ${this.renderBudgetBar("Accommodation", data.budgetBreakdown.accommodation, data.tripSummary.totalEstimatedCost)}
            ${this.renderBudgetBar("Food", data.budgetBreakdown.food, data.tripSummary.totalEstimatedCost)}
            ${this.renderBudgetBar("Transport", data.budgetBreakdown.transport, data.tripSummary.totalEstimatedCost)}
            ${this.renderBudgetBar("Activities", data.budgetBreakdown.activities, data.tripSummary.totalEstimatedCost)}
          </div>
        </div>
        <div class="glass-card" style="padding: 2rem">
          <h3 style="margin-bottom: 1.5rem">Smart Packing List</h3>
          <div style="display: grid; grid-template-columns: 1fr; gap: 1rem">
            ${this.renderPackingCategory("Clothing", data.packingList.clothing)}
            ${this.renderPackingCategory("Gear", data.packingList.gear)}
            ${this.renderPackingCategory("Documents", data.packingList.documents)}
          </div>
        </div>
      </div>
    `;

    // 3. Daily Itinerary
    const itineraryHtml = `
      <div class="fade-up" style="animation-delay: 0.2s">
        <h3 style="margin: 3rem 0 1.5rem; font-size: 1.8rem">Day-by-Day Itinerary</h3>
        ${data.days.map(day => `
          <div class="glass-card day-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem">
              <div>
                <span class="muted" style="font-size: 0.8rem; text-transform: uppercase">Day ${day.day} • ${day.date}</span>
                <h4 style="font-size: 1.4rem; color: var(--primary-accent)">${day.theme}</h4>
              </div>
              <div class="glass-card" style="padding: 8px 16px; font-size: 0.85rem; background: rgba(139, 92, 246, 0.1)">
                💡 ${day.localTip}
              </div>
            </div>
            <div style="display: grid; gap: 1rem">
              ${day.activities.map(act => `
                <div style="display: flex; gap: 1.5rem; padding: 1rem; border-radius: 12px; background: rgba(255,255,255,0.02)">
                  <div style="font-weight: 700; color: var(--secondary-accent); width: 100px">${act.timing}</div>
                  <div style="flex: 1">
                    <div style="font-weight: 600">${act.name}</div>
                    <div class="muted" style="font-size: 0.9rem">${act.info}</div>
                  </div>
                  <div style="font-weight: 700">₹${act.cost}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = summaryHtml + panelsHtml + itineraryHtml;
  }

  static renderBudgetBar(label, amount, total) {
    const percentage = Math.round((amount / total) * 100);
    return `
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 4px">
          <span>${label}</span>
          <span class="muted">₹${amount.toLocaleString()} (${percentage}%)</span>
        </div>
        <div style="width: 100%; height: 6px; background: var(--glass-border); border-radius: 3px; overflow: hidden">
          <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, var(--primary-accent), var(--secondary-accent))"></div>
        </div>
      </div>
    `;
  }

  static renderPackingCategory(label, items) {
    return `
      <div>
        <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; color: var(--primary-accent)">${label}</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px">
          ${items.map(item => `
            <span style="font-size: 0.8rem; padding: 4px 10px; background: rgba(255,255,255,0.05); border-radius: 20px; border: 1px solid var(--glass-border)">${item}</span>
          `).join('')}
        </div>
      </div>
    `;
  }

  static renderLoading(container) {
    container.innerHTML = `
      <div class="thinking-container fade-up">
        <div class="thinking-pulse"></div>
        <div style="text-align: center">
          <h3 style="margin-bottom: 8px">AI is crafting your journey...</h3>
          <p class="muted">Analyzing weather, calculating costs, and finding local gems.</p>
        </div>
      </div>
    `;
  }
}
