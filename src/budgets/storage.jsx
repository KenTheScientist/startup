// Stand-in for the database. Every budget is saved in the browser under the key "budgets".

// Older saved budgets may not have envelopes or an activity log yet. Fill those in
// so the rest of the app can assume both lists exist.
function withDefaults(budget) {
    return {
        ...budget,
        envelopes: budget.envelopes || [],
        activity: budget.activity || [],
    };
}

// Read every budget. Returns an empty list when nothing has been saved yet.
export function loadBudgets() {
    const saved = localStorage.getItem('budgets');
    const budgets = (saved ? JSON.parse(saved) : []).map(withDefaults);
    localStorage.setItem('budgets', JSON.stringify(budgets));
    return budgets;
}

// Replace the full budget list in localStorage.
export function saveBudgets(budgets) {
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

// Look up one budget by its join code. Returns undefined when the code does not match.
export function findBudget(code) {
    return loadBudgets().find((budget) => budget.code === code);
}

// Change one budget, save the whole list, and leave every other budget alone.
export function updateBudget(code, change) {
    const budgets = loadBudgets().map((budget) => {
        if (budget.code !== code) return budget;
        return change(budget);
    });
    saveBudgets(budgets);
}

// Show a number as US dollars. 12.5 becomes "$12.50".
export function money(amount) {
    return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

// Round to the nearest cent so 0.1 + 0.2 does not become 0.30000000000000004.
export function cents(amount) {
    return Math.round(amount * 100) / 100;
}

// Build a 5-character join code from letters and digits, such as "XLKDN".
export function randomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        const index = Math.floor(Math.random() * chars.length);
        code += chars[index];
    }
    return code;
}
