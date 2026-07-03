import React from 'react';
import StatsCard from '../components/StatsCard';
import ApprovalCard from '../components/ApprovalCard';
import ActivityTable from '../components/ActivityTable';

export default function DashboardView({
  store,
  handleTabChange,
  setSelectedEmpName,
  setSelectedEmpDetail,
  setRenewDecision,
  setRenewEffectiveDate,
  setRenewNotes,
  setActiveModal,
  setSelectedReqId,
  setRejectReason,
  handleDirectApprove
}) {
  const filteredEmployees = store.employees.filter(emp => {
    const matchesBranch = store.selectedBranch === 'Semua Cabang' || emp.branch === store.selectedBranch;
    const matchesDept = store.selectedDept === 'Semua Departemen' || emp.division === store.selectedDept;
    return matchesBranch && matchesDept;
  });

  const total = filteredEmployees.length;
  const filteredAttendances = (store.attendances || []).filter(att =>
    filteredEmployees.some(emp => emp.id === att.employee_id)
  );

  const present = filteredAttendances.filter(a => a.status === 'Hadir').length;
  const leave = filteredAttendances.filter(a => a.status === 'Cuti' || a.status === 'Izin').length;
  const late = filteredAttendances.filter(a => a.is_late === true).length;
  const alpha = filteredAttendances.filter(a => a.status === 'Mangkir' || a.status === 'Alpha').length;
  const earlyLeave = filteredAttendances.filter(a => a.is_early_leave === true).length;
  const attendancePct = total > 0 ? ((present / total) * 100).toFixed(1) : '0';

  const totalCard = {
    title: 'Total Karyawan',
    value: total,
    icon: 'people-outline',
    bg: '#EEF2FF',
    color: 'var(--color-primary)',
    trend: `<span style="font-size: 11px; font-weight: 700; color: #10B981; background-color: #ECFDF5; padding: 2px 6px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 2px;"><ion-icon name="trending-up-outline" style="font-size: 12px;"></ion-icon>Aktif</span> <span style="font-size: 11px; color: var(--color-gray-400);">Database</span>`
  };

  const presentCard = {
    title: 'Hadir Hari Ini',
    value: present,
    icon: 'checkmark-circle-outline',
    bg: '#ECFDF5',
    color: '#10B981',
    trend: `<span style="font-size: 11px; font-weight: 700; color: #10B981; background-color: #ECFDF5; padding: 2px 6px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 2px;"><ion-icon name="checkmark-outline" style="font-size: 12px;"></ion-icon>${attendancePct}%</span> <span style="font-size: 11px; color: var(--color-gray-400);">Kehadiran</span>`
  };

  const leaveCard = {
    title: 'Cuti / Izin',
    value: leave,
    icon: 'calendar-outline',
    bg: '#FFFBEB',
    color: '#D97706',
    trend: `<span style="font-size: 11px; font-weight: 700; color: #D97706; background-color: #FFFBEB; padding: 2px 6px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 2px;">Normal</span> <span style="font-size: 11px; color: var(--color-gray-400);">Hari ini</span>`
  };

  const lateCard = {
    title: 'Terlambat / Plg Cepat',
    value: `${late} / ${earlyLeave}`,
    icon: 'time-outline',
    bg: '#FFF1F2',
    color: '#EF4444',
    trend: `<span style="font-size: 11px; font-weight: 700; color: #EF4444; background-color: #FEE2E2; padding: 2px 6px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 2px;"><ion-icon name="trending-up-outline" style="font-size: 12px;"></ion-icon>+ 2.8%</span> <span style="font-size: 11px; color: var(--color-gray-400);">Rata-rata</span>`
  };

  const alphaCard = {
    title: 'Mangkir (Alpha)',
    value: alpha,
    icon: 'alert-circle-outline',
    bg: '#FEE2E2',
    color: '#EF4444',
    trend: `<span style="font-size: 11px; font-weight: 700; color: #10B981; background-color: #ECFDF5; padding: 2px 6px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 2px;">Aman</span> <span style="font-size: 11px; color: var(--color-gray-400);">${alpha} Kasus</span>`
  };

  return (
    <>
      {/* Filters */}
      <div className="filters-bar">
        <span className="filter-lbl">Filter Tampilan:</span>
        <select className="filter-select" value={store.selectedBranch} onChange={(e) => store.setSelectedBranch(e.target.value)}>
          {store.branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className="filter-select" value={store.selectedDept} onChange={(e) => store.setSelectedDept(e.target.value)}>
          {store.departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard {...totalCard} onClick={() => handleTabChange('employees')} />
        <StatsCard {...presentCard} onClick={() => handleTabChange('attendance')} />
        <StatsCard {...leaveCard} onClick={() => handleTabChange('leaves')} />
        <StatsCard {...lateCard} onClick={() => handleTabChange('attendance')} />
        <StatsCard {...alphaCard} onClick={() => handleTabChange('attendance')} />
      </div>

      {/* Middle Dashboard Grid */}
      <div className="dashboard-middle-grid">
        <div className="dashboard-left-col">
          {/* Chart Simulation */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="chart-title">Rata-rata Kehadiran Harian</h3>
              <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700 }}>Periode: 26 Jun - 02 Jul 2026</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '180px', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
              {[
                { day: '26 Jun', pct: 96.8 },
                { day: '27 Jun', pct: 95.5 },
                { day: '28 Jun', pct: 94.2 },
                { day: '29 Jun', pct: 98.0 },
                { day: '30 Jun', pct: 97.4 },
                { day: '01 Jul', pct: 96.5 },
                { day: '02 Jul', pct: Number(attendancePct) > 0 ? Number(attendancePct) : 96.7 }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>{item.pct}%</span>
                  <div style={{ width: '24px', height: `${item.pct * 1.3}px`, backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', opacity: idx === 6 ? 1 : 0.7 }}></div>
                  <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', fontWeight: 500 }}>{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expiring Contracts */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ion-icon name="time-outline" style={{ color: 'var(--color-warning)' }}></ion-icon>
              <span>Kontrak Karyawan Segera Berakhir</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {store.expiringContracts.map(con => (
                <div key={con.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700 }}>{con.name}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: '2px' }}>{con.division} • Kontrak: {con.type}</p>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div>
                      <span className="status-badge pending" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>{con.daysLeft} Hari Lagi</span>
                      <p style={{ fontSize: '10px', color: 'var(--color-gray-400)', marginTop: '2px' }}>Habis: {con.date}</p>
                    </div>
                    <button
                      className="pending-btn approve"
                      style={{ padding: '6px 12px', fontSize: '11px', width: 'auto' }}
                      onClick={() => {
                        setSelectedEmpName(con.name);
                        setSelectedEmpDetail(`${con.type} • Divisi: ${con.division}`);
                        setRenewDecision('convert');
                        setRenewEffectiveDate('2026-07-02');
                        setRenewNotes('');
                        setActiveModal('renew');
                      }}
                    >
                      Tindak Lanjuti
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payroll Info Card */}
          <div className="glass-card" style={{
            padding: '24px',
            border: '1px solid rgba(15, 118, 110, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary)' }}>Modul Payroll: Progres Draf</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-gray-400)', marginTop: '4px' }}>Periode {store.payrollStatus.period} • {store.payrollStatus.processedEmployees} Karyawan Terproses</p>
              </div>
              <button className="btn-primary" style={{ height: '34px', fontSize: '12px', padding: '0 16px' }} onClick={() => handleTabChange('payroll')}>Kelola Payroll</button>
            </div>

            {/* Progress Slider Track representation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-gray-600)' }}>Kelengkapan Absensi & Berkas</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>{store.payrollStatus.progress}% Selesai</span>
              </div>
              <div style={{
                height: '8px',
                backgroundColor: '#F1F5F9',
                borderRadius: '999px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  width: `${store.payrollStatus.progress}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: '999px',
                  transition: 'width 0.5s ease-in-out'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Approvals Inbox) */}
        <div className="glass-card approval-panel">
          <div className="panel-header-row">
            <h3 className="panel-title">Persetujuan Menunggu</h3>
            <span className="panel-badge">{store.pendingRequests.length} Baru</span>
          </div>
          <div className="approval-items-col" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {store.pendingRequests.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '20px', fontSize: '12px' }}>Semua persetujuan selesai!</p>
            ) : (
              store.pendingRequests.map(req => (
                <ApprovalCard
                  key={req.id}
                  req={req}
                  onApprove={(id) => handleDirectApprove(id)}
                  onReject={(id) => {
                    setSelectedReqId(id);
                    setRejectReason('');
                    setActiveModal('reject');
                  }}
                  onViewDetail={(id) => {
                    setSelectedReqId(id);
                    setActiveModal('detail');
                  }}
                />
              ))
            )}
          </div>
          <button className="panel-footer-btn" style={{ marginTop: '16px', width: '100%', padding: '10px 0', border: 'none', borderTop: '1px solid var(--color-border)', background: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }} onClick={() => handleTabChange('leaves')}>
            Lihat Semua Pengajuan
          </button>
        </div>
      </div>

      {/* Recent Activities Table */}
      <ActivityTable activities={store.activities} />
    </>
  );
}
