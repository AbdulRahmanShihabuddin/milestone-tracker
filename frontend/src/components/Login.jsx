import React, { useState } from 'react';
import { authAPI } from '../utils/api';
import Aurora from './Aurora';
import GlassSurface from './GlassSurface';
import './Login.css';

function Login({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let response;
            if (isLogin) {
                response = await authAPI.login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                response = await authAPI.register(formData);
            }

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            onLogin(user);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ name: '', email: '', password: '' });
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <Aurora
                    colorStops={["#7FFF6B", "#B19EEF", "#5227FF"]}
                    blend={0.3}
                    amplitude={0.6}
                    speed={0.3}
                />
            </div>

            <div className="login-card animate-fade-in">
                <GlassSurface
                    width="100%"
                    height="100%"
                    borderRadius={16}
                    displace={3}
                    backgroundOpacity={0.05}
                    saturation={1.2}
                    className="login-glass"
                >
                    <div className="login-card-inner">
                        <div className="login-header">
                            <h1 className="login-title">MilestoneTrack</h1>
                            <p className="login-subtitle">
                                {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
                            </p>
                        </div>

                        {error && (
                            <div className="alert alert-error animate-slide-in">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            {!isLogin && (
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        className="form-input acrylic-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required={!isLogin}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="form-input acrylic-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    className="form-input acrylic-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                    placeholder="••••••••"
                                />
                                {!isLogin && (
                                    <small className="form-hint">Must be at least 6 characters</small>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-sm">
                                        <span className="spinner-small"></span>
                                        {isLogin ? 'Signing in...' : 'Creating account...'}
                                    </span>
                                ) : (
                                    isLogin ? 'Sign In' : 'Create Account'
                                )}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                <button onClick={toggleMode} className="link-button">
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>
                    </div>
                </GlassSurface>
            </div>
        </div>
    );
}

export default Login;
