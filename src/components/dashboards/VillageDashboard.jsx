import React, { useState, useEffect, useMemo } from 'react';
import { FaBolt, FaMoneyBillWave, FaHeartbeat, FaArrowLeft, FaCog, FaWater } from 'react-icons/fa';
import { VILLAGES } from '../../data/mockData'; // 👈 ถอยหลัง 2 ที
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Line, Bar } from 'react-chartjs-2';
import './ChartConfig';

export const VillageDashboard = ({ user, isViewOnly, onBack, villageIdOverride }) => {
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [realVillageData, setRealVillageData] = useState([]); 
  
  const [graphHistory, setGraphHistory] = useState({
    labels: Array(10).fill(''),
    power: Array(10).fill(0),
    rpm: Array(10).fill(0),
    water: Array(10).fill(0),
    vib: Array(10).fill(0)
  });

  const targetVillageId = villageIdOverride || user.villageId;
  const village = VILLAGES.find(v => v.id === targetVillageId) || (user.role === 'district' && VILLAGES[0]); 

  useEffect(() => {
    if (!village) return;
    const controller = new AbortController();
    const fetchData = async () => {
        try {
            const res = await fetch(`/api/overview?t=${Date.now()}`, { signal: controller.signal });
            const rawData = await res.json();
            if (Array.isArray(rawData)) {
                const filtered = rawData.filter(d => d.village_id === village.id);
                setRealVillageData(filtered);
                if (filtered.length > 0) {
                    const now = new Date().toLocaleTimeString('th-TH');
                    const totalP = filtered.reduce((s, h) => s + (parseFloat(h.values?.power || h.power || 0)), 0);
                    const avgRPM = filtered.reduce((s, h) => s + (parseFloat(h.values?.rpm || h.rpm || 0)), 0) / filtered.length;
                    const avgWater = filtered.reduce((s, h) => s + (parseFloat(h.values?.level || h.level || 0)), 0) / filtered.length;
                    const avgVib = filtered.reduce((s, h) => s + (parseFloat(h.values?.vibration || h.vibration || 0)), 0) / filtered.length;

                    setGraphHistory(prev => ({
                        labels: [...prev.labels.slice(1), now],
                        power: [...prev.power.slice(1), totalP],
                        rpm: [...prev.rpm.slice(1), avgRPM],
                        water: [...prev.water.slice(1), avgWater],
                        vib: [...prev.vib.slice(1), avgVib]
                    }));
                }
            }
        } catch (e) { if (e.name !== 'AbortError') console.error(e); }
    };
    fetchData(); 
    const interval = setInterval(fetchData, 5000);
    return () => { clearInterval(interval); controller.abort(); };
  }, [village?.id]);

  if (!village) return <div style={{padding:'20px', color:'white'}}>❌ Village Not Found</div>;

  const sortedHouses = useMemo(() => {
      return [...realVillageData]
        .sort((a, b) => parseFloat(b.values?.power || 0) - parseFloat(a.values?.power || 0))
        .slice(0, 3);
  }, [realVillageData]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Report: ${village.name}`, 14, 20);
    const tableData = realVillageData.map(h => [h.house_id || '-', h.owner || 'Unknown', (h.values?.power || 0) + ' W', h.status || 'Offline']);
    doc.autoTable({ head: [['ID', 'Owner', 'Power', 'Status']], body: tableData, startY: 30 });
    doc.save(`report-${village.id}.pdf`);
  };

  if (selectedHouse) {
    const housePower = parseFloat(selectedHouse.values?.power || 0);
    const monthlyDataPoints = Array.from({ length: 12 }, () => Math.max(0, Math.floor((housePower/5) + (Math.random() * 50 - 25))));
    const totalYear = monthlyDataPoints.reduce((a, b) => a + b, 0);
    const income = (totalYear * 4.5).toLocaleString();
    const houseVib = parseFloat(selectedHouse.values?.vibration || 0);
    const monthlyData = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], datasets: [{ label: 'Energy (kWh)', data: monthlyDataPoints, backgroundColor: '#FFD700', borderRadius: 6 }] };
    const barOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#888' }, grid: { color: '#333' } }, x: { ticks: { color: '#888' }, grid: { display: false } } } };

    return (
      <div className="bento-grid" style={{display:'flex', flexDirection:'column', gap:'20px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            <button onClick={() => setSelectedHouse(null)} className="btn-primary" style={{width:'auto', padding:'10px 20px', background:'#333', color:'white', border:'1px solid #555', borderRadius:'12px', cursor:'pointer'}}><FaArrowLeft /> Back</button>
            <h2 style={{margin:0, color:'white'}}>🏠 {selectedHouse.owner} <span style={{fontSize:'1rem', color:'#888'}}>(History Report)</span></h2>
        </div>
        <div className="bento-grid" style={{gridTemplateColumns:'repeat(3, 1fr)'}}>
            <div className="card"><div style={{display:'flex', gap:'10px', alignItems:'center'}}><FaBolt color="var(--accent)"/> Total Year</div><div className="stat-value">{totalYear.toLocaleString()} kWh</div></div>
            <div className="card"><div style={{display:'flex', gap:'10px', alignItems:'center'}}><FaMoneyBillWave color="#00C851"/> Income</div><div className="stat-value" style={{color:'#00C851'}}>฿{income}</div></div>
            <div className="card"><div style={{display:'flex', gap:'10px', alignItems:'center'}}><FaHeartbeat color="#FF3D71"/> Health</div><div className="stat-value" style={{color: houseVib > 5 ? '#FF4444' : '#00C851'}}>{houseVib > 5 ? 'Check!' : 'Good'}</div></div>
        </div>
        <div className="card" style={{minHeight: '350px'}}><h3>📅 Annual Production (2025)</h3><div style={{ height: '280px', width: '100%', position:'relative' }}><Bar options={barOptions} data={monthlyData} /></div></div>
      </div>
    );
  }

  const commonOptions = { responsive: true, maintainAspectRatio: false, animation: { duration: 0 }, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#888' }, grid: { color: '#333' } }, x: { display: false } }, elements: { point: { radius: 0 }, line: { borderWidth: 3 } } };
  const powerChart = { labels: graphHistory.labels, datasets: [{ data: graphHistory.power, borderColor: '#FFD700', backgroundColor: 'rgba(255, 215, 0, 0.2)', fill: true, tension: 0.4 }] };
  const rpmChart = { labels: graphHistory.labels, datasets: [{ data: graphHistory.rpm, borderColor: '#00FFAB', backgroundColor: 'transparent', fill: false, tension: 0.2 }] };
  const waterChart = { labels: graphHistory.labels, datasets: [{ data: graphHistory.water, borderColor: '#29B6F6', backgroundColor: 'rgba(41, 182, 246, 0.4)', fill: 'start', tension: 0.4 }] };
  const vibChart = { labels: graphHistory.labels, datasets: [{ data: graphHistory.vib, borderColor: '#FF3D71', backgroundColor: 'rgba(255, 61, 113, 0.1)', fill: true, tension: 0.1 }] };
  const displayPower = graphHistory.power[graphHistory.power.length - 1] || 0;
  const displayRPM = graphHistory.rpm[graphHistory.rpm.length - 1] || 0;
  const displayWater = graphHistory.water[graphHistory.water.length - 1] || 0;
  const displayVib = graphHistory.vib[graphHistory.vib.length - 1] || 0;

  return (
    <div style={{width:'100%'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
             {onBack && <button onClick={onBack} className="btn-primary" style={{width:'auto', padding:'10px', background:'#333', border:'1px solid #555', color:'white', cursor:'pointer', borderRadius:'8px'}}><FaArrowLeft /></button>}
             <h1 style={{margin:0}}>🏘️ {village.name}</h1>
        </div>
        <button onClick={handleExportPDF} style={{padding:'10px 20px', background:'var(--accent)', border:'none', borderRadius:'12px', cursor:'pointer', fontWeight:'bold'}}>EXPORT REPORT</button>
      </div>
       <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', marginBottom:'20px' }}>
         <div className="card" style={{ height: '280px', background: 'linear-gradient(145deg, rgba(255,215,0,0.05), transparent)' }}><h4 style={{color:'#FFD700', margin:0}}><FaBolt/> Total Power</h4><div style={{height:'180px', width:'100%', position:'relative'}}><Line options={commonOptions} data={powerChart} /></div><div style={{textAlign:'right', fontSize:'1.2rem', fontWeight:'bold', color:'#FFD700'}}>{(displayPower / 1000).toFixed(2)} kW</div></div>
         <div className="card" style={{ height: '280px', background: 'linear-gradient(145deg, rgba(0,255,171,0.05), transparent)' }}><h4 style={{color:'#00FFAB', margin:0}}><FaCog/> Avg RPM</h4><div style={{height:'180px', width:'100%', position:'relative'}}><Line options={commonOptions} data={rpmChart} /></div><div style={{textAlign:'right', fontSize:'1.2rem', fontWeight:'bold', color:'#00FFAB'}}>{displayRPM.toFixed(0)} rpm</div></div>
         <div className="card" style={{ height: '280px', background: 'linear-gradient(145deg, rgba(41,182,246,0.05), transparent)' }}><h4 style={{color:'#29B6F6', margin:0}}><FaWater/> Water Level</h4><div style={{height:'180px', width:'100%', position:'relative'}}><Line options={{...commonOptions, scales:{y:{min:0, max:100, display:false}, x:{display:false}}}} data={waterChart} /></div><div style={{textAlign:'right', fontSize:'1.2rem', fontWeight:'bold', color:'#29B6F6'}}>{displayWater.toFixed(1)} %</div></div>
         <div className="card" style={{ height: '280px', background: 'linear-gradient(145deg, rgba(255,61,113,0.05), transparent)' }}><h4 style={{color:'#FF3D71', margin:0}}><FaHeartbeat/> Vibration</h4><div style={{height:'180px', width:'100%', position:'relative'}}><Line options={commonOptions} data={vibChart} /></div><div style={{textAlign:'right', fontSize:'1.2rem', fontWeight:'bold', color:'#FF3D71'}}>{displayVib.toFixed(1)} Hz</div></div>
      </div>
       <div className="bento-grid" style={{gridTemplateColumns:'2fr 1fr', gap:'20px'}}>
           <div className="card" style={{height:'600px', overflowY:'auto'}}><h3 style={{marginBottom:'15px'}}>📋 Live House List</h3>{realVillageData.map((h, index) => (<div key={h.house_id || index} onClick={()=>setSelectedHouse(h)} style={{padding:'15px', borderBottom:'1px solid #333', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', transition: '0.2s'}} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}><div><div style={{fontWeight:'bold'}}>{h.owner}</div><div style={{fontSize:'0.8rem', color:'#888'}}>{h.house_id}</div></div><div style={{textAlign:'right'}}><div style={{color:'var(--accent)', fontWeight:'bold'}}>{h.values?.power || 0} W</div><div style={{fontSize:'0.7rem', color: h.status === 'normal' ? '#00C851' : '#FF4444'}}>● {h.status}</div></div></div>))}</div>
           <div className="card" style={{height:'fit-content'}}><h3>🏆 Top Producers</h3>{sortedHouses.map((h, i) => (<div key={h.house_id || i} style={{display:'flex', justifyContent:'space-between', padding:'10px', borderBottom:'1px solid #333'}}><span style={{color: i===0?'#FFD700': i===1?'#C0C0C0':'#CD7F32'}}>#{i+1} {h.owner}</span><span style={{color:'var(--accent)'}}>{h.values?.power || 0} W</span></div>))}</div>
       </div>
    </div>
  );
};

export default VillageDashboard;