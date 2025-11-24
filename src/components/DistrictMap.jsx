import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VILLAGES } from '../data/mockData';
import { FaBolt, FaFilter, FaHistory, FaTicketAlt, FaMapMarkerAlt, FaCheckCircle, FaLeaf, FaArrowsAlt } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import worldMap from '../assets/world-map.jpg'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const normalizeItem = (item) => {
    if (item.payload && typeof item.payload === 'object') {
        return { ...item.payload, _rawStatus: item.status };
    }
    return item;
};

const DistrictMap = ({ onSelectVillage, theme }) => {
  const [realData, setRealData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [customLocations, setCustomLocations] = useState({});
  const [movingId, setMovingId] = useState(null);
  
  const mapRef = useRef(null);
  const chartColor = theme === 'light' ? '#E65100' : '#FFD700';

  // --- 1. Load Data & Locations ---
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        // 1.1 ดึงข้อมูล Sensor
        const resOverview = await fetch(`/api/overview?t=${Date.now()}`, { signal: controller.signal });
        const rawJson = await resOverview.json();
        if (Array.isArray(rawJson)) setRealData(rawJson.map(normalizeItem));

        // 1.2 ดึงข้อมูลพิกัดที่เคยย้ายไว้ (Load Locations)
        const resLoc = await fetch(`/api/village/locations`, { signal: controller.signal });
        if (resLoc.ok) {
            const locData = await resLoc.json();
            const locMap = {};
            locData.forEach(l => {
                locMap[l.id] = { lat: l.lat, lng: l.lng };
            });
            setCustomLocations(locMap);
        }

        setLoading(false);
      } catch (error) {
        if (error.name !== 'AbortError') console.error("Error:", error);
      }
    };

    fetchData();
    const interval = setInterval(async () => {
        // Polling เฉพาะ Sensor Data พอ (พิกัดไม่ต้องโหลดบ่อย)
        try {
            const res = await fetch(`/api/overview?t=${Date.now()}`, { signal: controller.signal });
            const raw = await res.json();
            if (Array.isArray(raw)) setRealData(raw.map(normalizeItem));
        } catch(e) {}
    }, 5000);

    return () => { clearInterval(interval); controller.abort(); };
  }, []);

  const handleRightClickMarker = (e, id) => {
      e.preventDefault();
      e.stopPropagation();
      setMovingId(id);
  };

  // --- 2. Save Location Logic ---
  const handleMapClick = async (e) => {
      if (movingId && mapRef.current) {
          const rect = mapRef.current.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;

          // Update State ทันที (เพื่อให้ลื่น)
          setCustomLocations(prev => ({
              ...prev,
              [movingId]: { lat: y, lng: x }
          }));

          // ส่งไปบันทึกใน MongoDB (Background)
          try {
              await fetch('/api/village/location', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: movingId, lat: y, lng: x })
              });
              console.log(`Saved location for ${movingId}`);
          } catch (err) {
              console.error("Failed to save location:", err);
              alert("Failed to save location to server!");
          }
          
          setMovingId(null);
      }
  };

  // ... (Logic คำนวณ villageStats คงเดิม) ...
  const villageStats = useMemo(() => {
      return VILLAGES.map(v => {
        const sensors = realData.filter(d => d.village_id === v.id);
        const totalPower = sensors.reduce((sum, d) => sum + (parseFloat(d.values?.power || d.power || 0) || 0), 0);
        const isOffline = totalPower === 0 || sensors.length === 0;
        const hasError = sensors.some(d => d.status === 'error' || d._rawStatus === 'error');

        let status = 'normal'; 
        if (hasError) status = 'error'; 
        else if (isOffline) status = 'offline'; 

        const currentLat = customLocations[v.id]?.lat || v.lat;
        const currentLng = customLocations[v.id]?.lng || v.lng;

        return { ...v, lat: currentLat, lng: currentLng, totalPower, status, activeSensors: sensors.length };
      });
  }, [realData, customLocations]);

  const totalPower = villageStats.reduce((sum, v) => sum + v.totalPower, 0);
  const totalErrorVillages = villageStats.filter(v => v.status === 'error').length;
  const totalOfflineVillages = villageStats.filter(v => v.status === 'offline').length;

  const getStatusColor = (status) => {
      if (status === 'error') return '#ff4757'; 
      if (status === 'offline') return '#666666'; 
      return '#00C851'; 
  };

  const chartData = {
    labels: villageStats.map(v => v.name.replace('หมู่บ้าน', '')),
    datasets: [{
      label: 'Usage (kW)',
      data: villageStats.map(v => (v.totalPower/1000).toFixed(1)),
      backgroundColor: chartColor,
      borderRadius: 4,
      barThickness: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#333', titleColor: '#fff', bodyColor: '#ccc' } },
    scales: {
      x: { ticks: { color: '#666', font: {size: 10} }, grid: { display: false } },
      y: { display: false, grid: { display: false } }
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)', display: 'flex', gap: '20px', position: 'relative' }}>
      <div 
        ref={mapRef} 
        onClick={handleMapClick} 
        className="card" 
        style={{ 
          flex: 3, padding: 0, position: 'relative', overflow: 'hidden', 
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          cursor: movingId ? 'crosshair' : 'default' 
        }}
      >
        <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${worldMap})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: theme === 'light' ? 0.9 : 0.7, 
            filter: theme === 'light' ? 'grayscale(20%) contrast(110%)' : 'grayscale(100%) invert(85%) contrast(120%) brightness(80%) hue-rotate(180deg)',
            pointerEvents: 'none'
        }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`, backgroundSize: '50px 50px', opacity: 0.15, pointerEvents: 'none' }} />
        
        {movingId && (
            <div style={{
                position:'absolute', top: 20, left:'50%', transform:'translateX(-50%)', zIndex:100,
                background:'var(--accent)', color:'var(--bg-main)', padding:'10px 20px', borderRadius:'30px',
                fontWeight:'bold', boxShadow:'0 0 20px var(--accent)', animation:'pulse 1s infinite'
            }}>
                <FaArrowsAlt /> Placing {VILLAGES.find(v=>v.id===movingId)?.name}...
            </div>
        )}

        {villageStats.map(v => {
          const color = getStatusColor(v.status);
          const isOffline = v.status === 'offline';
          const isMoving = movingId === v.id;

          return (
            <div key={v.id} 
                onContextMenu={(e) => handleRightClickMarker(e, v.id)}
                onClick={(e) => { e.stopPropagation(); onSelectVillage(v.id); }}
                style={{ 
                    position: 'absolute', top: `${v.lat}%`, left: `${v.lng}%`, 
                    transform: isMoving ? 'translate(-50%, -50%) scale(1.2)' : 'translate(-50%, -50%)', 
                    cursor: 'pointer', zIndex: isMoving ? 50 : 20,
                    transition: 'top 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), left 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.2s',
                    opacity: isMoving ? 0.8 : 1
                }}
                className="map-marker"
            >
                <div style={{position:'relative'}}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card)', 
                        border: isMoving ? '2px dashed var(--accent)' : `2px solid ${color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isOffline ? 'none' : `0 0 15px ${color}66`
                    }}>
                        <FaBolt size={14} color={isOffline ? 'var(--text-muted)' : color} />
                    </div>
                    {!isOffline && <div style={{position:'absolute', top:0, right:0, width:'12px', height:'12px', borderRadius:'50%', background: color, border: '2px solid var(--bg-card)'}} />}
                </div>
                <div style={{ 
                    marginTop: '8px', background: 'var(--bg-card)', padding: '4px 10px', borderRadius: '6px', 
                    border: `1px solid ${isMoving ? 'var(--accent)' : (isOffline ? 'var(--text-muted)' : color)}`, 
                    fontSize: '0.75rem', color: isOffline ? 'var(--text-muted)' : 'var(--text-main)', 
                    textAlign: 'center', whiteSpace: 'nowrap', fontWeight:'600'
                }}>
                    {v.name}
                </div>
            </div>
          );
        })}
      </div>

      {/* Right Panel (Code เหมือนเดิม) */}
      <div style={{ flex: 1, minWidth: '320px', background: 'var(--bg-card)', borderRadius: '24px', padding: '25px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '20px', backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow)' }}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
            <div>
                <h2 style={{margin:0, fontSize:'1.4rem', color:'var(--text-main)'}}>DISTRICT HUB</h2>
                <p style={{margin:'5px 0 0', color:'var(--text-muted)', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'5px'}}><FaMapMarkerAlt /> Central Command</p>
            </div>
            <div style={{textAlign:'right'}}>
                 <div style={{fontSize:'2rem', fontWeight:'bold', color:'var(--accent)'}}>{((totalPower)/1000).toFixed(2)} <span style={{fontSize:'1rem'}}>kW</span></div>
                 <div style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>Total Load</div>
            </div>
        </div>
        <div style={{height:'120px', width:'100%'}}><Bar data={chartData} options={chartOptions} /></div>
        <div style={{display:'flex', flexDirection:'column', gap:'15px', fontSize:'0.9rem'}}>
             <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'var(--text-muted)'}}>Active Sensors</span><span style={{color:'var(--text-main)'}}>{realData.length} / 100</span></div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); } }`}</style>
    </div>
  );
};

export default DistrictMap;