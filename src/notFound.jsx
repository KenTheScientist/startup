import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <main>
            <h2>Page not found</h2>
            <p><Link to="/">Go to login</Link></p>
        </main>
    )
}
