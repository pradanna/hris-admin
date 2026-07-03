import React from 'react';

export default function ActivityTable({ activities }) {
  return (
    <div className="glass-card" style={{ marginTop: '24px' }}>
      <div className="table-header-row" style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
        <h3 className="table-section-title">Riwayat Aktivitas Sistem</h3>
      </div>
      
      <table className="custom-table" style={{ margin: 0 }}>
        <thead>
          <tr>
            <th>Karyawan</th>
            <th>Aktivitas</th>
            <th>Waktu</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {activities.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: '24px' }}>Tidak ada riwayat aktivitas.</td>
            </tr>
          ) : (
            activities.map(act => (
              <tr key={act.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                  <div className="table-avatar-circle" style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                    {act.avatar || (act.employee ? act.employee.substring(0, 2).toUpperCase() : '')}
                  </div>
                  <span>{act.employee}</span>
                </td>
                <td>{act.action}</td>
                <td>{act.time}</td>
                <td>
                  <span className={`status-badge ${act.status === 'Berhasil' || act.status === 'Selesai' ? 'berhasil' : (act.status === 'Tercatat' ? 'neutral' : 'pending')}`}>
                    {act.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
