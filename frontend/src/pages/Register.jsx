import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, User, Lock, UserPlus } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, { username, password });
      if (res.data.status === 'success') {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
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
          <p>Advanced Fake News & Deepfake Analysis System</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              placeholder="Choose Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Choose Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
            />
          </div>
          <button className="btn auth-btn" type="submit" disabled={loading}>
            {loading ? 'Registering...' : <>Create Account <UserPlus size={18}/></>}
          </button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
