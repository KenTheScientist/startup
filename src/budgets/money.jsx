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
