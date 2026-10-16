// Table of budgets the current user belongs to.
import { Link } from 'react-router-dom';
import { money } from './storage';

export default function BudgetTable({ budgets, userName, selectBudget }) {
    const mine = budgets.filter((budget) => budget.members.includes(userName));

    return (
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Join code</th>
                        <th>Owner</th>
                        <th>Members</th>
                        <th>Total funds</th>
                    </tr>
                </thead>
                <tbody>
                    {mine.length === 0 && (
                        <tr>
                            <td colSpan="5">You have no budgets yet. Create one or join with a code.</td>
                        </tr>
                    )}
                    {mine.map((budget) => (
                        <tr key={budget.code}>
                            {/* Clicking the name selects that budget and opens its envelopes. */}
                            <td>
                                <Link to="/envelopes" onClick={() => selectBudget({ code: budget.code, name: budget.name })}>
                                    {budget.name}
                                </Link>
                            </td>
                            <td>{budget.code}</td>
                            <td>{budget.owner}</td>
                            <td>{budget.members.length}</td>
                            <td>{money(budget.funds)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
