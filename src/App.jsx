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
import LoginPage from './components/LoginPage';

// 👇 Import ปุ่มสวิตช์ใหม่เข้ามา
import ThemeToggle from './components/ThemeToggle';

import { Marketplace, AIPrediction, MaintenanceSystem, SafetyCenter, VotingSystem } from './components/ExtraFeatures';

function App() {
  // --- User State ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('gnt_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- Navigation State ---
  const [activeTab, setActiveTab] = useState('overview');
  const [adminSelectedVillageId, setAdminSelectedVillageId] = useState(null);

  // --- Theme State ---
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // --- Handlers ---
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

  // --- Render Logic ---
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

      return <div style={{color:'var(--text-muted)', padding:'20px'}}>🚧 Page Under Construction</div>;
  };

  if (!user) {
    return <LoginPage onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        
        {/* Brand Logo */}
        <div className="brand-icon">
            <FaBolt /> 
            {/* 👇 เพิ่มชื่อแบรนด์ให้ชัดเจน */}
            <span style={{fontSize:'1.2rem', marginLeft:'10px', fontWeight:'800', letterSpacing:'1px'}}>GNT SMART</span>
        </div>
        
        {/* 👇 เพิ่มชื่อเมนู (Text) หลังไอคอน */}
        <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => {setActiveTab('overview'); setAdminSelectedVillageId(null);}}>
            <FaHome /> <span>Home</span>
        </div>
        
        {user.role !== 'villager' && (
          <>
            <div className={`nav-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
                <FaMapMarkedAlt /> <span>District Map</span>
            </div>
            
            <div className={`nav-item ${activeTab === 'service_inbox' ? 'active' : ''}`} onClick={() => setActiveTab('service_inbox')}>
                <FaComments /> <span>Inbox</span>
            </div>

            <div className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
                <FaChartPie /> <span>AI Forecast</span>
            </div>

            <div className={`nav-item ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>
                <FaTools /> <span>Maintenance</span>
            </div>
            
            {(user.role === 'admin' || user.role === 'district' || user.role === 'god') && (
                <div className={`nav-item ${activeTab === 'accounting' ? 'active' : ''}`} onClick={() => setActiveTab('accounting')}>
                    <FaMoneyCheckAlt /> <span>Accounting</span>
                </div>
            )}

            <div className={`nav-item ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')} style={{color: activeTab === 'safety' ? 'inherit' : '#ff4757'}}>
                <FaExclamationTriangle /> <span>Safety Center</span>
            </div>
          </>
        )}
        
        <div className={`nav-item ${activeTab === 'market' ? 'active' : ''}`} onClick={() => setActiveTab('market')}>
            <FaStore /> <span>Marketplace</span>
        </div>

        <div className={`nav-item ${activeTab === 'vote' ? 'active' : ''}`} onClick={() => setActiveTab('vote')}>
            <FaVoteYea /> <span>Voting</span>
        </div>
        
        <div className="nav-bottom">
            <div className="nav-item">
                <FaCog /> <span>Settings</span>
            </div>
            <div className="nav-item" onClick={handleLogout} style={{ color: '#ff4757' }}>
                <FaSignOutAlt /> <span>Logout</span>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>Good Evening, <span className="text-accent">{user.name}</span></h1>
            <p className="text-sm">Role: {user.role.toUpperCase()} | GNT Control Center</p>
          </div>
          
          {/* 👇 ส่วนขวาบน: ปุ่ม Theme ใหม่ + Search + Bell */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              
              <div className="list-icon" style={{background:'var(--bg-input)', cursor:'pointer'}}>
                  <FaSearch color="var(--text-muted)"/>
              </div>
              <div className="list-icon" style={{background:'var(--bg-input)', cursor:'pointer'}}>
                  <FaBell color="var(--text-muted)"/>
              </div>
          </div>
        </header>
        
        <div className="content-area">
            {renderContent()}
        </div>

        {user.role === 'villager' && <UserChatWidget user={user} />}
      </main>

      {/* Right Panel */}
      <aside className="right-panel">
        <div className="profile-section">
            <div className="avatar"><FaUserAstronaut /></div>
            <div><div style={{fontWeight:'bold'}}>{user.role.toUpperCase()}</div><div className="text-sm" style={{color:'var(--accent)'}}>Online</div></div>
        </div>
        
        <div className="stat-circle-container">
            <h3 style={{margin:'0 0 15px 0'}}>Efficiency</h3>
            <div style={{width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(var(--accent) 85%, var(--bg-main) 0)', margin: '0 auto', position: 'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <div style={{width:'80%', height:'80%', background:'var(--bg-input)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <span style={{fontSize:'1.8rem', fontWeight:'bold'}}>85%</span>
                </div>
            </div>
            <p className="text-sm" style={{marginTop:'15px'}}>Overall Performance</p>
        </div>
        
        <div>
            <h3 style={{marginBottom:'15px'}}>System Status</h3>
            <div className="list-item">
                <div className="list-icon" style={{background:'rgba(46, 213, 115, 0.1)', color:'#2ed573'}}><FaBolt /></div>
                <div><div style={{fontSize:'0.9rem', fontWeight:'600'}}>Main Grid</div><div className="text-sm" style={{color:'#2ed573'}}>Stable</div></div>
            </div>
            <div className="list-item">
                <div className="list-icon" style={{background:'rgba(255, 71, 87, 0.1)', color:'#ff4757'}}><FaExclamationTriangle /></div>
                <div><div style={{fontSize:'0.9rem', fontWeight:'600'}}>Village 3 Alert</div><div className="text-sm" style={{color:'#ff4757'}}>Vibration High</div></div>
            </div>
        </div>
      </aside>
    </div>
  );
}

export default App;