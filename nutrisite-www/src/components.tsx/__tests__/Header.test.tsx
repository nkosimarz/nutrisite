import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../Header';

describe('Header Component', () => {
    it('renders sign out button when logged in', () => {
        const mockLogout = jest.fn();
        render(
            <Router>
                <Header isAuthenticated={true} onLogout={mockLogout} />
            </Router>
        );
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    it('does not render button when not logged in', () => {
        const mockLogout = jest.fn();
        render(
            <Router>
                <Header isAuthenticated={false} onLogout={mockLogout} />
            </Router>
        );
        expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
    });
});