import React from 'react';

export default function AttendanceView({
  store,
  attDateFrom,
  setAttDateFrom,
  attDateTo,
  setAttDateTo,
  attDivisionFilter,
  setAttDivisionFilter,
  attStatusFilter,
  setAttStatusFilter,
  activeAttSubTab,
  setActiveAttSubTab,
  attRekapMonth,
  setAttRekapMonth,
  currentPageAtt,
  setCurrentPageAtt,
  ITEMS_PER_PAGE,
  showToast
}) {
  const activeEmployees = store.employees.filter(e => e.employeeStatus === 'Aktif' || !e.employeeStatus);
  const LATE_THRESHOLD = 8 * 60 + 30; // 08:30
  const EARLY_LEAVE_THRESHOLD = 17 * 60; // 17:00

  const ALL_MOCK_LOG = [
    { empIdx: 0,  date: '2026-07-01', clockIn: '08:12', clockOut: '17:05', gps: 'Dalam Radius', note: '' },
    { empIdx: 1,  date: '2026-07-01', clockIn: null,    clockOut: null,    gps: '-',           note: 'Cuti Sakit' },
    { empIdx: 2,  date: '2026-07-01', clockIn: '08:55', clockOut: '17:30', gps: 'Dalam Radius', note: '' },
    { empIdx: 3,  date: '2026-07-01', clockIn: '07:58', clockOut: '16:45', gps: 'Dalam Radius', note: '' },
    { empIdx: 4,  date: '2026-07-01', clockIn: '09:20', clockOut: '17:45', gps: 'Luar Radius',  note: 'Absen dari titik pengiriman barang' },
    { empIdx: 5,  date: '2026-07-01', clockIn: '08:05', clockOut: '17:10', gps: 'Dalam Radius', note: '' },
    { empIdx: 6,  date: '2026-07-01', clockIn: '08:22', clockOut: '17:00', gps: 'Dalam Radius', note: '' },
    { empIdx: 7,  date: '2026-07-01', clockIn: '08:45', clockOut: '17:30', gps: 'Dalam Radius', note: '' },
    { empIdx: 8,  date: '2026-07-01', clockIn: null,    clockOut: null,    gps: '-',           note: 'Alpha' },
    { empIdx: 9,  date: '2026-07-01', clockIn: '08:10', clockOut: '17:00', gps: 'Dalam Radius', note: '' },
    { empIdx: 0,  date: '2026-07-02', clockIn: '08:00', clockOut: '17:01', gps: 'Dalam Radius', note: '' },
    { empIdx: 1,  date: '2026-07-02', clockIn: null,    clockOut: null,    gps: '-',           note: 'Cuti Sakit' },
    { empIdx: 2,  date: '2026-07-02', clockIn: '08:28', clockOut: '17:20', gps: 'Dalam Radius', note: '' },
    { empIdx: 3,  date: '2026-07-02', clockIn: '10:15', clockOut: '17:00', gps: 'Luar Radius',  note: 'Kunjungan supplier - diluar kantor' },
    { empIdx: 4,  date: '2026-07-02', clockIn: '08:02', clockOut: '17:00', gps: 'Dalam Radius', note: '' },
    { empIdx: 5,  date: '2026-07-02', clockIn: '08:40', clockOut: '16:50', gps: 'Dalam Radius', note: '' },
    { empIdx: 6,  date: '2026-07-02', clockIn: '08:10', clockOut: '17:00', gps: 'Dalam Radius', note: '' },
    { empIdx: 7,  date: '2026-07-02', clockIn: '08:25', clockOut: '17:05', gps: 'Dalam Radius', note: '' },
    { empIdx: 8,  date: '2026-07-02', clockIn: '08:55', clockOut: '17:30', gps: 'Dalam Radius', note: '' },
    { empIdx: 9,  date: '2026-07-02', clockIn: '08:15', clockOut: '17:00', gps: 'Dalam Radius', note: '' },
    { empIdx: 0,  date: '2026-07-03', clockIn: '08:05', clockOut: null,    gps: 'Dalam Radius', note: '' },
    { empIdx: 1,  date: '2026-07-03', clockIn: null,    clockOut: null,    gps: '-',           note: 'Cuti Sakit' },
    { empIdx: 2,  date: '2026-07-03', clockIn: '09:05', clockOut: null,    gps: 'Luar Radius',  note: 'Absen dari lokasi cabang' },
    { empIdx: 3,  date: '2026-07-03', clockIn: '08:10', clockOut: null,    gps: 'Dalam Radius', note: '' },
    { empIdx: 4,  date: '2026-07-03', clockIn: '08:03', clockOut: null,    gps: 'Dalam Radius', note: '' },
    { empIdx: 5,  date: '2026-07-03', clockIn: '08:33', clockOut: null,    gps: 'Dalam Radius', note: '' },
    { empIdx: 6,  date: '2026-07-03', clockIn: '08:18', clockOut: null,    gps: 'Dalam Radius', note: '' },
    { empIdx: 7,  date: '2026-07-03', clockIn: null,    clockOut: null,    gps: '-',           note: 'Alpha' },
    { empIdx: 8,  date: '2026-07-03', clockIn: '08:22', clockOut: null,    gps: 'Dalam Radius', note: '' },
    { empIdx: 9,  date: '2026-07-03', clockIn: '08:00', clockOut: null,    gps: 'Dalam Radius', note: '' },
  ];

  const enrichedLog = ALL_MOCK_LOG.map(m => {
    const emp = activeEmployees[m.empIdx];
    if (!emp) return null;
    let lateMinutes = 0, earlyLeaveMinutes = 0, workMinutes = null;
    if (m.clockIn) {
      const [h, mi] = m.clockIn.split(':').map(Number);
      const inMins = h * 60 + mi;
      if (inMins > LATE_THRESHOLD) lateMinutes = inMins - LATE_THRESHOLD;
    }
    if (m.clockOut) {
      const [h, mi] = m.clockOut.split(':').map(Number);
      const outMins = h * 60 + mi;
      if (outMins < EARLY_LEAVE_THRESHOLD) earlyLeaveMinutes = EARLY_LEAVE_THRESHOLD - outMins;
    }
    if (m.clockIn && m.clockOut) {
      const [ih, im] = m.clockIn.split(':').map(Number);
      const [oh, om] = m.clockOut.split(':').map(Number);
      workMinutes = (oh * 60 + om) - (ih * 60 + im);
    }
    const isAlpha = !m.clockIn && (m.note === 'Alpha' || m.note === '');
    const isCuti = m.note && m.note.startsWith('Cuti');
    const status = isCuti ? 'Cuti Sakit' : isAlpha ? 'Alpha' : lateMinutes > 0 ? 'Terlambat' : 'Hadir';
    return { ...m, emp, lateMinutes, earlyLeaveMinutes, workMinutes, status };
  }).filter(Boolean);

  const allDivisions = ['Semua', ...new Set(activeEmployees.map(e => e.division).filter(Boolean))];

  const rekapYear = parseInt(attRekapMonth.split('-')[0]);
  const rekapMonth = parseInt(attRekapMonth.split('-')[1]) - 1;
  const WORKDAYS_IN_MONTH = 22;

  const rekapRows = activeEmployees
    .filter(emp => attDivisionFilter === 'Semua' || emp.division === attDivisionFilter)
    .map(emp => {
      const logs = enrichedLog.filter(r => {
        if (r.emp.id !== emp.id) return false;
        const d = new Date(r.date);
        return d.getFullYear() === rekapYear && d.getMonth() === rekapMonth;
      });
      const hadirDays = logs.filter(r => r.status === 'Hadir' || r.status === 'Terlambat').length;
      const cutiDays = logs.filter(r => r.status === 'Cuti Sakit').length;
      const alphaDays = logs.filter(r => r.status === 'Alpha').length;
      const totalLateMin = logs.reduce((s, r) => s + r.lateMinutes, 0);
      const totalEarlyMin = logs.reduce((s, r) => s + r.earlyLeaveMinutes, 0);
      return { emp, hadirDays, cutiDays, alphaDays, totalLateMin, totalEarlyMin, WORKDAYS_IN_MONTH };
    });

  const rekapTotalPages = Math.ceil(rekapRows.length / ITEMS_PER_PAGE);
  const rekapPaginated = rekapRows.slice((currentPageAtt - 1) * ITEMS_PER_PAGE, currentPageAtt * ITEMS_PER_PAGE);

  const handleExportRekapCSV = () => {
    const headers = ['ID','Nama','Divisi','Jabatan','Hari Kerja Efektif','Hadir','Total Terlambat (Menit)','Total Pulang Cepat (Menit)','Cuti/Izin','Alpha'];
    const rows = [headers.join(',')];
    rekapRows.forEach(r => {
      rows.push([r.emp.id, r.emp.name, r.emp.division, r.emp.role, r.WORKDAYS_IN_MONTH, r.hadirDays, r.totalLateMin, r.totalEarlyMin, r.cutiDays, r.alphaDays].map(v => `"${v}"`).join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Rekap_Kehadiran_${attRekapMonth}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast('Rekap berhasil diunduh sebagai CSV!');
  };

  const dailyRows = enrichedLog.filter(r => {
    if (r.date < attDateFrom || r.date > attDateTo) return false;
    if (attDivisionFilter !== 'Semua' && r.emp.division !== attDivisionFilter) return false;
    if (attStatusFilter !== 'Semua' && r.status !== attStatusFilter) return false;
    return true;
  }).sort((a, b) => a.date.localeCompare(b.date));

  const dailyTotalPages = Math.ceil(dailyRows.length / ITEMS_PER_PAGE);
  const dailyPaginated = dailyRows.slice((currentPageAtt - 1) * ITEMS_PER_PAGE, currentPageAtt * ITEMS_PER_PAGE);

  const totalHadir = activeAttSubTab === 'rekap'
    ? rekapRows.reduce((s, r) => s + r.hadirDays, 0)
    : dailyRows.filter(r => r.status === 'Hadir' || r.status === 'Terlambat').length;
  const totalLate = activeAttSubTab === 'rekap'
    ? rekapRows.filter(r => r.totalLateMin > 0).length
    : dailyRows.filter(r => r.lateMinutes > 0).length;
  const totalAlpha = activeAttSubTab === 'rekap'
    ? rekapRows.reduce((s, r) => s + r.alphaDays, 0)
    : dailyRows.filter(r => r.status === 'Alpha').length;
  const totalCuti = activeAttSubTab === 'rekap'
    ? rekapRows.reduce((s, r) => s + r.cutiDays, 0)
    : dailyRows.filter(r => r.status === 'Cuti Sakit').length;
  const totalRecords = activeAttSubTab === 'rekap' ? rekapRows.length : dailyRows.length;
  const attendanceRate = totalRecords > 0 ? Math.round((totalHadir / (activeAttSubTab === 'rekap' ? rekapRows.reduce((s, r) => s + r.WORKDAYS_IN_MONTH, 0) : totalRecords)) * 100) : 0;

  const handleExportDailyCSV = () => {
    const headers = ['Tanggal','Nama Karyawan','Divisi','Jam Masuk','Jam Pulang','Total Jam Kerja','Menit Terlambat','Pulang Cepat (Menit)','Status','Status GPS','Catatan'];
    const rows = [headers.join(',')];
    dailyRows.forEach(r => {
      const wh = r.workMinutes != null ? `${Math.floor(r.workMinutes/60)}j ${r.workMinutes%60}m` : '-';
      rows.push([r.date, r.emp.name, r.emp.division, r.clockIn||'-', r.clockOut||'-', wh, r.lateMinutes, r.earlyLeaveMinutes, r.status, r.gps, r.note||'-'].map(v => `"${v}"`).join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Log_Harian_${attDateFrom}_sd_${attDateTo}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast('Log harian berhasil diunduh sebagai CSV!');
  };

  const StatusBadge = ({ status }) => {
    const map = {
      'Hadir':      { bg: '#ECFDF5', color: '#10B981', border: '#A7F3D0' },
      'Terlambat':  { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
      'Alpha':      { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
      'Cuti Sakit': { bg: '#EEF2FF', color: '#6366F1', border: '#C7D2FE' },
    };
    const s = map[status] || { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
    return <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}`, fontWeight: 700 }}>{status}</span>;
  };

  const GpsBadge = ({ gps, note, empName }) => {
    if (gps === 'Dalam Radius') return <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#ECFDF5', color: '#10B981', border: '1px solid #A7F3D0', fontWeight: 700 }}>Dalam Radius</span>;
    if (gps === 'Luar Radius') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FDBA74', fontWeight: 700 }}>Luar Radius</span>
        <button onClick={() => showToast(`📍 ${empName}: Lat -6.2345, Long 106.8912 · Jarak ±350m dari kantor.\n💬 Alasan: "${note || 'Tidak ada catatan'}"`)} title="Lihat detail GPS" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '1px', display: 'inline-flex', color: '#EA580C' }}>
          <ion-icon name="information-circle-outline" style={{ fontSize: '16px' }}></ion-icon>
        </button>
      </div>
    );
    return <span style={{ fontSize: '12px', color: 'var(--color-gray-400)' }}>-</span>;
  };

  const tabBtnStyle = (key) => ({
    padding: '8px 18px', margin: 0, background: 'none', border: 'none',
    borderBottom: `3px solid ${activeAttSubTab === key ? 'var(--color-primary)' : 'transparent'}`,
    color: activeAttSubTab === key ? 'var(--color-primary)' : 'var(--color-gray-500)',
    fontWeight: 700, fontSize: '13px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '6px',
  });

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Tingkat Kehadiran', value: `${attendanceRate}%`, sub: `${totalHadir} hadir`, icon: 'checkmark-circle-outline', color: attendanceRate >= 90 ? '#10B981' : attendanceRate >= 75 ? '#D97706' : '#DC2626', bgColor: attendanceRate >= 90 ? '#ECFDF5' : attendanceRate >= 75 ? '#FFFBEB' : '#FEF2F2' },
          { label: 'Total Terlambat', value: totalLate, sub: activeAttSubTab === 'rekap' ? 'karyawan memiliki telat' : 'record terlambat', icon: 'time-outline', color: '#D97706', bgColor: '#FFFBEB' },
          { label: 'Alpha / Mangkir', value: totalAlpha, sub: activeAttSubTab === 'rekap' ? 'hari tanpa keterangan' : 'record alpha', icon: 'close-circle-outline', color: '#DC2626', bgColor: '#FEF2F2' },
          { label: 'Cuti / Izin', value: totalCuti, sub: activeAttSubTab === 'rekap' ? 'hari cuti diambil' : 'record cuti/izin', icon: 'calendar-outline', color: '#6366F1', bgColor: '#EEF2FF' },
        ].map((card, i) => (
          <div key={i} style={{ 
            padding: '16px 20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            background: '#FFFFFF',
            border: `1px solid ${card.color}25`,
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            textAlign: 'left'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '10px', 
              backgroundColor: card.bgColor, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexShrink: 0 
            }}>
              <ion-icon name={card.icon} style={{ fontSize: '24px', color: card.color }}></ion-icon>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start', textAlign: 'left' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: card.color, lineHeight: 1.1 }}>{card.value}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>{card.label}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.2 }}>{card.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== MAIN CARD ===== */}
      <div className="glass-card">
        {/* Sub-tab bar */}
        <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid var(--color-border)', padding: '0 24px' }}>
          <button style={tabBtnStyle('rekap')} onClick={() => { setActiveAttSubTab('rekap'); setCurrentPageAtt(1); }}>
            <ion-icon name="bar-chart-outline" style={{ fontSize: '15px' }}></ion-icon>
            Rekap Periodik
          </button>
          <button style={tabBtnStyle('harian')} onClick={() => { setActiveAttSubTab('harian'); setCurrentPageAtt(1); }}>
            <ion-icon name="list-outline" style={{ fontSize: '15px' }}></ion-icon>
            Log Harian
          </button>
        </div>

        {/* TAB 1: REKAP PERIODIK */}
        {activeAttSubTab === 'rekap' && (
          <>
            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>Rekap Bulanan Karyawan</span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '1px 0 0 0' }}>Akumulasi performa per karyawan · digunakan modul Payroll</p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-gray-50)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '5px 10px' }}>
                  <ion-icon name="calendar-outline" style={{ fontSize: '14px', color: 'var(--color-primary)' }}></ion-icon>
                  <input type="month" value={attRekapMonth} onChange={e => { setAttRekapMonth(e.target.value); setCurrentPageAtt(1); }} style={{ border: 'none', background: 'transparent', fontSize: '12px', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }} />
                </div>
                <select value={attDivisionFilter} onChange={e => { setAttDivisionFilter(e.target.value); setCurrentPageAtt(1); }} className="filter-select" style={{ fontSize: '12px', padding: '5px 10px', height: '34px' }}>
                  {allDivisions.map(d => <option key={d} value={d}>{d === 'Semua' ? 'Semua Divisi' : d}</option>)}
                </select>
                <button onClick={handleExportRekapCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 14px', height: '34px', background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' }}>
                  <ion-icon name="download-outline" style={{ fontSize: '14px' }}></ion-icon>
                  Unduh Excel / CSV
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>ID & Nama Karyawan</th>
                    <th>Divisi & Jabatan</th>
                    <th style={{ textAlign: 'center' }}>Hari Kerja Efektif</th>
                    <th style={{ textAlign: 'center' }}>Hadir</th>
                    <th style={{ textAlign: 'center' }}>Terlambat (Menit)</th>
                    <th style={{ textAlign: 'center' }}>Pulang Cepat (Menit)</th>
                    <th style={{ textAlign: 'center' }}>Cuti / Izin</th>
                    <th style={{ textAlign: 'center' }}>Alpha</th>
                  </tr>
                </thead>
                <tbody>
                  {rekapPaginated.length === 0 ? (
                    <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-400)' }}>Tidak ada data untuk periode dan filter ini.</td></tr>
                  ) : rekapPaginated.map((row, i) => {
                    const hasIssue = row.alphaDays > 0 || row.totalLateMin > 60;
                    return (
                      <tr key={i} style={{ backgroundColor: hasIssue ? '#FFFBEB' : 'transparent' }}>
                        <td>
                          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--color-gray-500)' }}>{row.emp.id}</div>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>{row.emp.name}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px' }}>{row.emp.division}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.emp.role}</div>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.WORKDAYS_IN_MONTH} Hari</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ fontWeight: 800, color: row.hadirDays >= row.WORKDAYS_IN_MONTH - 2 ? '#10B981' : '#D97706' }}>{row.hadirDays}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}> Hari</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {row.totalLateMin > 0
                            ? <span style={{ fontWeight: 800, color: row.totalLateMin > 60 ? '#DC2626' : '#D97706' }}>{row.totalLateMin} Mnt</span>
                            : <span style={{ color: '#10B981', fontWeight: 700 }}>–</span>}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {row.totalEarlyMin > 0
                            ? <span style={{ fontWeight: 800, color: '#D97706' }}>{row.totalEarlyMin} Mnt</span>
                            : <span style={{ color: '#10B981', fontWeight: 700 }}>–</span>}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {row.cutiDays > 0 ? <span style={{ fontWeight: 700, color: '#6366F1' }}>{row.cutiDays} Hari</span> : <span style={{ color: 'var(--color-gray-400)' }}>0</span>}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {row.alphaDays > 0
                            ? <span style={{ fontWeight: 800, color: '#DC2626', backgroundColor: '#FEF2F2', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #FECACA' }}>{row.alphaDays} Hari</span>
                            : <span style={{ color: '#10B981', fontWeight: 700 }}>–</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {rekapTotalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Menampilkan {((currentPageAtt-1)*ITEMS_PER_PAGE)+1}–{Math.min(currentPageAtt*ITEMS_PER_PAGE, rekapRows.length)} dari {rekapRows.length} karyawan</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="pending-btn reject" onClick={() => setCurrentPageAtt(p => Math.max(p-1,1))} disabled={currentPageAtt===1} style={{ height:'32px',padding:'0 12px',margin:0,opacity:currentPageAtt===1?0.5:1,cursor:currentPageAtt===1?'not-allowed':'pointer' }}>Sebelumnya</button>
                  {Array.from({length:rekapTotalPages},(_,i)=>i+1).map(p => <button key={p} onClick={()=>setCurrentPageAtt(p)} style={{height:'32px',width:'32px',margin:0,borderRadius:'6px',border:'1px solid var(--color-border)',background:currentPageAtt===p?'var(--color-primary)':'white',color:currentPageAtt===p?'white':'var(--color-gray-600)',fontWeight:600,fontSize:'12px',cursor:'pointer'}}>{p}</button>)}
                  <button className="pending-btn reject" onClick={() => setCurrentPageAtt(p => Math.min(p+1,rekapTotalPages))} disabled={currentPageAtt===rekapTotalPages} style={{ height:'32px',padding:'0 12px',margin:0,opacity:currentPageAtt===rekapTotalPages?0.5:1,cursor:currentPageAtt===rekapTotalPages?'not-allowed':'pointer' }}>Selanjutnya</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: LOG HARIAN */}
        {activeAttSubTab === 'harian' && (
          <>
            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>Log Detail Harian</span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '1px 0 0 0' }}>Toleransi keterlambatan: 08:30 WIB · 1 baris = 1 hari kerja per karyawan</p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-gray-50)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '5px 10px' }}>
                  <ion-icon name="calendar-outline" style={{ fontSize: '14px', color: 'var(--color-primary)' }}></ion-icon>
                  <input type="date" value={attDateFrom} onChange={e => { setAttDateFrom(e.target.value); setCurrentPageAtt(1); }} style={{ border:'none',background:'transparent',fontSize:'12px',color:'var(--text-main)',outline:'none',cursor:'pointer' }} />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>s/d</span>
                  <input type="date" value={attDateTo} onChange={e => { setAttDateTo(e.target.value); setCurrentPageAtt(1); }} style={{ border:'none',background:'transparent',fontSize:'12px',color:'var(--text-main)',outline:'none',cursor:'pointer' }} />
                </div>
                <select value={attDivisionFilter} onChange={e => { setAttDivisionFilter(e.target.value); setCurrentPageAtt(1); }} className="filter-select" style={{ fontSize:'12px',padding:'5px 10px',height:'34px' }}>
                  {allDivisions.map(d => <option key={d} value={d}>{d === 'Semua' ? 'Semua Divisi' : d}</option>)}
                </select>
                <select value={attStatusFilter} onChange={e => { setAttStatusFilter(e.target.value); setCurrentPageAtt(1); }} className="filter-select" style={{ fontSize:'12px',padding:'5px 10px',height:'34px' }}>
                  {['Semua','Hadir','Terlambat','Alpha','Cuti Sakit'].map(s => <option key={s} value={s}>{s === 'Semua' ? 'Semua Status' : s}</option>)}
                </select>
                <button onClick={handleExportDailyCSV} style={{ display:'flex',alignItems:'center',gap:'6px',padding:'5px 14px',height:'34px',background:'linear-gradient(135deg, #10B981, #059669)',color:'white',border:'none',borderRadius:'8px',fontSize:'12px',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',boxShadow:'0 2px 8px rgba(16,185,129,0.3)' }}>
                  <ion-icon name="download-outline" style={{ fontSize: '14px' }}></ion-icon>
                  Unduh CSV
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Nama Karyawan</th>
                    <th>Jam Masuk</th>
                    <th>Status Masuk</th>
                    <th>Jam Pulang</th>
                    <th>Status Pulang</th>
                    <th>Total Jam Kerja</th>
                    <th style={{ textAlign: 'center' }}>Aksi / GPS</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyPaginated.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-400)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                          <ion-icon name="search-outline" style={{ fontSize: '36px', opacity: 0.3 }}></ion-icon>
                          <span>Tidak ada data untuk filter yang dipilih.</span>
                        </div>
                      </td>
                    </tr>
                  ) : dailyPaginated.map((row, i) => {
                    const isLate = row.lateMinutes > 0;
                    const isEarly = row.earlyLeaveMinutes > 0;
                    const isAlpha = row.status === 'Alpha';
                    const isCuti = row.status === 'Cuti Sakit';
                    let rowBg = 'transparent';
                    if (isAlpha) rowBg = '#FEF2F2';
                    else if (isCuti) rowBg = '#EEF2FF';

                    const dateObj = new Date(row.date);
                    const dateStr = dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
                    const workHoursStr = row.workMinutes != null ? `${Math.floor(row.workMinutes/60)} Jam ${row.workMinutes%60} Menit` : (row.clockIn && !row.clockOut ? 'Belum Clock Out' : '-');

                    return (
                      <tr key={i} style={{ backgroundColor: rowBg }}>
                        <td style={{ fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{dateStr}</td>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>{row.emp.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{row.emp.division}</div>
                        </td>
                        <td>
                          {row.clockIn
                            ? <span style={{ fontSize: '13px', fontWeight: 700, color: isLate ? '#DC2626' : 'var(--text-main)' }}>{row.clockIn} WIB</span>
                            : <span style={{ fontSize: '12px', color: 'var(--color-gray-400)', fontStyle: 'italic' }}>–</span>}
                        </td>
                        <td>
                          {isCuti ? <StatusBadge status="Cuti Sakit" /> :
                           isAlpha ? <StatusBadge status="Alpha" /> :
                           isLate ? (
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                               <span style={{ fontSize: '10px', backgroundColor: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700, width: 'fit-content' }}>Terlambat {row.lateMinutes} menit</span>
                               <GpsBadge gps={row.gps} note={row.note} empName={row.emp.name} />
                             </div>
                           ) : (
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                               <StatusBadge status="Hadir" />
                               <GpsBadge gps={row.gps} note={row.note} empName={row.emp.name} />
                             </div>
                           )}
                        </td>
                        <td>
                          {row.clockOut
                            ? <span style={{ fontSize: '13px', fontWeight: 600, color: isEarly ? '#D97706' : 'var(--text-main)' }}>{row.clockOut} WIB</span>
                            : <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', fontStyle: 'italic' }}>{row.clockIn ? 'Belum Clock Out' : '–'}</span>}
                        </td>
                        <td>
                          {row.clockOut ? (
                            isEarly
                              ? <span style={{ fontSize: '10px', backgroundColor: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>Pulang Cepat {row.earlyLeaveMinutes} mnt</span>
                              : <span style={{ fontSize: '10px', backgroundColor: '#ECFDF5', color: '#10B981', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>Tepat Waktu</span>
                          ) : <span style={{ fontSize: '12px', color: 'var(--color-gray-400)' }}>–</span>}
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: row.workMinutes != null ? 'var(--text-main)' : 'var(--color-gray-400)' }}>
                            {workHoursStr}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <GpsBadge gps={row.gps} note={row.note} empName={row.emp.name} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {dailyTotalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Menampilkan {((currentPageAtt-1)*ITEMS_PER_PAGE)+1}–{Math.min(currentPageAtt*ITEMS_PER_PAGE, dailyRows.length)} dari {dailyRows.length} record</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="pending-btn reject" onClick={() => setCurrentPageAtt(p => Math.max(p-1,1))} disabled={currentPageAtt===1} style={{ height:'32px',padding:'0 12px',margin:0,opacity:currentPageAtt===1?0.5:1,cursor:currentPageAtt===1?'not-allowed':'pointer' }}>Sebelumnya</button>
                  {Array.from({length:dailyTotalPages},(_,i)=>i+1).map(p => <button key={p} onClick={()=>setCurrentPageAtt(p)} style={{height:'32px',width:'32px',margin:0,borderRadius:'6px',border:'1px solid var(--color-border)',background:currentPageAtt===p?'var(--color-primary)':'white',color:currentPageAtt===p?'white':'var(--color-gray-600)',fontWeight:600,fontSize:'12px',cursor:'pointer'}}>{p}</button>)}
                  <button className="pending-btn reject" onClick={() => setCurrentPageAtt(p => Math.min(p+1,dailyTotalPages))} disabled={currentPageAtt===dailyTotalPages} style={{ height:'32px',padding:'0 12px',margin:0,opacity:currentPageAtt===dailyTotalPages?0.5:1,cursor:currentPageAtt===dailyTotalPages?'not-allowed':'pointer' }}>Selanjutnya</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
