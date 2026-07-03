import React, { useState, useRef } from 'react';

export default function BroadcastView({ store, showToast }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Informasi');
  const [target, setTarget] = useState('Semua Divisi');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 2MB!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Judul dan Isi Pengumuman wajib diisi!');
      return;
    }
    store.sendBroadcast(title, target, content, category, image);
    setTitle('');
    setContent('');
    setImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('Pengumuman broadcast berhasil dikirim ke portal ESS karyawan!');
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'Penting':
        return 'status-badge batal'; // Red/Orange style
      case 'Himbauan':
        return 'status-badge neutral'; // Gray/Yellow style
      default:
        return 'status-badge berhasil'; // Green/Teal style
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header Section */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Broadcast Pesan & Pengumuman</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Kirim informasi resmi, himbauan, atau pengumuman penting secara instan ke portal aplikasi ESS seluruh karyawan.</p>
        </div>
        <div style={{ fontSize: '32px', color: 'var(--color-primary)' }}>
          <ion-icon name="megaphone-outline"></ion-icon>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '24px' }}>
        
        {/* Sisi Kiri: Form Buat Pengumuman Baru */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 className="chart-title" style={{ fontSize: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ion-icon name="add-circle-outline" style={{ color: 'var(--color-primary)', fontSize: '18px' }}></ion-icon>
            <span>Buat Broadcast Baru</span>
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Judul Pengumuman</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Contoh: Jadwal Libur Lebaran 2026" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select 
                  className="form-input" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ height: '40px' }}
                >
                  <option value="Penting">⚠️ Penting</option>
                  <option value="Informasi">📢 Informasi</option>
                  <option value="Himbauan">💡 Himbauan</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Divisi</label>
                <select 
                  className="form-input" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  style={{ height: '40px' }}
                >
                  <option value="Semua Divisi">Semua Divisi</option>
                  <option value="Operasional Toko">Operasional Toko</option>
                  <option value="Gudang & Logistik">Gudang & Logistik</option>
                  <option value="Kasir & Keuangan">Kasir & Keuangan</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                </select>
              </div>
            </div>

            {/* Input Upload Gambar */}
            <div className="form-group">
              <label className="form-label">Lampiran Flyer / Gambar (Opsional)</label>
              <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              
              {!image ? (
                <div 
                  onClick={() => fileInputRef.current.click()}
                  style={{ 
                    border: '2px dashed var(--color-border)', 
                    borderRadius: '8px', 
                    padding: '16px', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    color: 'var(--color-gray-500)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--color-gray-50)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <ion-icon name="image-outline" style={{ fontSize: '24px' }}></ion-icon>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>Klik untuk Unggah Gambar (Maks 2MB)</span>
                </div>
              ) : (
                <div style={{ position: 'relative', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden', height: '120px' }}>
                  <img 
                    src={image} 
                    alt="Pratinjau Pengumuman" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <button 
                    type="button" 
                    onClick={removeImage}
                    style={{ 
                      position: 'absolute', 
                      top: '6px', 
                      right: '6px', 
                      backgroundColor: 'rgba(220, 38, 38, 0.85)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '50%', 
                      width: '24px', 
                      height: '24px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}
                    title="Hapus Gambar"
                  >
                    <ion-icon name="trash-outline"></ion-icon>
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Isi Pengumuman / Pesan</label>
              <textarea 
                className="form-input" 
                placeholder="Tuliskan detail pengumuman secara lengkap di sini..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ height: '120px', resize: 'none', padding: '10px 12px' }}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 700, marginTop: '8px' }}
            >
              <ion-icon name="send-outline"></ion-icon>
              <span>Kirim Broadcast</span>
            </button>
          </form>
        </div>

        {/* Sisi Kanan: Daftar Broadcast Terkirim */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 className="chart-title" style={{ fontSize: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ion-icon name="time-outline" style={{ color: 'var(--color-primary)', fontSize: '18px' }}></ion-icon>
            <span>Histori Siaran Terkirim</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '470px', overflowY: 'auto', paddingRight: '4px' }}>
            {store.broadcasts && store.broadcasts.length > 0 ? (
              store.broadcasts.map(brd => (
                <div 
                  key={brd.id} 
                  style={{ 
                    border: '1px solid var(--color-border)', 
                    borderRadius: '12px', 
                    padding: '16px', 
                    backgroundColor: brd.category === 'Penting' ? '#FFFBEB' : '#FAF5FF', 
                    borderLeft: `5px solid ${brd.category === 'Penting' ? '#D97706' : '#8B5CF6'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>{brd.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span className={getCategoryBadgeClass(brd.category)} style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '10px' }}>
                          {brd.category}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          Penerima: <strong>{brd.target}</strong>
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>{brd.date}</span>
                  </div>

                  {brd.image && (
                    <div style={{ width: '100%', maxHeight: '160px', overflow: 'hidden', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', margin: '4px 0' }}>
                      <img 
                        src={brd.image} 
                        alt="Flyer Lampiran" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <p style={{ fontSize: '12px', color: 'var(--text-main)', margin: '4px 0 0 0', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                    {brd.content}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '6px', marginTop: '4px', fontSize: '10px', color: 'var(--color-gray-400)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Oleh: {brd.sender}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontWeight: 600 }}>
                      <ion-icon name="checkmark-done-outline"></ion-icon>
                      <span>Aktif di Portal ESS</span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontStyle: 'italic', color: 'var(--color-gray-400)', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>Belum ada pesan siaran yang dikirim.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
