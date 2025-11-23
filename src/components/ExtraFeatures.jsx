// src/components/ExtraFeatures.jsx
import React, { useState } from 'react';
import { FaStore, FaCloudSun, FaTools, FaExclamationTriangle, FaVoteYea, FaUserCircle, FaPlus } from 'react-icons/fa';

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
    alert('ซื้อสำเร็จ! หักเงินจาก Wallet เรียบร้อย');
  };

  return (
    <div className="bento-grid" style={{gap:'20px'}}>
      <div className="banner-card" style={{minHeight:'150px', background:'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)'}}>
        <div>
            <h1 style={{color:'black', margin:0}}>⚡ Energy Market</h1>
            <p style={{color:'#333'}}>ซื้อไฟราคาถูกจากเพื่อนบ้าน หรือขายไฟส่วนเกินที่นี่</p>
        </div>
        <div style={{fontSize:'4rem', color:'black', opacity:0.3}}><FaStore /></div>
      </div>

      <div className="card" style={{gridColumn:'span 2'}}>
        <h3>รายการประกาศขาย (Sell Offers)</h3>
        <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'15px'}}>
            {offers.map(offer => (
                <div key={offer.id} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center', 
                    padding:'15px', background:'#2a2a2a', borderRadius:'12px', border: '1px solid #333', opacity: offer.sold ? 0.5 : 1
                }}>
                    <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                        <FaUserCircle size={30} color="#888"/>
                        <div>
                            <div style={{fontWeight:'bold'}}>{offer.seller}</div>
                            <div style={{fontSize:'0.8rem', color:'#888'}}>{offer.amount} Units Available</div>
                        </div>
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                        <div style={{fontSize:'1.2rem', color:'var(--accent)', fontWeight:'bold'}}>฿{offer.price}/unit</div>
                        {offer.sold ? (
                            <span style={{color:'#00C851', fontWeight:'bold'}}>SOLD</span>
                        ) : (
                            <button onClick={() => handleBuy(offer.id)} className="btn-primary" style={{width:'auto', padding:'8px 20px', fontSize:'0.8rem'}}>BUY</button>
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
// 2. 🔮 AI PREDICTION (หมอดูพลังงาน)
// ==========================================
export const AIPrediction = () => {
  // Mock Graph Data
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Predicted Production (kW)',
      data: [45, 50, 20, 60, 55, 48, 52], // วันพุธตกต่ำ
      borderColor: '#00FFAB', backgroundColor: 'rgba(0, 255, 171, 0.1)', tension: 0.4, fill: true
    }]
  };

  return (
    <div className="bento-grid">
        <div className="card" style={{gridColumn:'span 2', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
                <h2 style={{margin:0}}>🌤️ Tomorrow's Forecast</h2>
                <p style={{color:'#ccc'}}>คาดการณ์: <b>แดดจัด ลมแรง</b> เหมาะแก่การผลิตไฟ</p>
            </div>
            <div style={{textAlign:'right'}}>
                <div style={{fontSize:'3rem', color:'#FFD700'}}><FaCloudSun /></div>
                <div style={{color:'#00FFAB', fontWeight:'bold'}}>+15% Efficiency</div>
            </div>
        </div>

        <div className="card" style={{gridColumn:'span 2', minHeight:'350px'}}>
            <h3>🤖 AI Projection (Next 7 Days)</h3>
            <div style={{height:'250px'}}><Line options={{maintainAspectRatio:false}} data={data} /></div>
            <div style={{marginTop:'15px', padding:'10px', background:'rgba(255, 68, 68, 0.1)', border:'1px solid #FF4444', borderRadius:'8px', fontSize:'0.9rem', color:'#FF4444'}}>
                ⚠️ แจ้งเตือน: วันพุธ (Wed) คาดว่าจะมีพายุเข้า การผลิตไฟอาจลดลงต่ำกว่า 20kW ควรสำรองไฟ!
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
    { id: 'T-001', issue: 'กังหันเสียงดังผิดปกติ', location: 'หมู่บ้านโคโนฮะ (Unit 5)', status: 'Pending', date: '2025-11-20' },
    { id: 'T-002', issue: 'ระดับน้ำไม่แสดงค่า', location: 'หมู่บ้านซึนะ (Unit 2)', status: 'Fixed', date: '2025-11-18' },
  ]);

  const addTicket = () => {
      const newTicket = { id: `T-00${tickets.length+1}`, issue: 'แจ้งซ่อมทั่วไป (Test)', location: 'ไม่ระบุ', status: 'Pending', date: '2025-11-21' };
      setTickets([newTicket, ...tickets]);
  };

  return (
    <div className="bento-grid">
        <div className="card" style={{gridColumn:'span 2', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h2>🛠️ Maintenance Center</h2>
            <button onClick={addTicket} className="btn-primary" style={{width:'auto', display:'flex', gap:'10px', alignItems:'center'}}>
                <FaPlus /> Open New Ticket
            </button>
        </div>

        <div className="card" style={{gridColumn:'span 2'}}>
            <table style={{width:'100%', borderCollapse:'collapse', color:'#ccc'}}>
                <thead>
                    <tr style={{borderBottom:'1px solid #444', textAlign:'left'}}>
                        <th style={{padding:'10px'}}>ID</th>
                        <th>Issue</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(t => (
                        <tr key={t.id} style={{borderBottom:'1px solid #222'}}>
                            <td style={{padding:'15px'}}>{t.id}</td>
                            <td style={{color:'white'}}>{t.issue}</td>
                            <td>{t.location}</td>
                            <td>{t.date}</td>
                            <td>
                                <span style={{
                                    padding:'4px 8px', borderRadius:'4px', fontSize:'0.8rem', fontWeight:'bold',
                                    background: t.status === 'Fixed' ? 'rgba(0,200,81,0.2)' : 'rgba(255,136,0,0.2)',
                                    color: t.status === 'Fixed' ? '#00C851' : '#FF8800'
                                }}>
                                    {t.status.toUpperCase()}
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
        height: '100%', padding:'20px', borderRadius:'20px',
        background: isAlert ? 'repeating-linear-gradient(45deg, #330000, #330000 10px, #550000 10px, #550000 20px)' : 'transparent',
        border: isAlert ? '4px solid #FF4444' : 'none',
        transition: '0.3s'
    }}>
        <div className="card" style={{textAlign:'center', padding:'50px'}}>
            <div style={{fontSize:'5rem', color: isAlert ? '#FF4444' : '#444', marginBottom:'20px'}}>
                <FaExclamationTriangle />
            </div>
            <h1>DISASTER EARLY WARNING SYSTEM</h1>
            <p style={{color:'#ccc'}}>ระบบตรวจจับภัยพิบัติ (ระดับน้ำท่วม / แผ่นดินไหว)</p>
            
            <button 
                onClick={() => setIsAlert(!isAlert)}
                style={{
                    marginTop:'30px', padding:'20px 40px', fontSize:'1.5rem', fontWeight:'bold', borderRadius:'50px', cursor:'pointer',
                    background: isAlert ? '#fff' : '#FF4444', color: isAlert ? '#FF4444' : '#fff', border:'none',
                    boxShadow: isAlert ? '0 0 30px #FF4444' : 'none'
                }}
            >
                {isAlert ? 'DEACTIVATE ALARM' : 'SIMULATE DISASTER'}
            </button>

            {isAlert && (
                <div style={{marginTop:'30px', color:'#FF4444', animation:'blink 1s infinite'}}>
                    <h2>🚨 EVACUATE IMMEDIATELY! 🚨</h2>
                    <p>ระดับน้ำวิกฤต! ขอให้ลูกบ้านอพยพไปยังจุดปลอดภัย</p>
                </div>
            )}
            <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
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

  return (
    <div className="bento-grid">
        <div className="card" style={{gridColumn:'span 2'}}>
            <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'20px'}}>
                <FaVoteYea size={40} color="var(--accent)" />
                <div>
                    <h2 style={{margin:0}}>Village Poll #42</h2>
                    <p style={{margin:0, color:'#888'}}>หัวข้อ: งบกองกลางเหลือ 50,000 บาท เอาไปทำอะไรดี?</p>
                </div>
            </div>

            {/* ตัวเลือก 1 */}
            <div style={{marginBottom:'15px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                    <span>1. ซ่อมกังหันตัวที่ 5</span>
                    <span>{votes.op1} โหวต</span>
                </div>
                <div style={{height:'10px', background:'#333', borderRadius:'5px', overflow:'hidden'}}>
                    <div style={{width:`${(votes.op1/total)*100}%`, height:'100%', background:'#00C851'}}></div>
                </div>
                <button onClick={()=>setVotes({...votes, op1: votes.op1+1})} style={{marginTop:'5px', background:'transparent', border:'1px solid #555', color:'white', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}>Vote</button>
            </div>

            {/* ตัวเลือก 2 */}
            <div style={{marginBottom:'15px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                    <span>2. ติดไฟทางเดินเพิ่ม</span>
                    <span>{votes.op2} โหวต</span>
                </div>
                <div style={{height:'10px', background:'#333', borderRadius:'5px', overflow:'hidden'}}>
                    <div style={{width:`${(votes.op2/total)*100}%`, height:'100%', background:'#FFD700'}}></div>
                </div>
                <button onClick={()=>setVotes({...votes, op2: votes.op2+1})} style={{marginTop:'5px', background:'transparent', border:'1px solid #555', color:'white', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}>Vote</button>
            </div>

            {/* ตัวเลือก 3 */}
            <div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                    <span>3. จัดงานเลี้ยงหมูกระทะ</span>
                    <span>{votes.op3} โหวต</span>
                </div>
                <div style={{height:'10px', background:'#333', borderRadius:'5px', overflow:'hidden'}}>
                    <div style={{width:`${(votes.op3/total)*100}%`, height:'100%', background:'#FF4444'}}></div>
                </div>
                <button onClick={()=>setVotes({...votes, op3: votes.op3+1})} style={{marginTop:'5px', background:'transparent', border:'1px solid #555', color:'white', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}>Vote</button>
            </div>
        </div>
    </div>
  );
};