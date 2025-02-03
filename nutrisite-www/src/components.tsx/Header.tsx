import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '@aws-amplify/auth';

interface HeaderProps {
    isAuthenticated: boolean;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout }) => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        onLogout();
    };

    return (
        <header className="header">
            <div className="header-top">
                <h1>Nutrisite</h1>
                {isAuthenticated && (
                    <div className="header-buttons">
                        <button onClick={() => navigate('/')}>Home</button>
                        <button onClick={() => navigate('/meals')}>Meals</button>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </div>
                )}
            </div>
            <p>Your personal nutrition assistant</p>
        </header>
    );
};

export default Header;