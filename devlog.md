# Development Log (DevLog)

Log rekam jejak historis pengembangan fitur pada AURA AI IDE.

## [2026-03-24] - Fase 1, 2, 3, & 4 Completed
- **Smart Routing**: Berhasil mengimplementasikan auto-fallback OpenRouter & auto-budget SumoPod.
- **Autonomous Terminal**: Menambahkan pendeteksi error terminal (exit code != 0) yang memicu auto-fix otonom via AI Composer.
- **Internal Browser**: Implementasi Regex dinamis untuk menangkap port localhost dari stdout terminal.
- **Autonomous Agent (Fase 4)**: 
  - **Real-time Disk Sync**: Integrasi `@tauri-apps/plugin-fs` pada `onApplyCode`. File yang dibuat AI langsung tersimpan di disk asli secara otonom.
  - **Planning Phase**: AI sekarang diwajibkan melakukan *Planning Phase* sebelum memberikan kode, meningkatkan akurasi arsitektur.
  - **Multi-file Handling**: Mendukung pembuatan banyak file sekaligus (scaffolding) dan aksi penghapusan file (`delete`).
- **UX**: Shortcut `Ctrl+F12` ditambahkan untuk toggle browser preview.
- **Robustness**: Audit dependensi dan perbaikan TypeScript (`tsc --noEmit` clean).
- **Final Polish (Fase 5)**:
  - **Nested Explorer**: Sidebar kini mendukung struktur Folder Tree rekursif dengan ikon yang serasi.
  - **Aura Premium Design**: Implementasi Glassmorphism v2, Custom Gradients, dan Glow effects di seluruh UI.
  - **Global UX**: Scrollbar yang lebih halus, transisi animasi Framer Motion, dan tipografi JetBrains Mono.
  - **Version**: AURA AI IDE v5.4.0 (Stable Release).

**Status Kendala Saat Ini:**
- Kecepatan penulisan lambat dan tidak semua file pendukung otomatis dibuat.
- Terminal di sisi Chat Prompt belum bekerja menghubungkan fungsi riil sistem seperti `npm run` atau build.
- Browser internal (preview) terpisah dan belum otomatis merender hasil build server.

**Langkah Selanjutnya:**
- Memulai eksekusi skema dari Fase 1 DevPlan: Mengelola integrasi model OpenRouter (mencari titik *auto-switch* dan mendeteksi kondisi load CPU/trafik model gratis).
- Persiapan akses Shell di Tauri untuk Terminal Cerdas AI.
