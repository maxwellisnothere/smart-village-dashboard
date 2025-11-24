// src/components/ExtraFeatures.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaStore, FaCloudSun, FaTools, FaExclamationTriangle, 
  FaVoteYea, FaUserCircle, FaPlus, FaRobot, FaBolt, FaShoppingCart,
  FaWind, FaTint, FaThermometerHalf, FaSun, FaCloud, FaSmog
} from 'react-icons/fa';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// --- Helper Component: Icon Box (กล่องกระจกเรืองแสง) ---
const IconBox = ({ icon: Icon, color = 'var(--accent)', size = '2rem' }) => (
  <div className="icon-box" style={{ width: '60px', height: '60px', borderRadius: '16px' }}>
    <Icon className="neon-icon" style={{ fontSize: size, color: color, filter: `drop-shadow(0 0 8px ${color})` }} />
  </div>
);

// Helper แปลง Icon สภาพอากาศ
const getWeatherIcon = (iconCode) => {
    if (!iconCode) return FaCloudSun;
    if (iconCode.includes('01')) return FaSun; // Clear sky
    if (iconCode.includes('09') || iconCode.includes('10')) return FaTint; // Rain
    if (iconCode.includes('11')) return FaBolt; // Thunder
    if (iconCode.includes('13')) return FaRobot; // Snow (สมมติ)
    if (iconCode.includes('50')) return FaSmog; // Mist
    return FaCloud; // Clouds
}

// ==========================================
// 1. 🏪 P2P MARKETPLACE (ตลาดซื้อขายไฟ)
// ==========================================
export const Marketplace = () => {
  const [offers, setOffers] = useState([
    { id: 1, seller: 'บ้านนารูโตะ', amount: 50, price: 3.5, sold: false },
    { id: 2, seller: 'บ้านซาสึเกะ', amount: 120, price: 3.2, sold: false },
    { id: 3, seller: 'บ้านลุงพล', amount: 20, price: 4.0, sold: true },
  ]);

  const handleBuy = (id) => {
    setOffers(offers.map(o => o.id === id ? { ...o, sold: true } : o));
    alert('Transaction Completed! Energy Transferred.');
  };

  return (
    <div className="bento-grid" style={{gap:'24px'}}>
      <div className="banner-card" style={{minHeight:'180px', background:'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)', border:'none'}}>
        <div style={{zIndex:1}}>
            <h1 style={{color:'black', margin:0, fontSize:'2.5rem', fontWeight:'800', textTransform:'uppercase'}}>Energy Market</h1>
            <p style={{color:'#333', fontSize:'1.1rem', fontWeight:'500'}}>P2P Trading Platform v2.0</p>
        </div>
        <div style={{fontSize:'6rem', color:'black', opacity:0.2, transform:'rotate(-20deg)'}}><FaShoppingCart /></div>
      </div>

      <div className="card" style={{gridColumn:'span 2'}}>
        <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'20px'}}>
            <IconBox icon={FaStore} color="#FFD700" />
            <h3 style={{margin:0, textTransform:'uppercase', letterSpacing:'1px'}}>Live Offers</h3>
        </div>
        
        <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            {offers.map(offer => (
                <div key={offer.id} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center', 
                    padding:'20px', background:'var(--bg-input)', borderRadius:'16px', 
                    border: '1px solid var(--border)', opacity: offer.sold ? 0.6 : 1,
                    transition: '0.3s'
                }}>
                    <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                        <div style={{width:'45px', height:'45px', borderRadius:'50%', background:'var(--bg-main)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid var(--border)'}}>
                            <FaUserCircle size={24} color="var(--text-muted)"/>
                        </div>
                        <div>
                            <div style={{fontWeight:'bold', fontSize:'1.1rem'}}>{offer.seller}</div>
                            <div style={{fontSize:'0.9rem', color:'var(--text-muted)'}}>{offer.amount} Units Available</div>
                        </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                        <div style={{fontSize:'1.4rem', color:'var(--accent)', fontWeight:'800'}}>฿{offer.price}<span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>/unit</span></div>
                        {offer.sold ? (
                            <div className="status-badge success">SOLD OUT</div>
                        ) : (
                            <button onClick={() => handleBuy(offer.id)} className="btn-primary" style={{minWidth:'100px'}}>BUY NOW</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. 🔮 AI PREDICTION (พยากรณ์อากาศจริง)
// ==========================================
export const AIPrediction = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // เรียก API Gateway ที่ Node-RED (ซึ่งจะไปดึงของจริงมาให้)
                const res = await fetch('/api/weather/maehongson'); 
                const data = await res.json();
                
                if (data.error) throw new Error(data.error);
                setWeatherData(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch weather:", err);
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    if (loading) return <div className="card" style={{padding:'50px', textAlign:'center'}}>Loading Real-Time Weather...</div>;
    
    // ถ้าโหลดไม่ได้ (หรือ Node-RED ยังไม่ต่อ) ให้โชว์ Mock ไปพลางๆ กันจอขาว
    if (!weatherData) return (
        <div className="card" style={{padding:'50px', textAlign:'center', color:'#FF4444'}}>
            <FaExclamationTriangle size={40} style={{marginBottom:'10px'}}/>
            <p>Weather Data Unavailable. Please check Node-RED API connection.</p>
        </div>
    );

    const CurrentIcon = getWeatherIcon(weatherData.current.icon);
    
    // Config กราฟ (ใช้ข้อมูลจริง)
    const chartData = {
        labels: weatherData.daily_forecast.map(d => d.day),
        datasets: [{
            label: 'Max Temp (°C)',
            data: weatherData.daily_forecast.map(d => d.temp_max),
            borderColor: '#FFD700', backgroundColor: 'rgba(255, 215, 0, 0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#FFD700'
        },
        {
            label: 'Min Temp (°C)',
            data: weatherData.daily_forecast.map(d => d.temp_min),
            borderColor: '#00FFAB', backgroundColor: 'rgba(0, 255, 171, 0.05)', tension: 0.4, fill: true, pointBackgroundColor: '#00FFAB'
        }]
    };

    return (
        <div className="bento-grid">
            {/* ส่วนหัว: สภาพอากาศปัจจุบัน */}
            <div className="card" style={{gridColumn:'span 2', display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(to right, var(--bg-card), var(--bg-input))'}}>
                <div style={{display:'flex', alignItems:'center', gap:'25px'}}>
                    <div className="icon-box" style={{width:'80px', height:'80px'}}>
                         <CurrentIcon className="neon-icon" style={{fontSize:'3rem', color:'var(--accent)'}} />
                    </div>
                    <div>
                        <h2 style={{margin:0, fontSize:'2rem', fontWeight:'800'}}>{weatherData.current.temp}°C</h2>
                        <p style={{color:'var(--text-muted)', margin:0, textTransform:'capitalize', fontSize:'1.1rem'}}>
                            {weatherData.current.description}
                        </p>
                        <p style={{color:'var(--text-muted)', fontSize:'0.85rem', marginTop:'5px'}}>📍 {weatherData.location}</p>
                    </div>
                </div>
                
                <div style={{display:'flex', gap:'30px', textAlign:'center'}}>
                    <div>
                        <div style={{fontSize:'1.5rem', fontWeight:'bold'}}>{weatherData.current.humidity}%</div>
                        <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}><FaTint/> Humidity</div>
                    </div>
                    <div>
                        <div style={{fontSize:'1.5rem', fontWeight:'bold'}}>{weatherData.current.wind_speed} m/s</div>
                        <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}><FaWind/> Wind</div>
                    </div>
                </div>
            </div>

            {/* ส่วนกราฟ: พยากรณ์ล่วงหน้า 7 วัน */}
            <div className="card" style={{gridColumn:'span 2', minHeight:'400px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px'}}>
                    <FaThermometerHalf className="neon-icon" style={{color:'#FFD700'}} />
                    <h3 style={{margin:0, color:'#FFD700'}}>7-DAY TEMPERATURE FORECAST</h3>
                </div>
                
                <div style={{height:'300px'}}>
                    <Line options={{maintainAspectRatio:false, scales:{y:{grid:{color:'rgba(255,255,255,0.05)'}}, x:{grid:{display:false}}}}} data={chartData} />
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 3. 🎫 MAINTENANCE (แจ้งซ่อม)
// ==========================================
export const MaintenanceSystem = () => {
  const [tickets, setTickets] = useState([
    { id: 'T-001', issue: 'Turbine Noise Level High', location: 'Zone A (Unit 5)', status: 'Pending', date: '2025-11-20' },
    { id: 'T-002', issue: 'Water Sensor Calibration', location: 'Zone B (Unit 2)', status: 'Fixed', date: '2025-11-18' },
  ]);

  const addTicket = async () => {
      const newTicket = { 
          id: `T-${Date.now()}`, 
          issue: 'Routine Checkup', 
          location: 'Unspecified', 
          status: 'Pending', 
          date: new Date().toISOString().split('T')[0] 
      };
      // (เชื่อม API ตรงนี้ได้เหมือนเดิม)
      setTickets([newTicket, ...tickets]);
      alert('✅ Mock Ticket Created!');
  };

  return (
    <div className="bento-grid">
        <div className="card" style={{gridColumn:'span 2', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <IconBox icon={FaTools} color="#FF8800" />
                <h2 style={{margin:0}}>Maintenance Center</h2>
            </div>
            <button onClick={addTicket} className="btn-primary" style={{display:'flex', gap:'10px', alignItems:'center'}}>
                <FaPlus /> CREATE TICKET
            </button>
        </div>

        <div className="card" style={{gridColumn:'span 2', padding:0, overflow:'hidden'}}>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead style={{background:'var(--bg-input)'}}>
                    <tr style={{textAlign:'left', color:'var(--text-muted)', fontSize:'0.9rem', textTransform:'uppercase'}}>
                        <th style={{padding:'20px'}}>Ticket ID</th>
                        <th>Issue Description</th>
                        <th>Location</th>
                        <th>Date Created</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(t => (
                        <tr key={t.id} style={{borderBottom:'1px solid var(--border)', transition:'0.2s'}}>
                            <td style={{padding:'20px', fontWeight:'bold', color:'var(--accent)'}}>{t.id}</td>
                            <td style={{color:'var(--text-main)', fontWeight:'500'}}>{t.issue}</td>
                            <td style={{color:'var(--text-muted)'}}>{t.location}</td>
                            <td style={{color:'var(--text-muted)'}}>{t.date}</td>
                            <td>
                                <span className={`status-badge ${t.status === 'Fixed' ? 'success' : 'danger'}`}>
                                    {t.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

// ==========================================
// 4. 🚨 SAFETY CENTER (ระบบเตือนภัย)
// ==========================================
export const SafetyCenter = () => {
  const [isAlert, setIsAlert] = useState(false);

  return (
    <div style={{
        height: '100%', padding:'4px', borderRadius:'24px',
        background: isAlert ? 'linear-gradient(45deg, #ff0000, #ff4d4d, #ff0000)' : 'var(--border)',
        backgroundSize: '200% 200%',
        animation: isAlert ? 'borderGlow 2s linear infinite' : 'none',
        transition: '0.5s'
    }}>
        <div className="card" style={{
            textAlign:'center', padding:'60px 40px', height:'100%', 
            display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
            background: 'var(--bg-card)', borderRadius:'20px', border:'none'
        }}>
            
            <div className="icon-box" style={{
                width:'120px', height:'120px', borderRadius:'50%', marginBottom:'30px',
                border: isAlert ? '2px solid #FF4444' : '2px solid var(--border)',
                boxShadow: isAlert ? '0 0 50px rgba(255, 68, 68, 0.4)' : 'none',
                background: isAlert ? 'rgba(255, 68, 68, 0.1)' : 'var(--bg-input)'
            }}>
                <FaExclamationTriangle className="neon-icon" style={{
                    fontSize:'4rem', 
                    color: isAlert ? '#FF4444' : 'var(--text-muted)',
                    filter: isAlert ? 'drop-shadow(0 0 20px #FF4444)' : 'none',
                    animation: isAlert ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite' : 'none'
                }}/>
            </div>

            <h1 style={{fontSize:'2.5rem', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'2px', color: isAlert ? '#FF4444' : 'var(--text-main)'}}>
                {isAlert ? 'CRITICAL ALERT' : 'SYSTEM NORMAL'}
            </h1>
            
            <p style={{color:'var(--text-muted)', fontSize:'1.1rem', marginBottom:'40px'}}>
                DISASTER EARLY WARNING SYSTEM
            </p>
            
            <button 
                onClick={() => setIsAlert(!isAlert)}
                className={isAlert ? '' : 'btn-primary'}
                style={{
                    padding:'18px 40px', fontSize:'1.2rem', fontWeight:'800', borderRadius:'50px', 
                    background: isAlert ? '#FF4444' : 'var(--accent)',
                    color: isAlert ? 'white' : 'var(--bg-main)',
                    border: 'none',
                    boxShadow: isAlert ? '0 0 30px rgba(255, 68, 68, 0.6)' : 'var(--shadow)',
                    transform: isAlert ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.3s'
                }}
            >
                {isAlert ? 'DEACTIVATE ALARM' : 'SIMULATE TRIGGER'}
            </button>

            <style>{`
                @keyframes borderGlow { 0% {background-position: 0% 50%} 50% {background-position: 100% 50%} 100% {background-position: 0% 50%} }
                @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
            `}</style>
        </div>
    </div>
  );
};

// ==========================================
// 5. 🗳️ VILLAGE VOTING (โพลประชามติ)
// ==========================================
export const VotingSystem = () => {
  const [votes, setVotes] = useState({ op1: 12, op2: 5, op3: 20 });
  const total = votes.op1 + votes.op2 + votes.op3;

  const VoteBar = ({ label, count, color, onClick }) => (
      <div style={{marginBottom:'20px'}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px', fontSize:'0.95rem'}}>
              <span style={{fontWeight:'600'}}>{label}</span>
              <span style={{color:'var(--text-muted)'}}>{count} Votes ({Math.round((count/total)*100)}%)</span>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
              <div style={{flex:1, height:'12px', background:'var(--bg-input)', borderRadius:'6px', overflow:'hidden'}}>
                  <div style={{width:`${(count/total)*100}%`, height:'100%', background: color, transition:'width 0.5s ease', borderRadius:'6px'}}></div>
              </div>
              <button onClick={onClick} style={{background:'transparent', border:`1px solid ${color}`, color: color, padding:'6px 16px', borderRadius:'8px', cursor:'pointer', fontSize:'0.8rem', fontWeight:'bold', transition:'0.2s'}}>
                  VOTE
              </button>
          </div>
      </div>
  );

  return (
    <div className="bento-grid">
        <div className="card" style={{gridColumn:'span 2'}}>
            <div style={{display:'flex', alignItems:'center', gap:'20px', marginBottom:'30px', paddingBottom:'20px', borderBottom:'1px solid var(--border)'}}>
                <IconBox icon={FaVoteYea} color="#9C27B0" />
                <div>
                    <h2 style={{margin:0}}>Community Poll #42</h2>
                    <p style={{margin:0, color:'var(--text-muted)'}}>Topic: Budget Allocation for Q4 2025</p>
                </div>
            </div>

            <VoteBar label="1. ซ่อมกังหันตัวที่ 5 (Turbine Maintenance)" count={votes.op1} color="#00C851" onClick={()=>setVotes({...votes, op1: votes.op1+1})} />
            <VoteBar label="2. ติดไฟทางเดินเพิ่ม (Street Lighting)" count={votes.op2} color="#FFD700" onClick={()=>setVotes({...votes, op2: votes.op2+1})} />
            <VoteBar label="3. จัดงานเลี้ยงหมู่บ้าน (Community Party)" count={votes.op3} color="#FF4444" onClick={()=>setVotes({...votes, op3: votes.op3+1})} />
        </div>
    </div>
  );
};