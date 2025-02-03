import React, { useEffect, useState } from 'react';
import { signIn, signUp, signOut, getCurrentUser, fetchUserAttributes, resendSignUpCode } from '@aws-amplify/auth';

interface AuthProps {
    onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isVerified, setIsVerified] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser();
                if (user) {
                    const attributes = await fetchUserAttributes();
                    setIsVerified(attributes.email_verified === 'true');
                    if (attributes.email_verified === 'true') {
                        onLogin();
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkAuth();
    }, [onLogin]);

    const handleResendVerification = async () => {
        try {
            await resendSignUpCode({ username: email });
            setError('A new verification link has been sent to your email.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    const handleAuth = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            if (isSignIn) {
                await signIn({ username: email, password });
                const attributes = await fetchUserAttributes();
                setIsVerified(attributes.email_verified === 'true');
                if (attributes.email_verified === 'true') {
                    onLogin();
                } else {
                    await signOut();
                    setError('Please verify your email before logging in.');
                }
            } else {
                await signUp({
                    username: email,
                    password,
                    options: {
                        userAttributes: {
                            email
                        }
                    }
                });
                setError('Please check your email for verification link');
                setIsVerified(false);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleAuth}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">
                    {isSignIn ? 'Sign In' : 'Sign Up'}
                </button>
            </form>
            <button onClick={() => setIsSignIn(!isSignIn)}>
                {isSignIn ? 'Need an account? Sign Up' : 'Have an account? Sign In'}
            </button>
            {!isVerified && (
                <button onClick={handleResendVerification}>Resend Verification Link</button>
            )}
        </div>
    );
};

export default Auth;