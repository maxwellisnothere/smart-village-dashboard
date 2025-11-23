// src/components/DistrictMap.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { VILLAGES } from '../data/mockData';
import { FaMapMarkedAlt, FaBolt, FaCity, FaTrophy, FaGlobeAsia } from 'react-icons/fa';

// --- Helper: จัดระเบียบข้อมูล ---
const normalizeItem = (item) => {
    if (item.payload && typeof item.payload === 'object') {
        return { ...item.payload, _rawStatus: item.status };
    }
    return item;
};

const DistrictMap = ({ onSelectVillage }) => {
  const [realData, setRealData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/overview?t=${Date.now()}`, {
            signal: controller.signal
        });
        const rawJson = await response.json();
        if (Array.isArray(rawJson)) {
            const cleanData = rawJson.map(normalizeItem);
            setRealData(cleanData);
        }
        setLoading(false);
      } catch (error) {
        if (error.name !== 'AbortError') console.error("Error:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => { clearInterval(interval); controller.abort(); };
  }, []);

  // --- คำนวณข้อมูล ---
  const villageStats = useMemo(() => {
      return VILLAGES.map(v => {
        const sensorsInVillage = realData.filter(d => d.village_id === v.id);
        const totalPower = sensorsInVillage.reduce((sum, d) => {
            const powerVal = parseFloat(d.values?.power || d.power || 0);
            return sum + (isNaN(powerVal) ? 0 : powerVal);
        }, 0);
        const hasError = sensorsInVillage.some(d => d.status === 'error' || d._rawStatus === 'error');
        return { ...v, totalPower, status: hasError ? 'error' : 'normal', activeSensors: sensorsInVillage.length };
      });
  }, [realData]);

  const districtTotalPower = villageStats.reduce((sum, v) => sum + v.totalPower, 0);
  const totalErrorVillages = villageStats.filter(v => v.status === 'error').length;
  const rankedVillages = [...villageStats].sort((a, b) => b.totalPower - a.totalPower);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>
      
      {/* 🆕 ส่วนหัวข้อที่เพิ่มเข้ามา (Header Section) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
                width: '50px', height: '50px', borderRadius: '12px', 
                background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
            }}>
                <FaGlobeAsia size={28} color="var(--bg-main)" />
            </div>
            <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>Geospatial Monitoring</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Live tracking of {VILLAGES.length} villages across the district network
                </p>
            </div>
        </div>
        
        {/* Status Badge เล็กๆ ขวามือ */}
        <div style={{ 
            padding: '8px 16px', background: 'var(--bg-card)', borderRadius: '30px', 
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px'
        }}>
            <div style={{width:'10px', height:'10px', borderRadius:'50%', background: loading ? '#FFAA00' : '#00C851', boxShadow: loading ? '' : '0 0 10px #00C851'}}></div>
            <span style={{fontSize:'0.85rem', color: 'var(--text-muted)'}}>{loading ? 'Syncing...' : 'System Online'}</span>
        </div>
      </div>

      {/* --- ส่วนแสดงผลเดิม (Map + Dashboard) --- */}
      <div style={{ flex: 1, display: 'flex', gap: '20px', minHeight: 0 }}> {/* minHeight 0 สำคัญเพื่อให้ flex child scroll ได้ */}
        
        {/* Map */}
        <div className="card" style={{ flex: 3, padding: 0, position: 'relative', background: '#050505', overflow: 'hidden', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)', position: 'absolute' }} />
            <div style={{ 
                position: 'absolute', inset: 0, 
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', 
                backgroundSize: '40px 40px', opacity: 0.5 
            }}></div>
            
            <h3 style={{ position: 'absolute', top: 20, left: 25, zIndex: 10, margin: 0, display:'flex', alignItems:'center', gap:'10px', color: 'var(--text-muted)', textTransform:'uppercase', letterSpacing:'1px', fontSize:'0.9rem' }}>
                <FaMapMarkedAlt /> DISTRICT OVERVIEW
            </h3>

            {villageStats.map(v => (
            <div key={v.id} onClick={() => onSelectVillage(v.id)} style={{ position: 'absolute', top: `${v.lat}%`, left: `${v.lng}%`, transform: 'translate(-50%, -50%)', textAlign: 'center', cursor: 'pointer', zIndex: 20, transition: 'all 0.3s ease' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: v.status === 'normal' ? '#00C851' : '#FF4444', boxShadow: `0 0 15px ${v.status === 'normal' ? '#00C851' : '#FF4444'}`, margin: '0 auto 8px', border: '2px solid white' }} />
                <div style={{ background: 'var(--bg-card)', padding: '6px 12px', borderRadius: '8px', border:'1px solid var(--border)', minWidth:'90px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                    <div style={{color:'var(--text-main)', fontSize:'0.8rem', fontWeight:'bold'}}>{v.name}</div>
                    <div style={{color:'var(--accent)', fontSize:'0.75rem', fontWeight:'bold', marginTop:'2px'}}>{(v.totalPower/1000).toFixed(1)} kW</div>
                </div>
            </div>
            ))}
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '280px' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--bg-main))', border:'1px solid var(--accent)' }}>
                <h3 style={{color: 'var(--text-muted)', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'8px'}}><FaBolt color="var(--accent)"/> REAL-TIME POWER</h3>
                <div className="stat-value" style={{ fontSize: '2.8rem', color: 'var(--text-main)' }}>
                    {(districtTotalPower/1000).toFixed(2)} <span style={{fontSize:'1rem', color:'var(--text-muted)', fontWeight:'normal'}}>kW</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop:'5px' }}>
                    Live Data form {realData.length} Sensors <span style={{color:'#FF4444'}}>●</span>
                </div>
            </div>

            <div className="card">
                <h3 style={{color: 'var(--text-muted)', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'8px'}}><FaCity /> STATUS SUMMARY</h3>
                <div style={{marginTop:'15px', display:'flex', flexDirection:'column', gap:'12px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid var(--border)', paddingBottom:'8px'}}>
                        <span style={{color:'var(--text-main)'}}>Active Villages</span>
                        <span style={{color:'#00C851', fontWeight:'bold'}}>{villageStats.length} / {VILLAGES.length}</span>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <span style={{color:'var(--text-main)'}}>Critical Issues</span>
                        <span style={{color: totalErrorVillages > 0 ? '#FF4444' : 'var(--text-muted)', fontWeight:'bold'}}>{totalErrorVillages}</span>
                    </div>
                </div>
            </div>

            <div className="card" style={{ flex: 1, overflowY:'auto', minHeight:'200px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom:'15px', position:'sticky', top:0, background:'var(--bg-card)', paddingBottom:'10px', zIndex:10, fontSize:'0.9rem', color:'var(--text-muted)' }}>
                    <FaTrophy color="#FFD700" /> TOP PRODUCERS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {rankedVillages.map((v, index) => (
                        <div key={v.id} onClick={() => onSelectVillage(v.id)} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-input)', borderRadius: '8px', cursor:'pointer', borderLeft: index === 0 ? '3px solid #FFD700' : '3px solid transparent', transition: '0.2s' }}>
                            <div style={{color: 'var(--text-main)', fontSize:'0.9rem'}}>
                                <span style={{color: index === 0 ? '#FFD700' : 'var(--text-muted)', fontWeight:'bold', marginRight:'8px'}}>#{index+1}</span> 
                                {v.name}
                            </div>
                            <div style={{color:'var(--accent)', fontWeight:'bold', fontSize:'0.9rem'}}>{(v.totalPower/1000).toFixed(1)} kW</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DistrictMap;