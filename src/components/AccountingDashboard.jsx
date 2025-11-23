import React, { useState, useEffect } from 'react';
import { FaFileInvoiceDollar, FaTools, FaCheckCircle, FaClock, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AccountingDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก Node-RED
  useEffect(() => {
    fetch('http://localhost:1880/api/expenses')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => console.error("Err:", err));
  }, []);

  if (loading) return <div style={{color:'white', padding:'20px'}}>Loading Financial Data...</div>;

  // --- เตรียมข้อมูลกราฟ ---
  const chartData = {
    labels: ['Used', 'Remaining'],
    datasets: [
      {
        data: [data.used, data.remaining],
        backgroundColor: ['#FF4444', '#00C851'],
        borderColor: ['#CC0000', '#007E33'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', color: 'white' }}>
      
      {/* 1. Header & Summary Cards */}
      <div className="banner-card" style={{ background: 'linear-gradient(135deg, #1a237e, #000)' }}>
        <div>
          <h2 style={{ color: '#aaa', margin: 0 }}>📊 Maintenance Budget 2025</h2>
          <h1 style={{ fontSize: '3rem', margin: '10px 0' }}>฿{data.budget.toLocaleString()}</h1>
          <p>Fiscal Year 2025 | District Management</p>
        </div>
        <div style={{ fontSize: '4rem', opacity: 0.3 }}><FaMoneyBillWave /></div>
      </div>

      <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card" style={{borderLeft:'4px solid #00C851'}}>
            <h3 style={{color:'#aaa'}}>Remaining Budget</h3>
            <div className="stat-value" style={{color:'#00C851'}}>฿{data.remaining.toLocaleString()}</div>
        </div>
        <div className="card" style={{borderLeft:'4px solid #FF4444'}}>
            <h3 style={{color:'#aaa'}}>Total Expenses</h3>
            <div className="stat-value" style={{color:'#FF4444'}}>฿{data.used.toLocaleString()}</div>
        </div>
        <div className="card" style={{borderLeft:'4px solid #FFBB33'}}>
            <h3 style={{color:'#aaa'}}>Pending Claims</h3>
            <div className="stat-value" style={{color:'#FFBB33'}}>
                {data.transactions.filter(t => t.status === 'Pending').length} Items
            </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* 2. Transaction List (ตารางเบิกจ่าย) */}
        <div className="card" style={{ flex: 2 }}>
            <h3 style={{display:'flex', alignItems:'center', gap:'10px'}}><FaFileInvoiceDollar /> Recent Transactions</h3>
            <div style={{ overflowX: 'auto', marginTop:'15px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize:'0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #444', color: '#888', textAlign: 'left' }}>
                            <th style={{padding:'10px'}}>Date</th>
                            <th style={{padding:'10px'}}>Description</th>
                            <th style={{padding:'10px'}}>Type</th>
                            <th style={{padding:'10px'}}>Amount</th>
                            <th style={{padding:'10px'}}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.transactions.map((txn, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{padding:'10px', color:'#aaa'}}>{txn.date}</td>
                                <td style={{padding:'10px'}}>{txn.description}</td>
                                <td style={{padding:'10px'}}>
                                    <span style={{background:'#333', padding:'4px 8px', borderRadius:'4px', fontSize:'0.8rem'}}>
                                        {txn.type}
                                    </span>
                                </td>
                                <td style={{padding:'10px', fontWeight:'bold'}}>฿{txn.amount.toLocaleString()}</td>
                                <td style={{padding:'10px'}}>
                                    {txn.status === 'Approved' && <span style={{color:'#00C851', display:'flex', alignItems:'center', gap:'5px'}}><FaCheckCircle/> Done</span>}
                                    {txn.status === 'Pending' && <span style={{color:'#FFBB33', display:'flex', alignItems:'center', gap:'5px'}}><FaClock/> Wait</span>}
                                    {txn.status === 'Rejected' && <span style={{color:'#FF4444', display:'flex', alignItems:'center', gap:'5px'}}><FaTimesCircle/> Reject</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* 3. Budget Graph */}
        <div className="card" style={{ flex: 1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <h3 style={{marginBottom:'20px'}}>Budget Usage</h3>
            <div style={{ width: '80%' }}>
                <Doughnut data={chartData} />
            </div>
            <div style={{marginTop:'20px', textAlign:'center', color:'#888', fontSize:'0.9rem'}}>
                % of budget utilized for maintenance
            </div>
        </div>
      </div>

    </div>
  );
};

export default AccountingDashboard;