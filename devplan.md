# Development Plan (DevPlan)

Dokumen ini mendeskripsikan peta jalan (*roadmap*) pengembangan untuk mencapai visi AURA AI IDE yang otonom dan tangguh.

## Fase 1: Perbaikan Mesin & Smart Routing AI
- [ ] Menganalisis cara kerja pemanggilan API OpenRouter yang ada saat ini.
- [ ] Mengembangkan modul `ModelRouter` untuk secara otomatis mengecek tingkat trafik (`availability`) dari model-model gratis di OpenRouter setiap saat/setiap sesi.
- [ ] Mengembangkan logic pengurutan (sorting API) SumoPod berdasarkan parameter harga dan pengurutan prioritas.
- [ ] Mengintegrasikan perpindahan halus (fallback system/auto-switch) agar ketika satu model sibuk atau gagal, AI IDE langsung memakai model alternatif tanpa merusak *context* sebelumnya.

## Fase 2: Pembangkitan Terminal Terintegrasi AI (AI-Driven Terminal)
- [ ] Menambahkan *permission* eksplisit dan mekanisme koneksi antara jendela AI Chat React dengan modul eksekusi shell Tauri (`@tauri-apps/plugin-shell` atau `child_process` di NodeJS jika memakai backend lokal).
- [ ] Membangun antarmuka parser spesial di Prompt Chat. Jika AI me-*return* *tag* kode khusus (contoh: ```bash || run ```), IDE akan meminta verifikasi pengguna untuk menjalankan, atau dalam mode otonom langsung menjalankan skrip tersebut (`npm install`, dsb).
- [ ] Menciptakan *event listener* yang menyiarkan output terminal secara *streaming* kembali ke dalam tab *chat* untuk memonitor hasil atau *error*.

## Fase 3: Integrasi Browser Internal
- [ ] Merancang window internal preview (iframe atau komponen WebView Tauri) di UI layaknya *pane* IDE pada Cursor/Windsurf.
- [ ] Membuat auto-detect ketika log terminal mencetak "Local: http://localhost:3000/" sehingga sistem IDE otomatis memuat alamat tersebut ke dalam Internal Browser.
- [ ] Integrasi sinkronisasi penyegaran tab jika terjadi *Hot Module Replacement* (HMR).

## Fase 4: Eksekusi Kode Otonom & Agen Perencana (Planning Agent)
- [ ] Meningkatkan prompt dasar (System Prompt) di level IDE agar AI selalu menyertakan blok *planning*. IDE hanya melanjutkan implementasi langkah kedua jika *planning* tervalidasi.
- [ ] Mendukung aksi pembaruan beberapa file sekaligus (*multi-file patch/diff*).
- [ ] Loop otonom: `Plan` -> `Write Files` -> `Run terminal (NPM/Build)` -> `Review Error dari Eksekusi` -> `Auto Fix Kode` -> `Ulangi/Selesai`.
- [ ] Menyediakan infrastruktur "file-tree scaffold", jika pengguna meminta aplikasi web utuh, IDE mengekstrak arsip direktori yang dikembalikan oleh model AI langsung disave ke *disk* (`@tauri-apps/plugin-fs`).

## Fase 5: Pengujian Kualitas dan Skala Global
- [ ] *Burn-in testing* dengan banyak proyek kompleks.
- [ ] Memastikan hasil kode tetap bersih (*clean code pattern* diterapkan dan linter dipatuhi).
- [ ] Melakukan finalisasi tingkat keberhasilan interaksi UI 100%.
