import { Link } from 'react-router-dom';
import Navigation from '../widgets/navigation';

export default function Activity() {
    return (
        <div className="layout">
            <Navigation />
            <main>
                <p><Link to="/budgets">Back to Budgets</Link></p>
                <h2>Activity</h2>
                <p>Fills and expenses stored for this budget. New actions appear here as they happen.</p>

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
                            <tr>
                                <td>Expense</td>
                                <td>Sarah</td>
                                <td>Plane Tickets</td>
                                <td>$600</td>
                                <td>Vacation</td>
                            </tr>
                            <tr>
                                <td>Fill</td>
                                <td>Jim</td>
                                <td>Added funds</td>
                                <td>$1,000</td>
                                <td>Vacation</td>
                            </tr>
                            <tr>
                                <td>Envelope</td>
                                <td>Sarah</td>
                                <td>Created envelope</td>
                                <td>—</td>
                                <td>Vacation</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <section className="live">
                    <h3>Live updates</h3>
                    <ul>
                        <li>Sarah spent $600 for Plane Tickets</li>
                        <li>Jim added $1000 to the Vacation envelope</li>
                        <li>Sarah created a Vacation envelope</li>
                    </ul>
                </section>
            </main>
        </div>
    )
}
