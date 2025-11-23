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
    const power = Math.floor(Math.random() * 1500); // สุ่มไฟ 0-1500W
    const vibration = (Math.random() * 8).toFixed(1); // สุ่มสั่น 0-8
    let status = 'normal';
    
    if (power === 0) status = 'error';
    else if (vibration > 6) status = 'warning';

    houses.push({
      id: id,
      owner: `ลูกบ้าน ${i}`,
      power: power,
      vibration: vibration,
      status: status,
      rpm: status === 'error' ? 0 : Math.floor(Math.random() * 2000 + 1000), // รอบหมุน
      waterLevel: (Math.random() * 100).toFixed(1), // ระดับน้ำ
      temp: (Math.random() * 40 + 30).toFixed(1) // อุณหภูมิ
    });
  }
  return houses;
};

// --- สร้างหมู่บ้าน 10 แห่ง ---
export const VILLAGES = [
  { id: 'v_101', name: 'หมู่บ้านโคโนฮะ', lat: 20, lng: 30, status: 'normal' },
  { id: 'v_102', name: 'หมู่บ้านซึนะ', lat: 60, lng: 70, status: 'warning' },
  { id: 'v_103', name: 'หมู่บ้านคิริ', lat: 40, lng: 20, status: 'error' },
  { id: 'v_104', name: 'หมู่บ้านคุโมะ', lat: 80, lng: 40, status: 'normal' },
  { id: 'v_105', name: 'หมู่บ้านอิวะ', lat: 30, lng: 80, status: 'normal' },
  { id: 'v_106', name: 'หมู่บ้านโอโตะ', lat: 50, lng: 50, status: 'warning' },
  { id: 'v_107', name: 'หมู่บ้านอาเมะ', lat: 10, lng: 60, status: 'normal' },
  { id: 'v_108', name: 'หมู่บ้านทาคิ', lat: 70, lng: 10, status: 'error' },
  { id: 'v_109', name: 'หมู่บ้านคุสะ', lat: 25, lng: 90, status: 'normal' },
  { id: 'v_110', name: 'หมู่บ้านยูงะ', lat: 85, lng: 85, status: 'normal' }
].map(v => ({
  ...v,
  houses: generateHouses(v.id) // ยัดบ้าน 10 หลังใส่เข้าไป
}));