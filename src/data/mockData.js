// src/data/mockData.js

// --- ข้อมูลผู้ใช้ (Users) ---
export const USERS = [
  { username: 'user', password: '123', role: 'villager', name: 'นายสมชาย (ลูกบ้าน)', houseId: 'h_101_001', villageId: 'v_101' },
  { username: 'leader', password: '123', role: 'leader', name: 'ผู้ใหญ่บ้าน (หมู่ 1)', villageId: 'v_101' },
  { username: 'admin', password: '123', role: 'district', name: 'ท่านนายอำเภอ' },
  { username: 'god', password: '123', role: 'god', name: 'God Mode (System)' }
];

// --- ฟังก์ชันสุ่มสร้างบ้าน 10 หลัง ---
const generateHouses = (villageId) => {
  const houses = [];
  for (let i = 1; i <= 10; i++) {
    const id = `h_${villageId.split('_')[1]}_${String(i).padStart(3, '0')}`;
    const power = Math.floor(Math.random() * 1500); 
    const vibration = (Math.random() * 8).toFixed(1);
    let status = 'normal';
    
    if (power === 0) status = 'error';
    else if (vibration > 6) status = 'warning';

    houses.push({
      id: id,
      owner: `ลูกบ้าน ${i}`,
      power: power,
      vibration: vibration,
      status: status,
      rpm: status === 'error' ? 0 : Math.floor(Math.random() * 2000 + 1000),
      waterLevel: (Math.random() * 100).toFixed(1),
      temp: (Math.random() * 40 + 30).toFixed(1)
    });
  }
  return houses;
};

// --- สร้างหมู่บ้าน 10 แห่ง (ปรับพิกัดให้เกาะตามแนวแม่น้ำ) ---
export const VILLAGES = [
  // โซนต้นน้ำ (ซ้ายบน)
  { id: 'v_108', name: 'หมู่บ้านทาคิ', lat: 15, lng: 8, status: 'error' },      // ต้นกำเนิดแม่น้ำ
  { id: 'v_101', name: 'หมู่บ้านโคโนฮะ', lat: 22, lng: 22, status: 'normal' },  // ช่วงไหลลงมา (Yushu)
  
  // โซนกลางน้ำ (กลางภาพ - โค้งแม่น้ำ)
  { id: 'v_103', name: 'หมู่บ้านคิริ', lat: 42, lng: 35, status: 'error' },     // (Chengdu area)
  { id: 'v_106', name: 'หมู่บ้านโอโตะ', lat: 52, lng: 45, status: 'warning' },  // (Chongqing)
  { id: 'v_102', name: 'หมู่บ้านซึนะ', lat: 48, lng: 58, status: 'warning' },   // (Yichang)
  
  // โซนลุ่มน้ำสาขา (ด้านล่าง)
  { id: 'v_110', name: 'หมู่บ้านยูงะ', lat: 65, lng: 62, status: 'normal' },    // สาขาแยก (Zhangjiajie)
  { id: 'v_104', name: 'หมู่บ้านคุโมะ', lat: 72, lng: 75, status: 'normal' },   // สาขาล่าง (Changsha)

  // โซนปลายน้ำ (ขวา - ไหลออกทะเล)
  { id: 'v_107', name: 'หมู่บ้านอาเมะ', lat: 45, lng: 72, status: 'normal' },   // (Wuhan)
  { id: 'v_105', name: 'หมู่บ้านอิวะ', lat: 35, lng: 82, status: 'normal' },    // (Nanjing)
  { id: 'v_109', name: 'หมู่บ้านคุสะ', lat: 28, lng: 92, status: 'normal' }     // ปากแม่น้ำ (Shanghai)

].map(v => ({
  ...v,
  houses: generateHouses(v.id)
}));