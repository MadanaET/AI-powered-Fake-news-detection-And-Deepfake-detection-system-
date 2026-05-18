import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, Activity, AlertTriangle, CheckCircle, Search, LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const API_BASE = 'http://localhost:8000/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('text'); // text or media
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handleTextAnalyze = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/analyze/text`, { text: textInput });
      setResult(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Is the backend running?");
    }
    setLoading(false);
  };

  const handleMediaAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API_BASE}/analyze/media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Is the backend running?");
    }
    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const isFake = result?.prediction.toLowerCase().includes('fake');

  return (
    <div className="container">
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ textAlign: 'left' }}>DetectAI</h1>
          <p style={{ textAlign: 'left' }}>Advanced Fake News & Deepfake Analysis System</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Welcome, {user?.username}</span>
          <button className="btn" style={{ padding: '0.5rem 1rem', background: 'var(--border)' }} onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="upload-container glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          <button 
            className="btn" 
            style={{ background: activeTab === 'text' ? 'var(--primary)' : 'var(--bg-card)' }}
            onClick={() => { setActiveTab('text'); setResult(null); }}
          >
            <FileText size={20} /> Text Analysis
          </button>
          <button 
            className="btn" 
            style={{ background: activeTab === 'media' ? 'var(--primary)' : 'var(--bg-card)' }}
            onClick={() => { setActiveTab('media'); setResult(null); }}
          >
            <UploadCloud size={20} /> Media Analysis
          </button>
        </div>

        {activeTab === 'text' ? (
          <div className="text-input-area">
            <textarea 
              placeholder="Paste news article text or URL here to analyze for manipulation, sensationalism, or unverified claims..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button className="btn" onClick={handleTextAnalyze} disabled={loading || !textInput}>
              {loading ? <div className="loader" style={{width: 20, height: 20, margin: 0}} /> : <><Search size={20} /> Analyze Text</>}
            </button>
          </div>
        ) : (
          <div className="text-input-area">
              {!previewUrl ? (
                <div 
                  className="drop-zone" 
                  onDragOver={(e) => e.preventDefault()} 
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="drop-icon" />
                  <h3>Drag & Drop Image or Video</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>or click to browse</p>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', maxHeight: '400px', borderRadius: '8px', textAlign: 'center' }}>
                  {file?.type?.startsWith('video/') || file?.name?.toLowerCase().endsWith('.mp4') ? (
                     <video src={previewUrl} controls style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', backgroundColor: 'black', borderRadius: '8px' }} />
                  ) : (
                     <img src={previewUrl} alt="preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px' }} />
                  )}
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
                     <p style={{ color: 'var(--text-main)', fontWeight: 'bold', margin: 0 }}>{file.name}</p>
                     <button className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }} onClick={() => fileInputRef.current?.click()}>
                       Change File
                     </button>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*,video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
            <button className="btn" onClick={handleMediaAnalyze} disabled={loading || !file}>
               {loading ? <div className="loader" style={{width: 20, height: 20, margin: 0}} /> : <><Search size={20} /> Analyze Media</>}
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <div className="loader"></div>
          <p>Running AI Models...</p>
        </div>
      )}

      {result && (
        <div className="dashboard">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Analysis Results</h2>
          <div className="dashboard-grid">
            <div className="stat-card glass-panel">
              <Activity size={48} color="var(--primary)" />
              <h3 style={{ marginTop: '1rem' }}>Prediction</h3>
              <div className={`stat-value ${isFake ? 'fake' : 'real'}`}>
                {result.prediction}
              </div>
            </div>

            <div className="stat-card glass-panel">
              {isFake ? <AlertTriangle size={48} color="var(--danger)" /> : <CheckCircle size={48} color="var(--success)" />}
              <h3 style={{ marginTop: '1rem' }}>Confidence Score</h3>
              <div className="stat-value">
                {result.confidence}%
              </div>
            </div>
          </div>

          {result.issues && result.issues.length > 0 && (
            <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem' }}>
              <h3>Detected Issues / Rationales</h3>
              <ul className="issues-list">
                {result.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


