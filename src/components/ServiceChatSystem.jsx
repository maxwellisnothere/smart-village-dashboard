import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaUser, FaHeadset, FaShareSquare, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// --- 💾 Mock Database (ใช้ LocalStorage จำลอง Server) ---
const loadChats = () => {
  const saved = localStorage.getItem('service_chats');
  if (saved) return JSON.parse(saved);
  return []; // เริ่มต้นเป็นอาร์เรย์ว่าง
};

const saveChats = (chats) => {
  localStorage.setItem('service_chats', JSON.stringify(chats));
};

// ==========================================
// 🧑‍💻 Component 1: หน้าจอแชทของลูกบ้าน (User Widget)
// ==========================================
export const UserChatWidget = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chats, setChats] = useState(loadChats());

  // หาห้องแชทของตัวเอง (ถ้าไม่มีก็สร้างใหม่)
  const myChat = chats.find(c => c.userId === user.houseId) || { messages: [] };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newChats = [...chats];
    const chatIndex = newChats.findIndex(c => c.userId === user.houseId);

    const newMessage = { sender: 'user', text: input, time: new Date().toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'}) };

    if (chatIndex > -1) {
      newChats[chatIndex].messages.push(newMessage);
      newChats[chatIndex].status = 'open'; 
    } else {
      newChats.push({
        id: Date.now(),
        userId: user.houseId,
        userName: user.name,
        villageId: user.villageId,
        messages: [newMessage],
        status: 'open',
        isEscalated: false
      });
    }

    setChats(newChats);
    saveChats(newChats);
    setInput('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', fontSize: '1.5rem', color: 'black' }}>
          <FaHeadset />
        </button>
      )}

      {isOpen && (
        <div style={{ width: '350px', height: '500px', background: '#222', borderRadius: '15px', border: '1px solid #444', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {/* Header */}
          <div style={{ padding: '15px', background: 'var(--accent)', color: 'black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>💬 แจ้งปัญหา (Service)</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {myChat.messages.length === 0 && <p style={{textAlign:'center', color:'#666', marginTop:'50px'}}>สวัสดีครับ มีปัญหาอะไรแจ้งผู้ใหญ่บ้านได้เลยครับ</p>}
            {myChat.messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{ 
                  background: m.sender === 'user' ? '#007bff' : '#444', 
                  color: 'white', padding: '8px 12px', borderRadius: '10px', fontSize: '0.9rem' 
                }}>
                  {m.text}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '2px', textAlign: m.sender === 'user' ? 'right' : 'left' }}>{m.time}</div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ padding: '10px', borderTop: '1px solid #444', display: 'flex', gap: '10px' }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="พิมพ์ปัญหาของคุณ..." 
              style={{ flex: 1, padding: '10px', borderRadius: '20px', border: 'none', background: '#333', color: 'white' }} 
            />
            <button onClick={handleSend} style={{ background: 'var(--accent)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <FaPaperPlane color="black"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 👮‍♂️ Component 2: หน้าจอรับเรื่อง (Leader & Admin Inbox)
// ==========================================
export const ServiceInbox = ({ user }) => {
  const [chats, setChats] = useState(loadChats());
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [reply, setReply] = useState('');

  // --- Logic กรองข้อความตาม Role ---
  const filteredChats = chats.filter(chat => {
    if (user.role === 'district' || user.role === 'admin' || user.role === 'god') {
      return true; 
    } else if (user.role === 'leader') {
      return chat.villageId === user.villageId;
    }
    return false;
  });

  const activeChat = chats.find(c => c.id === selectedChatId);

  const handleReply = () => {
    if (!reply.trim() || !activeChat) return;

    const newChats = chats.map(c => {
      if (c.id === selectedChatId) {
        return {
          ...c,
          messages: [...c.messages, { sender: 'service', text: reply, time: new Date().toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'}) }]
        };
      }
      return c;
    });

    setChats(newChats);
    saveChats(newChats);
    setReply('');
  };

  const handleEscalate = () => {
    const newChats = chats.map(c => {
      if (c.id === selectedChatId) {
        return { ...c, isEscalated: true };
      }
      return c;
    });
    setChats(newChats);
    saveChats(newChats);
    alert('ส่งเรื่องต่อไปยังส่วนกลาง (อำเภอ) เรียบร้อยแล้ว!');
  };

  const handleCloseJob = () => {
    const newChats = chats.map(c => {
        if (c.id === selectedChatId) {
          return { ...c, status: 'closed', isEscalated: false };
        }
        return c;
      });
      setChats(newChats);
      saveChats(newChats);
  }

  return (
    <div className="card" style={{ height: '600px', display: 'flex', padding: 0, overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <div style={{ width: '300px', borderRight: '1px solid #444', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #444', background: '#222' }}>
          <h3 style={{ margin: 0 }}>📥 Inbox ({filteredChats.length})</h3>
          <div style={{ fontSize: '0.8rem', color: '#888' }}>
            {user.role === 'leader' ? 'เฉพาะลูกบ้านของคุณ' : 'รวมทุกหมู่บ้าน (Admin Mode)'}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredChats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChatId(chat.id)}
              style={{ 
                padding: '15px', 
                borderBottom: '1px solid #333', 
                cursor: 'pointer', 
                background: selectedChatId === chat.id ? '#333' : 'transparent',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold', color: chat.isEscalated ? '#FF4444' : 'white' }}>
                    {chat.isEscalated && <FaExclamationCircle style={{marginRight:'5px'}}/>}
                    {chat.userName}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>{chat.villageId}</div>
              </div>
              {chat.status === 'closed' && <FaCheckCircle color="#00C851" />}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1a1a1a' }}>
        {activeChat ? (
          <>
            <div style={{ padding: '15px', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0 }}>{activeChat.userName}</h3>
                {activeChat.isEscalated && <span style={{color:'#FF4444', fontSize:'0.8rem', fontWeight:'bold'}}>⚠️ ส่งเรื่องต่อมาที่อำเภอแล้ว</span>}
              </div>
              
              <div style={{display:'flex', gap:'10px'}}>
                 {user.role === 'leader' && !activeChat.isEscalated && activeChat.status !== 'closed' && (
                    <button onClick={handleEscalate} style={{ padding: '8px 15px', background: '#FF8800', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer', display:'flex', alignItems:'center', gap:'5px' }}>
                      <FaShareSquare /> ส่งต่ออำเภอ
                    </button>
                 )}
                 {activeChat.status !== 'closed' && (
                    <button onClick={handleCloseJob} style={{ padding: '8px 15px', background: '#00C851', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer', display:'flex', alignItems:'center', gap:'5px' }}>
                        <FaCheckCircle /> ปิดงาน
                    </button>
                 )}
              </div>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {activeChat.messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.sender === 'user' ? 'flex-start' : 'flex-end', maxWidth: '70%' }}>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '4px', textAlign: m.sender === 'user' ? 'left' : 'right' }}>
                    {m.sender === 'user' ? 'ลูกบ้าน' : 'เจ้าหน้าที่'}
                  </div>
                  <div style={{ 
                    background: m.sender === 'user' ? '#333' : 'var(--accent)', 
                    color: m.sender === 'user' ? 'white' : 'black',
                    padding: '10px 15px', borderRadius: '10px' 
                  }}>
                    {m.text}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '2px', textAlign: m.sender === 'user' ? 'left' : 'right' }}>{m.time}</div>
                </div>
              ))}
            </div>

            {activeChat.status !== 'closed' ? (
                <div style={{ padding: '20px', borderTop: '1px solid #444', display: 'flex', gap: '15px' }}>
                <input 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleReply()}
                    placeholder="ตอบกลับ..."
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: 'white' }} 
                />
                <button onClick={handleReply} style={{ padding: '12px 25px', background: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    ส่งข้อความ
                </button>
                </div>
            ) : (
                <div style={{padding:'20px', background:'#222', textAlign:'center', color:'#888'}}>
                    Job Closed
                </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#666' }}>
            เลือกรายการเพื่อเริ่มสนทนา
          </div>
        )}
      </div>
    </div>
  );
};