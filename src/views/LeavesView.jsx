import React from 'react';

export default function LeavesView({
  store,
  leaveDateFrom,
  setLeaveDateFrom,
  leaveDateTo,
  setLeaveDateTo,
  leaveStatusFilter,
  setLeaveStatusFilter,
  activeLeaveSubTab,
  setActiveLeaveSubTab,
  currentPageLeave,
  setCurrentPageLeave,
  ITEMS_PER_PAGE,
  setActiveModal,
  setSelectedReqId
}) {
  const list = store.pendingRequests.filter(r => {
    let matchesTab = false;
    if (activeLeaveSubTab === 'cuti') {
      matchesTab = r.type === 'Cuti Tahunan' || r.type === 'Cuti';
    } else if (activeLeaveSubTab === 'izin') {
      matchesTab = r.type === 'Cuti Sakit' || r.type === 'Izin Resmi' || r.type === 'Izin' || r.type === 'Izin Khusus';
    } else if (activeLeaveSubTab === 'lembur') {
      matchesTab = r.type === 'Lembur';
    } else if (activeLeaveSubTab === 'tugas') {
      matchesTab = r.type === 'Tugas Keluar' || r.type === 'Dinas Luar';
    } else if (activeLeaveSubTab === 'swap') {
      matchesTab = r.type === 'Tukar Shift';
    }

    const matchesStatus = r.status === leaveStatusFilter;

    let matchesDate = true;
    if (r.requestDate) {
      matchesDate = r.requestDate >= leaveDateFrom && r.requestDate <= leaveDateTo;
    }

    return matchesTab && matchesStatus && matchesDate;
  });

  const totalPagesLeave = Math.ceil(list.length / ITEMS_PER_PAGE);
  const paginatedLeaves = list.slice(
    (currentPageLeave - 1) * ITEMS_PER_PAGE,
    currentPageLeave * ITEMS_PER_PAGE
  );

  const tabBtnStyle = (key) => ({
    padding: '8px 18px', margin: 0, background: 'none', border: 'none',
    borderBottom: `3px solid ${activeLeaveSubTab === key ? 'var(--color-primary)' : 'transparent'}`,
    color: activeLeaveSubTab === key ? 'var(--color-primary)' : 'var(--color-gray-500)',
    fontWeight: 700, fontSize: '13px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '6px',
  });

  const getTabCount = (key) => {
    return store.pendingRequests.filter(r => {
      const matchesStatus = r.status === leaveStatusFilter;
      let matchesTab = false;
      if (key === 'cuti') matchesTab = r.type === 'Cuti Tahunan' || r.type === 'Cuti';
      else if (key === 'izin') matchesTab = r.type === 'Cuti Sakit' || r.type === 'Izin Resmi' || r.type === 'Izin' || r.type === 'Izin Khusus';
      else if (key === 'lembur') matchesTab = r.type === 'Lembur';
      else if (key === 'tugas') matchesTab = r.type === 'Tugas Keluar' || r.type === 'Dinas Luar';
      else if (key === 'swap') matchesTab = r.type === 'Tukar Shift';
      
      let matchesDate = true;
      if (r.requestDate) {
        matchesDate = r.requestDate >= leaveDateFrom && r.requestDate <= leaveDateTo;
      }
      return matchesTab && matchesStatus && matchesDate;
    }).length;
  };

  return (
    <div className="glass-card">
      {/* Header */}
      <div className="table-header-row" style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <div>
          <h3 className="table-section-title" style={{ margin: 0 }}>Kelola Pengajuan Karyawan</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Review dan persetujuan permohonan cuti, izin, lembur, serta tugas dinas luar</span>
        </div>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Date Range Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-gray-50)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '6px 10px' }}>
            <ion-icon name="calendar-outline" style={{ fontSize: '14px', color: 'var(--color-primary)' }}></ion-icon>
            <input
              type="date"
              value={leaveDateFrom}
              onChange={(e) => { setLeaveDateFrom(e.target.value); setCurrentPageLeave(1); }}
              style={{ border: 'none', background: 'transparent', fontSize: '12px', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>s/d</span>
            <input
              type="date"
              value={leaveDateTo}
              onChange={(e) => { setLeaveDateTo(e.target.value); setCurrentPageLeave(1); }}
              style={{ border: 'none', background: 'transparent', fontSize: '12px', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status:</span>
            <select
              value={leaveStatusFilter}
              onChange={(e) => { setLeaveStatusFilter(e.target.value); setCurrentPageLeave(1); }}
              className="filter-select"
              style={{ fontSize: '12px', padding: '6px 10px', height: '34px' }}
            >
              <option value="Pending">Menunggu Persetujuan</option>
              <option value="Approved">Disetujui</option>
              <option value="Rejected">Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid var(--color-border)', padding: '0 24px' }}>
        {[
          { key: 'cuti', label: 'Cuti', icon: 'calendar-outline' },
          { key: 'izin', label: 'Izin', icon: 'document-text-outline' },
          { key: 'lembur', label: 'Lembur', icon: 'time-outline' },
          { key: 'tugas', label: 'Tugas Keluar', icon: 'airplane-outline' },
          { key: 'swap', label: 'Tukar Shift', icon: 'sync-outline' },
        ].map(tab => (
          <button 
            key={tab.key} 
            style={tabBtnStyle(tab.key)} 
            onClick={() => { setActiveLeaveSubTab(tab.key); setCurrentPageLeave(1); }}
          >
            <ion-icon name={tab.icon} style={{ fontSize: '15px' }}></ion-icon>
            <span>{tab.label}</span>
            <span style={{ 
              backgroundColor: activeLeaveSubTab === tab.key ? 'var(--color-primary)' : 'var(--color-gray-100)', 
              color: activeLeaveSubTab === tab.key ? 'white' : 'var(--color-gray-600)', 
              fontSize: '10px', 
              padding: '2px 6px', 
              borderRadius: '9999px', 
              fontWeight: 'bold' 
            }}>
              {getTabCount(tab.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Nama Karyawan</th>
              <th>Tipe Pengajuan</th>
              <th>Durasi / Tanggal</th>
              <th>Keterangan / Alasan</th>
              <th>Waktu Pengajuan</th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeaves.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: '40px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <ion-icon name="checkmark-done-circle-outline" style={{ fontSize: '36px', color: '#10B981', opacity: 0.7 }}></ion-icon>
                    <span>Tidak ada pengajuan dengan status {leaveStatusFilter === 'Pending' ? 'Menunggu Persetujuan' : leaveStatusFilter === 'Approved' ? 'Disetujui' : 'Ditolak'} pada kategori ini.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedLeaves.map(req => (
                <tr key={req.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{req.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{req.role}</div>
                  </td>
                  <td>
                    <span className={`pending-tag ${req.tagClass || 'leave'}`} style={{ fontWeight: 700, textTransform: 'capitalize' }}>
                      {req.type}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {req.duration || '-'}
                  </td>
                  <td style={{ maxWidth: '300px', fontSize: '12px', lineHeight: 1.4 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span>{req.reason}</span>
                      {req.attachment && (
                        <button 
                          onClick={() => { setSelectedReqId(req.id); setActiveModal('leave_detail'); }} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px', 
                            color: 'var(--color-primary)', 
                            background: 'none', 
                            border: 'none', 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            cursor: 'pointer', 
                            padding: 0,
                            width: 'fit-content'
                          }}
                        >
                          <ion-icon name="paperclip-outline" style={{ fontSize: '12px' }}></ion-icon>
                          Lihat Lampiran Berkas
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{req.time}</td>
                  <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                    {req.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          className="pending-btn approve" 
                          onClick={() => { setSelectedReqId(req.id); setActiveModal('leave_detail'); }}
                          style={{ padding: '6px 16px', fontSize: '12px', width: 'auto', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '6px', fontWeight: 600 }}
                        >
                          Detail
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: '11px', 
                          padding: '4px 10px', 
                          borderRadius: '9999px', 
                          fontWeight: 700,
                          backgroundColor: req.status === 'Approved' ? '#ECFDF5' : '#FEF2F2',
                          color: req.status === 'Approved' ? '#10B981' : '#DC2626',
                          border: `1px solid ${req.status === 'Approved' ? '#A7F3D0' : '#FECACA'}`
                        }}>
                          {req.status === 'Approved' ? 'Disetujui' : 'Ditolak'}
                        </span>
                        <button 
                          onClick={() => { setSelectedReqId(req.id); setActiveModal('leave_detail'); }}
                          style={{ 
                            padding: '4px 8px', 
                            fontSize: '11px', 
                            backgroundColor: 'white', 
                            border: '1px solid var(--color-border)', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          Detail
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPagesLeave > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Menampilkan {((currentPageLeave - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPageLeave * ITEMS_PER_PAGE, list.length)} dari {list.length} Pengajuan</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="pending-btn reject" 
              onClick={() => setCurrentPageLeave(prev => Math.max(prev - 1, 1))} 
              disabled={currentPageLeave === 1}
              style={{ height: '32px', padding: '0 12px', margin: 0, opacity: currentPageLeave === 1 ? 0.5 : 1, cursor: currentPageLeave === 1 ? 'not-allowed' : 'pointer' }}
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPagesLeave }, (_, i) => i + 1).map(page => (
              <button 
                key={page} 
                onClick={() => setCurrentPageLeave(page)} 
                style={{ height: '32px', width: '32px', margin: 0, borderRadius: '6px', border: '1px solid var(--color-border)', background: currentPageLeave === page ? 'var(--color-primary)' : 'white', color: currentPageLeave === page ? 'white' : 'var(--color-gray-600)', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
              >
                {page}
              </button>
            ))}
            <button 
              className="pending-btn reject" 
              onClick={() => setCurrentPageLeave(prev => Math.min(prev + 1, totalPagesLeave))} 
              disabled={currentPageLeave === totalPagesLeave}
              style={{ height: '32px', padding: '0 12px', margin: 0, opacity: currentPageLeave === totalPagesLeave ? 0.5 : 1, cursor: currentPageLeave === totalPagesLeave ? 'not-allowed' : 'pointer' }}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
