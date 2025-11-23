import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    port: 5173,
    allowedHosts: [
        '.ngrok-free.app', // อนุญาตทุกโดเมนของ ngrok
        'neriah-indirect-manie.ngrok-free.dev' // หรือระบุชื่อเดิมของคุณ
    ],
    proxy: {
      // 👇 พระเอกของเรา: บอก Vite ว่าถ้าเจอ /api ให้ส่งไป Node-RED
      '/api': {
        target: 'http://localhost:1880',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})