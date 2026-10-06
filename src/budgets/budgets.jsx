import { Link } from 'react-router-dom';

export default function Budgets() {
    return (
        <main>
                <h2>Your Budgets</h2>
                <p>Select, create, or join a budget to manage envelopes.</p>

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
                            <tr>
                                <td><Link to="/envelopes">Home</Link></td>
                                <td>XLKDN</td>
                                <td>Sarah</td>
                                <td>2</td>
                                <td>$1,350</td>
                            </tr>
                            <tr>
                                <td><Link to="/envelopes">Vacation Club</Link></td>
                                <td>Q9T2M</td>
                                <td>Ken Thomson</td>
                                <td>1</td>
                                <td>$500</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="split">
                    <form method="post">
                        <fieldset>
                            <legend>Create a new budget</legend>
                            <label>Name <input className="form-control" type="text" name="name" placeholder="Home" /></label>
                            <button className="btn btn-primary" type="submit">Create</button>
                        </fieldset>
                    </form>
                    <form method="post">
                        <fieldset>
                            <legend>Join a budget</legend>
                            <label>Join code <input className="form-control" type="text" name="join_code" placeholder="XLKDN" /></label>
                            <button className="btn btn-primary" type="submit">Join</button>
                        </fieldset>
                    </form>
                </div>

                <section className="live">
                    <h3>Live updates</h3>
                    <ul>
                        <li>Jim joined the Home budget</li>
                        <li>Sarah created the Home budget</li>
                    </ul>
                </section>
        </main>
    )
}
