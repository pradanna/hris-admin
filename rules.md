# HRIS Frontend Architecture Rules

## 1. Modular View Structure
- **No Monolithic Components**: Dilarang menulis fungsi render halaman tab secara langsung di dalam [App.jsx](file:///c:/PROJECT/WEBSITE/demo/hris/admin/src/App.jsx).
- **Separation of Concerns**: Setiap tab utama harus dipisahkan ke dalam file tersendiri di dalam direktori `src/views/` (misalnya [DashboardView.jsx](file:///c:/PROJECT/WEBSITE/demo/hris/admin/src/views/DashboardView.jsx)).
- **Sub-components**: Komponen tabel, card kecil, atau dropdown yang dapat digunakan kembali harus diletakkan di `src/components/`.

## 2. Component Design Principles
- Gunakan React hook & state lokal dalam view jika state tersebut tidak perlu dibagikan secara global ke view lain.
- Hubungkan data global atau aksi mutasi state via context / custom hook [useStore](file:///c:/PROJECT/WEBSITE/demo/hris/admin/src/hooks/useStore.js).
- Gunakan style CSS yang bersih melalui variabel token (`var(--color-primary)`, dsb) untuk menjaga konsistensi UI.
- Semua view modular harus memiliki prop-types atau komentar deskripsi parameter masukan yang memadai.
