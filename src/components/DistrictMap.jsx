// src/components/DistrictMap.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { VILLAGES } from '../data/mockData';
import { FaMapMarkedAlt, FaBolt, FaCity, FaTrophy } from 'react-icons/fa';

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
        // 🔴 จุดที่แก้ไข: ตัด http://localhost:1880 ออก เหลือแค่ /api/...
        // เพื่อให้มือถือวิ่งผ่าน ngrok ไปหา Server ได้ถูกต้อง
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
        if (error.name !== 'AbortError') {
            console.error("Error fetching district data:", error);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => {
        clearInterval(interval);
        controller.abort();
    };
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

        return { 
            ...v, 
            totalPower, 
            status: hasError ? 'error' : 'normal', 
            activeSensors: sensorsInVillage.length 
        };
      });
  }, [realData]);

  const districtTotalPower = villageStats.reduce((sum, v) => sum + v.totalPower, 0);
  const totalErrorVillages = villageStats.filter(v => v.status === 'error').length;
  const rankedVillages = [...villageStats].sort((a, b) => b.totalPower - a.totalPower);

  return (
    <div style={{ height: 'calc(100vh - 120px)', padding: '0 20px', display: 'flex', gap: '20px', flexDirection: 'row' }}>
      
      {/* --- Map Area (Responsive: บนมือถืออาจจะซ่อน หรือแสดงทับ) --- */}
      <div className="card" style={{ flex: 3, padding: 0, position: 'relative', background: '#111', overflow: 'hidden', minHeight: '400px' }}>
        <div style={{ width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, #222, #000)', position: 'absolute' }} />
        
        <h2 style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, margin: 0, display:'flex', alignItems:'center', gap:'10px', textShadow: '0 2px 4px black' }}>
            <FaMapMarkedAlt color="var(--accent)" /> DISTRICT OVERVIEW
            {loading && <span style={{fontSize:'0.8rem', color:'#aaa'}}>(Syncing...)</span>}
        </h2>

        {villageStats.map(v => (
          <div 
            key={v.id} 
            onClick={() => onSelectVillage(v.id)} 
            style={{ 
                position: 'absolute', 
                top: `${v.lat}%`, 
                left: `${v.lng}%`, 
                transform: 'translate(-50%, -50%)', 
                textAlign: 'center', 
                cursor: 'pointer', 
                zIndex: 20,
                transition: 'all 0.3s ease'
            }}
          >
            <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                background: v.status === 'normal' ? '#00C851' : '#FF4444', 
                boxShadow: `0 0 15px ${v.status === 'normal' ? '#00C851' : '#FF4444'}`, 
                margin: '0 auto 5px', 
                border: '2px solid white' 
            }} />
            <div style={{ background: 'rgba(0,0,0,0.85)', padding: '6px 10px', borderRadius: '6px', border:'1px solid #444', minWidth:'80px' }}>
               <div style={{color:'white', fontSize:'0.85rem', fontWeight:'bold'}}>{v.name}</div>
               <div style={{color:'var(--accent)', fontSize:'0.8rem', fontWeight:'bold', marginTop:'2px'}}>
                   {(v.totalPower/1000).toFixed(1)} kW
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Right Dashboard (Hidden on small mobile screens if needed) --- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '280px' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), transparent)', border:'1px solid var(--accent)' }}>
            <h3><FaBolt /> Total Power</h3>
            <div className="stat-value" style={{ fontSize: '2.5rem' }}>
                {(districtTotalPower/1000).toFixed(2)} <span style={{fontSize:'1rem', color:'#888'}}>kW</span>
            </div>
            <div style={{ color: '#888', fontSize: '0.9rem', marginTop:'5px' }}>
                Live Data form {realData.length} Sensors 🔴
            </div>
        </div>

         <div className="card">
            <h3><FaCity /> Status Summary</h3>
            <div style={{marginTop:'15px', display:'flex', flexDirection:'column', gap:'10px'}}>
                <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #333', paddingBottom:'5px'}}>
                    <span>Active Villages:</span>
                    <span style={{color:'#00C851', fontWeight:'bold'}}>{villageStats.length} / {VILLAGES.length}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span>Critical Villages:</span>
                    <span style={{color: totalErrorVillages > 0 ? '#FF4444' : '#888', fontWeight:'bold'}}>{totalErrorVillages}</span>
                </div>
            </div>
        </div>

        <div className="card" style={{ flex: 1, overflowY:'auto' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom:'15px', position:'sticky', top:0, background:'#1e1e1e', paddingBottom:'10px', zIndex:10 }}>
                <FaTrophy color="#FFD700" /> Top Villages
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rankedVillages.map((v, index) => (
                    <div 
                        key={v.id} 
                        onClick={() => onSelectVillage(v.id)} 
                        style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            padding: '12px', 
                            background: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255,255,255,0.03)', 
                            borderRadius: '8px', 
                            cursor:'pointer', 
                            borderLeft: index === 0 ? '3px solid #FFD700' : '3px solid transparent',
                            transition: '0.2s'
                        }}
                    >
                        <div>
                            <span style={{
                                color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#888', 
                                fontWeight:'bold', marginRight:'10px'
                            }}>#{index+1}</span> 
                            {v.name}
                        </div>
                        <div style={{color:'var(--accent)', fontWeight:'bold'}}>{(v.totalPower/1000).toFixed(1)} kW</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictMap;