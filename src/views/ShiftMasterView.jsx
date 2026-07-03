import React, { useState } from 'react';

export default function ShiftMasterView({ store, showToast }) {
  const [shifts, setShifts] = useState(store.shiftMaster || []);
  const [editingCode, setEditingCode] = useState(null);
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newStart, setNewStart] = useState('08:00');
  const [newEnd, setNewEnd] = useState('17:00');
  const [newBg, setNewBg] = useState('#e0f2fe');
  const [newColor, setNewColor] = useState('#0369a1');

  const handleEditClick = (shift) => {
    setEditingCode(shift.code);
    setEditStart(shift.start);
    setEditEnd(shift.end);
  };

  const handleSaveClick = (code) => {
    const updated = shifts.map(s => {
      if (s.code === code) {
        return { ...s, start: editStart, end: editEnd };
      }
      return s;
    });
    setShifts(updated);
    store.updateShiftMaster(updated);
    setEditingCode(null);
    showToast(`Jam kerja untuk Shift ${code} berhasil diperbarui.`);
  };

  const handleAddNewShift = () => {
    if (!newCode.trim()) {
      alert('Kode Shift tidak boleh kosong!');
      return;
    }
    if (newCode.length > 2) {
      alert('Kode Shift maksimal 2 karakter!');
      return;
    }
    if (!newName.trim()) {
      alert('Nama Shift tidak boleh kosong!');
      return;
    }
    const exists = shifts.some(s => s.code.toUpperCase() === newCode.toUpperCase());
    if (exists) {
      alert('Kode Shift ini sudah ada!');
      return;
    }

    const nextShift = {
      code: newCode.toUpperCase(),
      name: newName,
      start: newStart,
      end: newEnd,
      bg: newBg,
      color: newColor
    };

    const nextList = [...shifts, nextShift];
    setShifts(nextList);
    store.updateShiftMaster(nextList);
    setShowAddModal(false);
    // Reset fields
    setNewCode('');
    setNewName('');
    setNewStart('08:00');
    setNewEnd('17:00');
    showToast(`Shift Baru (${nextShift.code}) berhasil ditambahkan.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #0369a1 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            boxShadow: '0 4px 10px rgba(var(--color-primary-rgb), 0.2)'
          }}>
            <ion-icon name="time-outline" style={{ fontSize: '20px' }}></ion-icon>
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Jam Kerja & Master Shift</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Konfigurasi definisi kode shift kerja dan jam operasional untuk validasi presensi geofence
            </p>
          </div>
        </div>
        <button 
          className="btn-primary" 
          style={{ height: '38px', display: 'flex', alignItems: 'center', gap: '6px', width: 'auto', padding: '0 16px' }}
          onClick={() => setShowAddModal(true)}
        >
          <ion-icon name="add-circle-outline" style={{ fontSize: '18px' }}></ion-icon>
          <span>Tambah Shift Baru</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 className="chart-title" style={{ fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ion-icon name="options-outline" style={{ color: 'var(--color-primary)' }}></ion-icon>
          <span>Daftar Shift Karyawan</span>
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Kode</th>
                <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Nama Shift</th>
                <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Jam Masuk</th>
                <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Jam Pulang</th>
                <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map(shift => (
                <tr key={shift.code} style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: shift.code === 'L' ? '#fafafa' : 'transparent' }}>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      fontWeight: 800, padding: '4px 10px', borderRadius: '6px',
                      backgroundColor: shift.bg || '#f1f5f9', color: shift.color || '#475569', fontSize: '12px'
                    }}>
                      {shift.code}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>{shift.name}</td>
                  
                  {/* Jam Masuk */}
                  <td style={{ padding: '16px', fontSize: '13px' }}>
                    {editingCode === shift.code ? (
                      shift.code === 'L' ? '-' : (
                        <input type="time" className="form-input" value={editStart} onChange={e => setEditStart(e.target.value)} style={{ width: '100px', height: '32px', fontSize: '12px', padding: '0 8px' }} />
                      )
                    ) : (
                      <span style={{ fontWeight: 500, color: shift.code === 'L' ? 'var(--color-gray-400)' : 'var(--text-main)' }}>{shift.start}</span>
                    )}
                  </td>

                  {/* Jam Pulang */}
                  <td style={{ padding: '16px', fontSize: '13px' }}>
                    {editingCode === shift.code ? (
                      shift.code === 'L' ? '-' : (
                        <input type="time" className="form-input" value={editEnd} onChange={e => setEditEnd(e.target.value)} style={{ width: '100px', height: '32px', fontSize: '12px', padding: '0 8px' }} />
                      )
                    ) : (
                      <span style={{ fontWeight: 500, color: shift.code === 'L' ? 'var(--color-gray-400)' : 'var(--text-main)' }}>{shift.end}</span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    {shift.code === 'L' ? (
                      <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', fontStyle: 'italic' }}>Tidak dapat diubah</span>
                    ) : editingCode === shift.code ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="pending-btn reject" style={{ height: '28px', padding: '0 12px', margin: 0, fontSize: '11px' }} onClick={() => setEditingCode(null)}>Batal</button>
                        <button className="btn-primary" style={{ height: '28px', padding: '0 12px', margin: 0, fontSize: '11px', width: 'auto' }} onClick={() => handleSaveClick(shift.code)}>Simpan</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(shift)}
                        style={{
                          background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600,
                          fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        <ion-icon name="create-outline"></ion-icon>
                        <span>Ubah Jam</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Shift Baru */}
      {showAddModal && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ width: '500px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'white', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <h3 className="chart-title" style={{ margin: 0 }}>Tambah Shift Kerja Baru</h3>
              <ion-icon name="close-outline" onClick={() => setShowAddModal(false)} style={{ fontSize: '24px', cursor: 'pointer', color: 'var(--color-gray-400)' }}></ion-icon>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Kode Shift (Maks 2 Karakter)</label>
                <input type="text" className="form-input" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="Contoh: P2, S2, NS" maxLength={2} style={{ height: '36px', textTransform: 'uppercase' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px' }}>Nama Shift / Keterangan</label>
                <input type="text" className="form-input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Contoh: Pagi 2 (Mid-Day)" style={{ height: '36px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Jam Masuk</label>
                  <input type="time" className="form-input" value={newStart} onChange={e => setNewStart(e.target.value)} style={{ height: '36px' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Jam Pulang</label>
                  <input type="time" className="form-input" value={newEnd} onChange={e => setNewEnd(e.target.value)} style={{ height: '36px' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Warna Latar Tag (HEX)</label>
                  <select className="form-input" value={newBg} onChange={e => setNewBg(e.target.value)} style={{ height: '36px', fontSize: '12px' }}>
                    <option value="#e0f2fe">Biru Muda</option>
                    <option value="#f3e8ff">Ungu Muda</option>
                    <option value="#dcfce7">Hijau Muda</option>
                    <option value="#fee2e2">Merah Muda</option>
                    <option value="#fef3c7">Kuning Muda</option>
                    <option value="#f1f5f9">Abu-abu</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '11px' }}>Warna Teks Tag (HEX)</label>
                  <select className="form-input" value={newColor} onChange={e => setNewColor(e.target.value)} style={{ height: '36px', fontSize: '12px' }}>
                    <option value="#0369a1">Biru Gelap</option>
                    <option value="#7c3aed">Ungu Gelap</option>
                    <option value="#15803d">Hijau Gelap</option>
                    <option value="#dc2626">Merah Gelap</option>
                    <option value="#b45309">Kuning Gelap</option>
                    <option value="#475569">Abu-abu Gelap</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '8px' }}>
              <button className="pending-btn reject" onClick={() => setShowAddModal(false)} style={{ width: '100px', height: '38px', margin: 0 }}>Batal</button>
              <button className="btn-primary" onClick={handleAddNewShift} style={{ width: '140px', height: '38px', margin: 0 }}>Tambah Shift</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
