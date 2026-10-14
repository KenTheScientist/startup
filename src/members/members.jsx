import { loadBudgets } from '../budgets/storage';
import './members.css';

export default function Members({ budget }) {
    if (!budget) return <main><p>Select a budget first.</p></main>;
    const stored = loadBudgets().find((item) => item.code === budget.code);
    const joinUrl = `https://startup.cobudget.click/budgets?join=${budget.code}`;
    const qrUrl = `https://qrtag.net/api/qr_4.png?url=${joinUrl}`;

    return (
        <main>
                <h2>Members</h2>
                <p>People in this budget can add envelopes, fill them, and record expenses. Share the join code or QR code to invite someone.</p>

                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(stored?.members || []).map((name) => (
                                <tr key={name}>
                                    <td>{name}</td>
                                    <td>{name === stored.owner ? 'Owner' : 'Member'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <section>
                    <h3>Join this budget</h3>
                    <p><strong>Join code: {budget.code}</strong></p>
                    <p><strong>Join link: </strong><a href={joinUrl}>{joinUrl}</a></p>
                    <img className="qr" src={qrUrl} alt={`QR code to join the ${budget.name} budget`} />
                </section>

        </main>
    )
}
