import React, { useState } from 'react';
import './App.css';
import { 
  FaBolt, FaHome, FaMapMarkedAlt, FaChartPie, FaTools, 
  FaCog, FaSignOutAlt, FaUserAstronaut, FaBell, FaSearch, 
  FaExclamationTriangle, FaStore, FaVoteYea, FaMoneyCheckAlt, FaComments
} from 'react-icons/fa';
import { USERS } from './data/mockData';

// Import Components
import HouseDashboard from './components/dashboards/HouseDashboard';
import VillageDashboard from './components/dashboards/VillageDashboard';
import AdminOverviewDashboard from './components/dashboards/AdminOverviewDashboard';
import DistrictMap from './components/DistrictMap';
import AccountingDashboard from './components/AccountingDashboard';
import { UserChatWidget, ServiceInbox } from './components/ServiceChatSystem';

// 👇 พระเอกของเราอยู่ตรงนี้
import LoginPage from './components/LoginPage'; 

import { Marketplace, AIPrediction, MaintenanceSystem, SafetyCenter, VotingSystem } from './components/ExtraFeatures';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('gnt_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [adminSelectedVillageId, setAdminSelectedVillageId] = useState(null);

  // ฟังก์ชันรับค่าเมื่อ Login สำเร็จ (รับมาจาก LoginPage)
  const handleLoginSuccess = (userData) => {
      setUser(userData);
      localStorage.setItem('gnt_user', JSON.stringify(userData));
      setActiveTab('overview');
      setAdminSelectedVillageId(null);
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('gnt_user');
  };

  const handleVillageSelect = (villageId) => {
      setAdminSelectedVillageId(villageId);
      setActiveTab('overview');
  };

  const handleBackToMap = () => {
      setAdminSelectedVillageId(null);
      setActiveTab('map');
  };

  // --- RENDER CONTENT ---
  const renderContent = () => {
      if (activeTab === 'overview') {
          if (user.role === 'villager') return <HouseDashboard user={user} />;
          if (user.role === 'district' || user.role === 'admin' || user.role === 'god') {
              if (adminSelectedVillageId) return <VillageDashboard user={user} villageIdOverride={adminSelectedVillageId} isViewOnly={true} onBack={handleBackToMap} />;
              return <AdminOverviewDashboard user={user} />;
          }
          if (user.role === 'leader') return <VillageDashboard user={user} />;
      }

      if (activeTab === 'map') return <DistrictMap onSelectVillage={handleVillageSelect} />;
      if (activeTab === 'service_inbox') return <ServiceInbox user={user} />;
      if (activeTab === 'accounting') return <AccountingDashboard />;
      
      if (activeTab === 'market') return <Marketplace />;
      if (activeTab === 'ai') return <AIPrediction />;
      if (activeTab === 'maintenance') return <MaintenanceSystem />;
      if (activeTab === 'safety') return <SafetyCenter />;
      if (activeTab === 'vote') return <VotingSystem />;

      return <div style={{color:'white', padding:'20px'}}>🚧 Page Under Construction</div>;
  };

  // --- 🔴 จุดเปลี่ยนสำคัญ! ---
  // ถ้ายังไม่ Login ให้เรียกใช้ Component ใหม่สุดเท่ของเรา
  if (!user) {
    return <LoginPage onLogin={handleLoginSuccess} />;
  }

  // --- MAIN LAYOUT ---
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand-icon"><FaBolt /></div>
        <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => {setActiveTab('overview'); setAdminSelectedVillageId(null);}} title="Home"><FaHome /></div>
        
        {user.role !== 'villager' && (
          <>
            <div className={`nav-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')} title="Map"><FaMapMarkedAlt /></div>
            <div className={`nav-item ${activeTab === 'service_inbox' ? 'active' : ''}`} onClick={() => setActiveTab('service_inbox')} title="Service Inbox"><FaComments /></div>
            <div className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')} title="AI Forecast"><FaChartPie /></div>
            <div className={`nav-item ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')} title="Maintenance"><FaTools /></div>
            
            {(user.role === 'admin' || user.role === 'district' || user.role === 'god') && (
                <div className={`nav-item ${activeTab === 'accounting' ? 'active' : ''}`} onClick={() => setActiveTab('accounting')} title="Accounting"><FaMoneyCheckAlt /></div>
            )}

            <div className={`nav-item ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')} title="Safety Center" style={{color:'#FF4444'}}><FaExclamationTriangle /></div>
          </>
        )}
        
        <div className={`nav-item ${activeTab === 'market' ? 'active' : ''}`} onClick={() => setActiveTab('market')} title="Marketplace"><FaStore /></div>
        <div className={`nav-item ${activeTab === 'vote' ? 'active' : ''}`} onClick={() => setActiveTab('vote')} title="Vote"><FaVoteYea /></div>
        
        <div className="nav-bottom">
            <div className="nav-item"><FaCog /></div>
            <div className="nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}><FaSignOutAlt /></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <h1>Good Evening, <span className="text-accent">{user.name}</span></h1>
            <p className="text-sm">Role: {user.role.toUpperCase()} | GNT Control Center</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{background:'#222', padding:'10px', borderRadius:'50%'}}><FaSearch color="#888"/></div>
              <div style={{background:'#222', padding:'10px', borderRadius:'50%'}}><FaBell color="#888"/></div>
          </div>
        </header>
        <div className="content-area">{renderContent()}</div>
        {user.role === 'villager' && <UserChatWidget user={user} />}
      </main>

      <aside className="right-panel">
        <div className="profile-section">
            <div className="avatar"><FaUserAstronaut /></div>
            <div><div style={{fontWeight:'bold'}}>{user.role.toUpperCase()}</div><div className="text-sm">Online</div></div>
        </div>
        <div className="stat-circle-container">
            <h3 style={{margin:'0 0 15px 0'}}>Efficiency</h3>
            <div style={{width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(var(--accent) 85%, #333 0)', margin: '0 auto', position: 'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <div style={{width:'80%', height:'80%', background:'#111', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <span style={{fontSize:'1.5rem', fontWeight:'bold'}}>85%</span>
                </div>
            </div>
            <p className="text-sm" style={{marginTop:'15px'}}>Overall Performance</p>
        </div>
        <div>
            <h3 style={{marginBottom:'15px'}}>System Status</h3>
            <div className="list-item"><div className="list-icon" style={{background:'rgba(46, 213, 115, 0.2)', color:'#2ed573'}}><FaBolt /></div><div><div style={{fontSize:'0.9rem'}}>Main Grid</div><div className="text-sm" style={{color:'#2ed573'}}>Stable</div></div></div>
            <div className="list-item"><div className="list-icon" style={{background:'rgba(255, 71, 87, 0.2)', color:'#ff4757'}}><FaExclamationTriangle /></div><div><div style={{fontSize:'0.9rem'}}>Village 3 Alert</div><div className="text-sm" style={{color:'#ff4757'}}>Vibration High</div></div></div>
        </div>
      </aside>
    </div>
  );
}

export default App;