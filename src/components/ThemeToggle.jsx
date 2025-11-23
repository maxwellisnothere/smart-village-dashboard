import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <div 
      onClick={toggleTheme}
      style={{
        position: 'relative',
        width: '64px',
        height: '32px',
        background: 'var(--bg-input)', // สีพื้นหลังของปุ่ม
        border: '1px solid var(--border)',
        borderRadius: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 6px',
        transition: 'all 0.3s ease',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' // เงาด้านในให้ดูลึก
      }}
    >
      {/* พื้นหลังไอคอน (Sun/Moon) */}
      <FaSun size={14} color="#FDB813" style={{ zIndex: 1 }} />
      <FaMoon size={14} color="#FEFCD7" style={{ zIndex: 1 }} />

      {/* ลูกบอลวงกลมที่เลื่อนไปมา */}
      <div 
        style={{
          position: 'absolute',
          top: '3px',
          left: '3px',
          width: '24px',
          height: '24px',
          background: 'var(--accent)', // สีลูกบอล (เหลืองทอง)
          borderRadius: '50%',
          transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
          transform: theme === 'dark' ? 'translateX(32px)' : 'translateX(0)', // สั่งให้เลื่อน
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          zIndex: 0
        }}
      />
    </div>
  );
};

export default ThemeToggle;