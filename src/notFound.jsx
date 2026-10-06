import { Link } from 'react-router-dom';
import Navigation from './widgets/navigation';

export default function NotFound() {
    return (
        <div className="layout">
            <Navigation />
            <main>
                <h2>Page not found</h2>
                <p><Link to="/">Go to login</Link></p>
            </main>
        </div>
    )
}
