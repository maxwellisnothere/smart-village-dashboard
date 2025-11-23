import React, { useState } from 'react';
import { FaUser, FaLock, FaBolt, FaShieldAlt, FaExclamationCircle } from 'react-icons/fa';
import { USERS } from '../data/mockData';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate Network Delay
    setTimeout(() => {
      const foundUser = USERS.find(u => u.username === username && u.password === password);
      
      if (foundUser) {
        onLogin(foundUser);
      } else {
        setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      background: 'radial-gradient(circle at center, #1a1a2e 0%, #000000 100%)',
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background Effect */}
      <div style={{position: 'absolute', width: '600px', height: '600px', background: 'var(--accent)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%', top: '-10%', left: '-10%'}} />
      <div style={{position: 'absolute', width: '400px', height: '400px', background: '#007bff', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', bottom: '10%', right: '10%'}} />

      {/* Login Card */}
      <div className="login-fade-in" style={{ 
        width: '400px', padding: '40px', background: 'rgba(255, 255, 255, 0.05)', 
        backdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)', textAlign: 'center'
      }}>
        
        <div style={{ marginBottom: '30px' }}>
          <div style={{ width: '80px', height: '80px', margin: '0 auto 15px', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--accent)', boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)' }}>
            <FaBolt size={40} color="var(--accent)" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'white', letterSpacing: '2px' }}>GNT SMART</h1>
          <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Secure Access Gateway</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group" style={{ position: 'relative' }}>
            <FaUser style={{ position: 'absolute', top: '15px', left: '15px', color: '#666', transition: '0.3s' }} />
            <input 
              type="text" placeholder="Username / ID" value={username} onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '15px 15px 15px 45px', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '1rem', outline: 'none', transition: '0.3s' }} 
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'} onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          <div className="input-group" style={{ position: 'relative' }}>
            <FaLock style={{ position: 'absolute', top: '15px', left: '15px', color: '#666', transition: '0.3s' }} />
            <input 
              type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '15px 15px 15px 45px', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', borderRadius: '10px', color: 'white', fontSize: '1rem', outline: 'none', transition: '0.3s' }} 
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'} onBlur={(e) => e.target.style.borderColor = '#333'}
            />
          </div>

          {error && <div style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#FF4444', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}><FaExclamationCircle /> {error}</div>}

          <button 
            type="submit" disabled={isLoading}
            style={{ 
              padding: '15px', background: 'var(--accent)', color: 'black', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', 
              cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, transition: '0.3s', marginTop: '10px', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
            }}
          >
            {isLoading ? <span className="spinner"></span> : 'AUTHENTICATE'}
          </button>
        </form>

        <div style={{ marginTop: '30px', fontSize: '0.8rem', color: '#555', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' }}>
          <FaShieldAlt /> Protected by GNT Security System v2.0
        </div>

      </div>
    </div>
  );
};

export default LoginPage;