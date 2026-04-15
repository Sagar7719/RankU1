import { useState } from 'react';

function LoginCard() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        
        // Handle login logic here
        console.log('Login attempted with:', email, password);
        setError('');
        
        // Example API call structure:
        // const response = await fetch('/api/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, password })
        // });
    };

    return (
        <div className="login-card">
            <h1>Login</h1>
            <p>Welcome back! Please sign in to your account.</p>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="otp-btn">Login</button>
            </form>
            <p>Don't have an account? <a href="#">Sign up</a></p>
        </div>
    );
}

export default LoginCard;