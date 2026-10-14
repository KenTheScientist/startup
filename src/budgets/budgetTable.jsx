import { Link } from 'react-router-dom';

export default function BudgetTable({ budgets, userName, selectBudget }) {
    const mine = budgets.filter((b) => b.members.includes(userName));

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
                        <tr><td colSpan="5">You have no budgets yet. Create one or join with a code.</td></tr>
                    )}
                    {mine.map((b) => (
                        <tr key={b.code}>
                            <td><Link to="/envelopes" onClick={() => selectBudget({ code: b.code, name: b.name })}>{b.name}</Link></td>
                            <td>{b.code}</td>
                            <td>{b.owner}</td>
                            <td>{b.members.length}</td>
                            <td>${b.funds.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
