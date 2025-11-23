import React from 'react';
import { FaBolt } from 'react-icons/fa';
import { VILLAGES } from '../../data/mockData';
import { Bar } from 'react-chartjs-2';
import './ChartConfig';

export const HouseDashboard = ({ user }) => {
  const village = VILLAGES.find(v => v.id === user.villageId);
  const house = village?.houses.find(h => h.id === user.houseId);

  if (!house) return <div style={{padding:'20px', color:'white'}}>❌ House not found</div>;

  const currentPower = Number(house.power || 0);
  const moneySaved = (currentPower * 4.5).toFixed(0);
  const co2Saved = (currentPower * 0.0005).toFixed(2);

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Energy (kWh)',
      data: [120, 150, 180, 200, 250, 300, 320, 310, 280, 200, 150, 130],
      backgroundColor: '#FFD700',
      borderRadius: 6
    }]
  };
  
  const barOptions = { 
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: { legend: { display: false } }, 
    scales: { 
        y: { ticks: { color: '#888' }, grid: { color: '#333' } }, 
        x: { ticks: { color: '#888' }, grid: { display: false } } 
    } 
  };

  return (
    <div className="bento-grid" style={{display:'flex', flexDirection:'column', gap:'20px'}}>
      <div className="banner-card" style={{minHeight:'120px'}}>
        <div>
            <h2>Hello, {user.name} 👋</h2>
            <p style={{color:'#ccc'}}>House ID: {house.id} | Status: <span style={{color:'#00C851'}}>Normal</span></p>
        </div>
        <div style={{fontSize:'3rem', color:'var(--accent)'}}><FaBolt /></div>
      </div>

      <div className="bento-grid" style={{gridTemplateColumns:'repeat(3, 1fr)'}}>
         <div className="card"><h3>Current Power</h3><div className="stat-value">{currentPower} W</div></div>
         <div className="card"><h3>Money Saved</h3><div className="stat-value" style={{color:'#00C851'}}>฿{moneySaved}</div></div>
         <div className="card"><h3>CO2 Reduced</h3><div className="stat-value" style={{color:'#2BBBAD'}}>{co2Saved} Tons</div></div>
      </div>

      <div className="card" style={{minHeight:'350px'}}>
        <h3>📅 Annual Production (2025)</h3>
        <div style={{height:'280px', width:'100%', position:'relative'}}>
            <Bar options={barOptions} data={monthlyData} />
        </div>
      </div>
    </div>
  );
};

// 👇 สำคัญมาก! ต้องมีบรรทัดนี้
export default HouseDashboard;