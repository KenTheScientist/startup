import { Link } from 'react-router-dom';
import Navigation from '../widgets/navigation';
import './envelopes.css';

export default function Envelopes() {
    return (
        <div className="layout">
            <Navigation />
            <main>
                <p><Link to="/budgets">Back to Budgets</Link></p>
                <h2>Envelopes</h2>
                <p>Manage envelopes for your budget.</p>
                <p><strong>Total funds: $500</strong></p>
                <p>Envelopes hold money for a category. Add funds or record an expense so everyone can see the balance.</p>

                <div className="envelope-list">
                    <article className="envelope">
                        <img src="envelope.png" alt="Envelope" />
                        <div>
                            <h3>Groceries</h3>
                            <progress value="300" max="400"></progress>
                            <p>$300 / $400</p>
                        </div>
                        <button className="btn btn-outline-primary" type="button">-</button>
                        <button className="btn btn-outline-primary" type="button">+</button>
                    </article>
                    <article className="envelope">
                        <img src="envelope.png" alt="Envelope" />
                        <div>
                            <h3>Vacation</h3>
                            <progress value="200" max="300"></progress>
                            <p>$200 / $300</p>
                        </div>
                        <button className="btn btn-outline-primary" type="button">-</button>
                        <button className="btn btn-outline-primary" type="button">+</button>
                    </article>
                </div>

                <div className="split">
                    <form>
                        <fieldset>
                            <legend>New envelope</legend>
                            <label>Name <input className="form-control" type="text" placeholder="Vacation" /></label>
                            <button className="btn btn-primary" type="button">Create envelope</button>
                        </fieldset>
                    </form>

                    <form>
                        <fieldset>
                            <legend>Add funds</legend>
                            <label>Envelope <input className="form-control" type="text" placeholder="Vacation" /></label>
                            <label>Amount <input className="form-control" type="number" placeholder="1000" /></label>
                            <button className="btn btn-primary" type="button">Add</button>
                        </fieldset>
                    </form>

                    <form>
                        <fieldset>
                            <legend>New expense</legend>
                            <label>Label <input className="form-control" type="text" placeholder="Plane Tickets" /></label>
                            <label>Envelope <input className="form-control" type="text" placeholder="Vacation" /></label>
                            <label>Amount <input className="form-control" type="number" placeholder="600" /></label>
                            <button className="btn btn-primary" type="button">Spend</button>
                        </fieldset>
                    </form>
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
