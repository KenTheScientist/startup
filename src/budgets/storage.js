// Stand-in for the database. Home can be joined with code XLKDN.
const seed = [
    { name: 'Home', code: 'XLKDN', owner: 'Sarah', members: ['Sarah', 'Jim'], funds: 1350 },
    { name: 'Vacation Club', code: 'Q9T2M', owner: 'Ken', members: ['Ken'], funds: 500 },
];

export function loadBudgets() {
    const saved = localStorage.getItem('budgets');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('budgets', JSON.stringify(seed));
    return seed;
}

export function saveBudgets(budgets) {
    localStorage.setItem('budgets', JSON.stringify(budgets));
}

export function randomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
