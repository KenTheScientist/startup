// History of creates, fills, expenses, and deletes for the selected budget.
import { findBudget, money } from '../budgets/storage';

export default function Activity({ budget }) {
    // Newest entries are stored first, so the table shows recent actions at the top.
    const rows = findBudget(budget?.code)?.activity || [];

    return (
        <main>
            <h2>Activity</h2>
            <p>Activity log for this budget.</p>

            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>User</th>
                            <th>Details</th>
                            <th>Amount</th>
                            <th>Envelope</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan="5">No activity yet.</td>
                            </tr>
                        )}
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td>{row.type}</td>
                                <td>{row.user}</td>
                                <td>{row.details}</td>
                                {/* Some rows have no dollar amount. Show a dash instead of "$0.00". */}
                                <td>{row.amount == null ? '—' : money(row.amount)}</td>
                                <td>{row.envelope}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
