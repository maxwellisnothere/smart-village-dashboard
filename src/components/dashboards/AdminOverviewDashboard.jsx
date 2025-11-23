import React, { useState, useEffect, useMemo } from 'react';
import { FaBolt } from 'react-icons/fa';
import './ChartConfig'; // เรียกใช้ Config กราฟ

export const AdminOverviewDashboard = ({ user }) => {
  const [realData, setRealData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController(); 
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/overview?t=${Date.now()}`, {
            signal: controller.signal
        });
        const rawData = await response.json();
        if (Array.isArray(rawData)) {
            setRealData(rawData);
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

  const totalDistrictPower = useMemo(() => {
    return realData.reduce((sum, log) => {
      const power = parseFloat(log.values?.power || log.power || 0);
      return sum + (isNaN(power) ? 0 : power);
    }, 0);
  }, [realData]);

  const activeVillagesCount = new Set(realData.map(d => d.village_id)).size;
  const totalAlerts = realData.filter(d => d.status !== 'normal').length;

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
        <div className="banner-card" style={{background: 'linear-gradient(135deg, #222, #000)', border:'1px solid var(--accent)'}}>
            <div>
                <h2 style={{color:'var(--accent)'}}>
                    DISTRICT TOTAL POWER 
                    {loading && <span style={{fontSize:'0.8rem', color:'#666', marginLeft:'10px'}}>(Syncing...)</span>}
                </h2>
                <div style={{fontSize:'4rem', fontWeight:'bold', color:'white'}}>
                    {(totalDistrictPower/1000).toFixed(2)} <span style={{fontSize:'1.5rem', color:'#888'}}>kW</span>
                </div>
                <p style={{color:'#ccc'}}>
                    Live Data from <span style={{color:'#00FFAB'}}>{realData.length}</span> Sensors
                </p>
            </div>
            <div style={{fontSize:'6rem', opacity:0.2}}><FaBolt /></div>
        </div>

        <div className="bento-grid" style={{gridTemplateColumns:'repeat(3, 1fr)'}}>
            <div className="card"><h3>Active Villages</h3><div className="stat-value" style={{color:'#00C851'}}>{activeVillagesCount} / 10</div></div>
            <div className="card"><h3>System Health</h3><div className="stat-value" style={{color:'#00FFAB'}}>98%</div></div>
            <div className="card"><h3>Alerts</h3><div className="stat-value" style={{color: totalAlerts > 0 ? '#FF4444' : '#888'}}>{totalAlerts} Issues</div></div>
        </div>
    </div>
  );
};

export default AdminOverviewDashboard;