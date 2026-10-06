import Navigation from '../widgets/navigation';

export default function Login() {
    return (
        <div className="layout">
            <Navigation />
            <main>
                <h2>Login to Co-Budget</h2>
                <p>
                    Co-Budget is a shared budget application for families and couples. Create budgets, add envelopes,
                    track expenses, and see when others spend money in real time.
                </p>

                <form id="login-form" method="get" action="budgets.html">
                    <fieldset>
                    <legend>Login or create an account</legend>
                    <label>Username <input className="form-control" type="text" name="username" placeholder="username" /></label>
                    <label>Password <input className="form-control" type="password" name="password" placeholder="password" /></label>
                    <button className="btn btn-primary" type="submit">Login</button>
                    <button className="btn btn-outline-primary" type="submit">Create Account</button>
                    </fieldset>
                </form>
            </main>
        </div>
    )
}