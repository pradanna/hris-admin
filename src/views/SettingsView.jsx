import React from 'react';

export default function SettingsView({ store, showToast }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title & Description Header */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Pengaturan Kantor (Geofencing)</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Tentukan titik koordinat presensi absensi tergeofence serta radius batas toleransi bagi karyawan lapangan.</p>
        </div>
        <div style={{ fontSize: '32px', color: 'var(--color-primary)' }}>
          <ion-icon name="location-outline"></ion-icon>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '32px', maxWidth: '500px' }}>
        <h3 className="chart-title" style={{ marginBottom: '24px', fontSize: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>Konfigurasi Koordinat & Radius</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Latitude Lokasi Kantor</label>
            <input 
              type="text" 
              className="form-input" 
              value={store.officeSettings.officeLatitude || store.officeSettings.latitude || ''} 
              onChange={(e) => store.updateSettings(parseFloat(e.target.value) || 0, store.officeSettings.officeLongitude || store.officeSettings.longitude || 0, store.officeSettings.officeRadius || store.officeSettings.radius || 0)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Longitude Lokasi Kantor</label>
            <input 
              type="text" 
              className="form-input" 
              value={store.officeSettings.officeLongitude || store.officeSettings.longitude || ''} 
              onChange={(e) => store.updateSettings(store.officeSettings.officeLatitude || store.officeSettings.latitude || 0, parseFloat(e.target.value) || 0, store.officeSettings.officeRadius || store.officeSettings.radius || 0)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Radius Toleransi Absen (Meter)</label>
            <input 
              type="number" 
              className="form-input" 
              value={store.officeSettings.officeRadius || store.officeSettings.radius || ''} 
              onChange={(e) => store.updateSettings(store.officeSettings.officeLatitude || store.officeSettings.latitude || 0, store.officeSettings.officeLongitude || store.officeSettings.longitude || 0, parseInt(e.target.value) || 0)} 
            />
          </div>
          <button className="btn-primary" style={{ marginTop: '12px', height: '40px', fontWeight: 700 }} onClick={() => showToast('Pengaturan Geofence berhasil disimpan ke Local Storage!')}>
            Simpan Konfigurasi
          </button>
        </div>
      </div>
    </div>
  );
}
