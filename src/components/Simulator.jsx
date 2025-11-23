// src/components/Simulator.jsx
import React, { useState } from 'react';
import { FaFan, FaTemperatureHigh, FaWater, FaCog } from 'react-icons/fa';

const Simulator = () => {
  const [rpm, setRpm] = useState(0);
  const [temp, setTemp] = useState(45);
  const [vibration, setVibration] = useState(2);
  
  const spinSpeed = rpm > 0 ? `${5000 / (rpm || 1)}s` : '0s';
  const turbineColor = temp > 90 ? '#FF4444' : temp > 60 ? '#FFD700' : '#00C851';

  return (
    <div className="dashboard-grid">
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '400px' }}>
        <h2 style={{ color: 'var(--accent)' }}>TURBINE VISUALIZER</h2>
        <div style={{ 
            fontSize: '180px', color: turbineColor, transition: 'color 0.5s', marginTop: '20px',
            animation: `spin ${spinSpeed} linear infinite`, filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' 
        }}>
            <FaFan />
        </div>
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <div className="stat-value">{rpm} <span style={{fontSize:'1rem'}}>RPM</span></div>
            <div style={{color:'#888'}}>CURRENT SPEED</div>
        </div>
      </div>

      <div className="card">
        <h2>🎛️ CONTROL CENTER</h2>
        <div style={{marginBottom:'25px'}}><label><FaCog /> RPM Speed ({rpm})</label><input type="range" min="0" max="3000" value={rpm} onChange={(e)=>setRpm(Number(e.target.value))} /></div>
        <div style={{marginBottom:'25px'}}><label><FaTemperatureHigh /> Temperature ({temp}°C)</label><input type="range" min="0" max="120" value={temp} onChange={(e)=>setTemp(Number(e.target.value))} /></div>
        <div style={{marginBottom:'25px'}}><label><FaWater /> Vibration ({vibration} Hz)</label><input type="range" min="0" max="10" step="0.1" value={vibration} onChange={(e)=>setVibration(Number(e.target.value))} /></div>
        <button className="btn-primary">🚀 UPDATE SENSORS</button>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// 👇 บรรทัดนี้สำคัญที่สุด! ห้ามลืม!
export default Simulator;