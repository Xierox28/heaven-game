# 🚀 Heaven Game — Vercel Deploy Guide

> **TL;DR สำหรับคนรีบ**: Push โค้ดขึ้น GitHub → เข้า vercel.com → Import Repo → Deploy เสร็จ!

---

## ขั้นตอนที่ 1 — เตรียม GitHub Repository

เปิด Terminal ใน VS Code แล้วรันคำสั่งด้านล่างทีละบรรทัด:

```powershell
# ตรวจสอบว่า Git ติดตั้งอยู่
git --version

# Initialize Git (ถ้ายังไม่เคยทำ)
git init

# เพิ่มไฟล์ทั้งหมด
git add .

# Commit ครั้งแรก
git commit -m "🐹 Initial commit: Heaven Hamster Game v2"
```

จากนั้นไปที่ [github.com/new](https://github.com/new) สร้าง Repository ใหม่ชื่อ `heaven-game` แล้วรัน:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/heaven-game.git
git branch -M main
git push -u origin main
```

---

## ขั้นตอนที่ 2 — Deploy บน Vercel

1. ไปที่ **[vercel.com](https://vercel.com)** และล็อกอินด้วย GitHub
2. กดปุ่ม **"Add New Project"**
3. เลือก Repository **`heaven-game`** แล้วกด **Import**
4. ตรวจสอบการตั้งค่า (Vercel ตรวจจับ Vite อัตโนมัติ):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. กด **"Deploy"** รอประมาณ 30-60 วินาที

**เสร็จแล้ว!** 🎉 Vercel จะให้ URL เช่น `https://heaven-game-xxx.vercel.app`

---

## ขั้นตอนที่ 3 — ตั้งค่า Firebase (Optional แต่แนะนำ)

เมื่อพร้อมใช้ Firebase Realtime DB แบบจริง:

### 3.1 สร้าง Firebase Project
1. ไปที่ [console.firebase.google.com](https://console.firebase.google.com)
2. กด **Add project** → ตั้งชื่อ → สร้าง
3. ไปที่ **Build > Realtime Database** → **Create Database** → เลือก Location ใกล้ที่สุด

### 3.2 ตั้ง Security Rules
ไปที่ **Rules** tab แล้วตั้งค่า:
```json
{
  "rules": {
    "heaven_game": {
      ".read": true,
      ".write": true
    }
  }
}
```

### 3.3 เพิ่ม Firebase Keys ใน Vercel
ไปที่ **Vercel Dashboard > Project > Settings > Environment Variables** แล้วเพิ่ม:

| Key | Value |
|-----|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_DATABASE_URL` | `https://your-project-default-rtdb.firebaseio.com` |
| `VITE_FIREBASE_PROJECT_ID` | `your-project` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `1234567890` |
| `VITE_FIREBASE_APP_ID` | `1:1234567890:web:...` |

จากนั้น **Redeploy** โปรเจกต์ใหม่อีกครั้ง

---

## URL ที่สำคัญหลัง Deploy

| หน้า | URL |
|------|-----|
| หน้าผู้เล่น | `https://your-url.vercel.app/` |
| หน้า GM Admin | `https://your-url.vercel.app/admin` |

> **รหัสผ่าน Admin เริ่มต้น**: `1234`

---

## อัปเดตโค้ดในอนาคต

เมื่อแก้ไขโค้ดแล้วต้องการ Deploy ใหม่ เพียงแค่:
```powershell
git add .
git commit -m "✨ Update: ..."
git push
```
Vercel จะ Auto-deploy ให้ทันทีโดยอัตโนมัติ! 🚀
