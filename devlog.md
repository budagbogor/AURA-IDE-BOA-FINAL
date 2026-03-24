# Development Log (DevLog)

Log rekam jejak historis pengembangan fitur pada AURA AI IDE.

## [2026-03-24] - Inisiasi Otonomi IDE AI
**Aktivitas & Perubahan:**
- Membuat dan menyepakati struktur pedoman proyek: `prd.md`, `devplan.md`, dan `devlog.md`.
- Melakukan tinjauan terhadap repositori yang ada. Proyek ini dibangun memakai **React 19**, **Vite**, **Tailwind CSS 4**, dan **Tauri v2**.
- Modul-modul layanan dasar seperti koneksi AI, *cloud integration* (Supabase), dan integrasi API sudah berjalan. Fitur kunci untuk mengelola *API Key* telah selesai.
- Fokus diidentifikasi: Integrasi penuh pada *Command Terminal*, *Internal Browser Component*, dan *Smart Model Routing* (OpenRouter/SumoPod).

**Status Kendala Saat Ini:**
- Kecepatan penulisan lambat dan tidak semua file pendukung otomatis dibuat.
- Terminal di sisi Chat Prompt belum bekerja menghubungkan fungsi riil sistem seperti `npm run` atau build.
- Browser internal (preview) terpisah dan belum otomatis merender hasil build server.

**Langkah Selanjutnya:**
- Memulai eksekusi skema dari Fase 1 DevPlan: Mengelola integrasi model OpenRouter (mencari titik *auto-switch* dan mendeteksi kondisi load CPU/trafik model gratis).
- Persiapan akses Shell di Tauri untuk Terminal Cerdas AI.
