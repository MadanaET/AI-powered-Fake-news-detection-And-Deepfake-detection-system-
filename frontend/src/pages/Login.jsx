import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ShieldAlert, User, Lock, ArrowRight } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
      if (res.data.status === 'success') {
        login({ username: res.data.username });
        navigate('/');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Connection error. Is backend running?');
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <ShieldAlert size={56} className="brand-icon" />
          <h1>DetectAI</h1>
          <p>Secure Portal Login</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn auth-btn" type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : <>Log In <ArrowRight size={18}/></>}
          </button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one now</Link>
        </p>
      </div>
    </div>
  );
}
