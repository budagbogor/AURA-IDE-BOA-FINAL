# 🌌 Aura AI IDE - Next-Generation AI Powered IDE

<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" width="100%" alt="Aura IDE Banner" />
  <p><i>"Write software at the speed of thought with the power of dual-engine AI."</i></p>
</div>

---

## 🌟 Tentang Aura AI IDE

**Aura AI IDE** adalah lingkungan pengembangan terpadu (IDE) modern yang dirancang untuk pengembang masa depan. Menggabungkan estetika premium bergaya *AntiGravity* dengan integrasi AI yang mendalam, Aura memungkinkan Anda untuk membangun aplikasi web, desktop, dan mobile dalam satu alur kerja yang sangat mulus.

IDE ini bukan sekadar editor kode; ini adalah **ekosistem pengembangan lengkap** yang mendukung manajemen file lokal, sinkronisasi GitHub real-time, dan sistem rilis otomatis (CI/CD) mandiri.
- 🚀 **Real Terminal Bridge**: Eksekusi perintah asli (`npm`, `git`, `python`, dll) langsung dari IDE (Eksklusif Windows Installer).
- 🛠️ **Multi-Model AI Selection**: Pilih model AI favorit Anda (Gemini 2.0, Claude 4.5, dll) via SumoPod.

---

## 🚀 Keunggulan Utama

### 🧠 Dual-Engine AI Intelligence
*   **Multi-Provider AI:** Dukungan penuh untuk Google Gemini 2.0 (Flash & Pro), OpenRouter (Claude 3.5 Sonnet, GPT-4o), Bytez, dan **SumoPod AI**.
*   **Context7 Mode:** AI dapat memahami seluruh konteks proyek Anda, bukan hanya file yang sedang dibuka.
*   **AI Skills System:** Gunakan perintah cepat `/explain`, `/refactor`, dan `/fix` untuk efisiensi maksimal.

### 🛠️ Professional Build & Release Pipeline
*   **Official GitHub Releases:** Cukup berikan tag versi (misal: `v1.0.0`) pada commit Anda, dan sistem akan otomatis membangun (build) installer Windows (.exe) dan Android (.apk) secara resmi.
*   **Cloud Build via GitHub Actions:** Tidak perlu menginstal Rust, Java, atau Android Studio secara lokal. Semua proses build berjalan di cloud.
*   **Vercel Integration:** Deploy otomatis versi web setiap kali Anda melakukan push ke branch main.

### 💎 Premium User Experience (UX)
*   **Modern Interface:** Desain *glassmorphism* dengan animasi halus dan transparansi yang elegan.
*   **Flexible Layouts:** Pilih antara mode Klasik, Modern (Sidebar Kanan), atau **Zen Mode** untuk fokus tanpa gangguan.
*   **Command Palette:** Pusat perintah cepat (Ctrl+Shift+P) untuk mengontrol seluruh fitur IDE dengan keyboard.

### 🔗 Deep Integration
*   **GitHub Native:** Clone, Commit, dan Push langsung dari sidebar tanpa terminal.
*   **Supabase Support:** Integrasi database backend langsung dalam satu klik.
*   **MCP Protocol:** Dukungan Model Context Protocol untuk memperluas kemampuan AI.

---

## 🛠️ Tech Stack

*   **Core:** React.js, TypeScript, Vite
*   **Editor:** Monaco Editor (Engine VS Code)
*   **Desktop:** Tauri (Rust-based, Lightweight & Fast)
*   **Mobile:** Ionic Capacitor (Android Native Integration)
*   **Styling:** Tailwind CSS, Framer Motion
*   **Icons:** Lucide React

---

## 📖 Cara Menggunakan

### Instalasi Lokal (Development)
1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/budagbogor/auraide.git
   ```
2. **Instal dependensi:**
   ```bash
   npm install
   ```
3. **Konfigurasi API Key:**
   Edit file `.env.local` atau masukkan key langsung melalui menu **Settings** di dalam IDE. Mendukung provider:
*   Google Gemini (Native)
*   OpenRouter (Aggregator)
*   Bytez (Enterprise)
*   **SumoPod** (Latest 2026 Models: Gemini 2.5, Claude 4.5, GPT-5)
4. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```

### Alur Kerja Rilis Profesional (CI/CD)
Aura IDE dilengkapi dengan sistem rilis otomatis yang sangat mudah:
1. Pastikan kode Anda sudah stabil di branch `main`.
2. Buat tag versi: `git tag v1.0.0`.
3. Push tag ke GitHub: `git push origin v1.0.0`.
4. Buka tab **Releases** di repositori GitHub Anda untuk mendownload installer Windows dan APK Android yang sudah jadi.

---

## 📅 Roadmap & Pengembangan

Aura IDE terus dikembangkan untuk menjadi standar baru dalam AI-First Development.
*   [x] Integrasi Gemini 2.0 & OpenRouter
*   [x] Sistem Rilis Otomatis (APK & EXE)
*   [x] Cloud Build via GitHub Actions
*   [ ] Dukungan Plugin/Extension Ecosystem
*   [ ] Multi-user Real-time Collaboration

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **Apache-2.0 License - Aura AI Group**.

---

<div align="center">
  <p>Dibuat dengan ❤️ oleh <b>AURA AI Group</b> untuk komunitas pengembang dunia.</p>
</div>
