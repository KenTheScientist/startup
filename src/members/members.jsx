import { Link } from 'react-router-dom';
import Navigation from '../widgets/navigation';
import './members.css';

export default function Members() {
    return (
        <div className="layout">
            <Navigation />
            <main>
                <p><Link to="/budgets">Back to Budgets</Link></p>
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
                            <tr>
                                <td>Sarah</td>
                                <td>Owner</td>
                            </tr>
                            <tr>
                                <td>Jim</td>
                                <td>Member</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <section>
                    <h3>Join this budget</h3>
                    <p><strong>Join code: XLKDN</strong></p>
                    <p>QR code from QR Tag API Example</p>
                    <img className="qr" src="qr_code_example.png" alt="QR code to join the Home budget" />
                </section>

                <section className="live">
                    <h3>Live updates</h3>
                    <ul>
                        <li>Jim joined the Home budget</li>
                    </ul>
                </section>
            </main>
        </div>
    )
}
