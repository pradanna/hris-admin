import React from 'react';

export default function PayrollView({
  store,
  activePayrollSubTab,
  setActivePayrollSubTab,
  setSelectedEmpName,
  setManualAbsenIn,
  setManualAbsenOut,
  setActiveModal,
  setSelectedEmpDetail,
  handleTabChange,
  setActiveLeaveSubTab,
  setSelectedReqId,
  showToast
}) {
  // Hitung persentase real: ((Total Karyawan - Jumlah Karyawan Terhambat) / Total Karyawan) * 100%
  const totalEmployees = store.employees.length;
  const totalBlockers = store.payrollStatus.blockers.length;
  const processedEmployees = totalEmployees - totalBlockers;
  const realProgress = Math.round((processedEmployees / totalEmployees) * 100);
  const isCompleted = realProgress === 100;
  const hasBlockers = totalBlockers > 0;

  return (
    <>
      {/* Sub-tab Bar */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid var(--color-border)', marginBottom: '24px' }}>
        <button
          className="panel-footer-btn"
          onClick={() => setActivePayrollSubTab('run')}
          style={{ padding: '8px 16px', margin: 0, background: 'none', border: 'none', borderBottom: `3px solid ${activePayrollSubTab === 'run' ? 'var(--color-primary)' : 'transparent'}`, color: activePayrollSubTab === 'run' ? 'var(--color-primary)' : 'var(--color-gray-500)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
        >
          Payroll Run (Juli 2026)
        </button>
        <button
          className="panel-footer-btn"
          onClick={() => setActivePayrollSubTab('history')}
          style={{ padding: '8px 16px', margin: 0, background: 'none', border: 'none', borderBottom: `3px solid ${activePayrollSubTab === 'history' ? 'var(--color-primary)' : 'transparent'}`, color: activePayrollSubTab === 'history' ? 'var(--color-primary)' : 'var(--color-gray-500)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
        >
          Riwayat Gaji
        </button>
      </div>

      {activePayrollSubTab === 'run' ? (
        <>
          {/* Header progress */}
          <div className="glass-card" style={{ marginBottom: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 className="chart-title">Proses Payroll - Periode Juli 2026</h3>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 700, 
                backgroundColor: isCompleted ? 'var(--color-success-light)' : 'var(--color-warning-light)', 
                color: isCompleted ? 'var(--color-success-text)' : 'var(--color-warning-text)', 
                padding: '6px 12px', 
                borderRadius: 'var(--radius-sm)' 
              }}>
                Status: {isCompleted ? 'Kalkulasi Selesai (100%)' : `Dalam Proses (${realProgress}%)`}
              </span>
            </div>
            <div className="progress-bar-bg" style={{ margin: '12px 0', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '999px', overflow: 'hidden' }}>
              <div className="progress-bar-fill" style={{ width: `${realProgress}%`, height: '100%', backgroundColor: isCompleted ? 'var(--color-success)' : '#D97706', transition: 'all 0.4s' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Estimasi Pengeluaran Kas: <strong>{store.payrollStatus.totalEstimate}</strong> • Terproses: <strong>{processedEmployees} / {totalEmployees} Karyawan</strong>
              </p>
              {!isCompleted && (
                <button 
                  className="btn-primary" 
                  disabled={hasBlockers}
                  style={{ 
                    height: '34px', 
                    fontSize: '12px', 
                    padding: '0 16px',
                    backgroundColor: hasBlockers ? 'var(--color-gray-300)' : 'var(--color-primary)',
                    color: hasBlockers ? 'var(--color-gray-500)' : 'white',
                    cursor: hasBlockers ? 'not-allowed' : 'pointer',
                    opacity: hasBlockers ? 0.7 : 1,
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700
                  }} 
                  onClick={() => { 
                    const confirmLock = window.confirm("Apakah Anda yakin ingin menyelesaikan kalkulasi payroll untuk periode Juli 2026?\n\nAksi ini akan:\n1. Mengunci data keuangan periode ini di database.\n2. Menerbitkan slip gaji digital ke portal ESS karyawan secara real-time.");
                    if (!confirmLock) return;
                    store.processPayroll(); 
                    showToast('Kalkulasi payroll selesai. Data dikunci & slip gaji diterbitkan!'); 
                  }}
                >
                  Selesaikan Kalkulasi
                </button>
              )}
            </div>
          </div>

          {/* Blockers */}
          {!isCompleted && (
            <div className="glass-card" style={{ marginBottom: '24px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div className="table-header-row" style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', alignItems: 'center', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-warning-text)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    <ion-icon name="alert-circle-outline" style={{ fontSize: '18px' }}></ion-icon>
                    <span>Butuh Perhatian ({totalBlockers} Karyawan Terhambat)</span>
                  </h4>
                </div>
              </div>

              <table className="custom-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Karyawan</th>
                    <th>Divisi & Posisi</th>
                    <th>Status Blocker</th>
                    <th style={{ textAlign: 'right', paddingRight: '24px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {store.payrollStatus.blockers.map(b => {
                    const isLembur = b.blocker.includes('Lembur');
                    const isCuti = b.blocker.includes('Cuti');
                    
                    return (
                      <tr key={b.name}>
                        <td style={{ fontWeight: 600 }}>{b.name}</td>
                        <td>{b.division} • {b.role}</td>
                        <td><span style={{ color: 'var(--color-danger-text)', fontWeight: 600 }}>{b.blocker}</span></td>
                        <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                          {isLembur || isCuti ? (
                            <button
                              className="pending-btn approve"
                              style={{ padding: '4px 10px', fontSize: '11px', width: 'auto', backgroundColor: '#D97706', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                              onClick={() => {
                                handleTabChange('leaves');
                                if (isLembur) {
                                  setActiveLeaveSubTab('lembur');
                                  setSelectedReqId('REQ008');
                                  setActiveModal('leave_detail');
                                } else {
                                  setActiveLeaveSubTab('cuti');
                                  setSelectedReqId('REQ009');
                                  setActiveModal('leave_detail');
                                }
                              }}
                            >
                              Buka Pengajuan
                            </button>
                          ) : (
                            <button
                              className="pending-btn approve"
                              style={{ padding: '4px 10px', fontSize: '11px', width: 'auto', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                              onClick={() => {
                                setSelectedEmpName(b.name);
                                setManualAbsenIn('08:00');
                                setManualAbsenOut('17:00');
                                setActiveModal('absen_manual');
                              }}
                            >
                              Input Absen Manual
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Draf Gaji Terproses */}
          <div className="glass-card">
            <div className="table-header-row" style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Draf Gaji Terproses</h4>
            </div>
            <table className="custom-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Nama Karyawan</th>
                  <th>Gaji Pokok (Gross)</th>
                  <th>Total Tunjangan (+)</th>
                  <th>Total Potongan (-)</th>
                  <th>Tipe Kontrak</th>
                  <th>Take Home Pay (Net)</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {store.employees.map(emp => {
                  const tunjanganJabatan = emp.tunjanganJabatan || Math.round(emp.salary * 0.08);
                  const tunjanganTransport = emp.tunjanganTransport || Math.round(emp.salary * 0.05);
                  const totalTunjangan = tunjanganJabatan + tunjanganTransport;
                  const totalPotongan = emp.potonganKasbon || Math.round(emp.salary * 0.03);
                  const takeHomePay = (emp.salary || 6500000) + totalTunjangan - totalPotongan;
                  const isBlocked = store.payrollStatus.blockers.some(b => b.name === emp.name);

                  return (
                    <tr key={emp.id}>
                      <td style={{ fontWeight: 600 }}>{emp.name}</td>
                      <td>Rp {(emp.salary || 6500000).toLocaleString('id-ID')}</td>
                      <td style={{ color: 'var(--color-success-text)' }}>+Rp {totalTunjangan.toLocaleString('id-ID')}</td>
                      <td style={{ color: 'var(--color-danger-text)' }}>-Rp {totalPotongan.toLocaleString('id-ID')}</td>
                      <td>{emp.contractType}</td>
                      <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>Rp {takeHomePay.toLocaleString('id-ID')}</td>
                      <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {!isBlocked && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success-text)', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px' }} title="Data Clear">
                              <ion-icon name="checkmark-outline"></ion-icon>
                            </span>
                          )}
                          <button
                            className="action-icon-btn"
                            title="Pratinjau Slip Gaji"
                            onClick={() => {
                              setSelectedEmpName(emp.name);
                              setSelectedEmpDetail(emp.role);
                              setActiveModal('payslip');
                            }}
                          >
                            <ion-icon name="eye-outline" style={{ color: 'var(--color-primary)', fontSize: '16px' }}></ion-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div className="table-header-row" style={{ paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Arsip & Riwayat Penggajian Terkunci</h4>
          </div>
          <table className="custom-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Periode</th>
                <th>Total Pengeluaran Kas</th>
                <th>Karyawan Terbayar</th>
                <th>Tanggal Finalisasi</th>
                <th>Otorisator HR</th>
                <th>Status Transfer</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {store.payrollHistory && store.payrollHistory.length > 0 ? (
                store.payrollHistory.map(hist => (
                  <tr key={hist.period}>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{hist.period}</td>
                    <td style={{ fontWeight: 600 }}>{hist.totalSpend}</td>
                    <td>{hist.employeesPaid} Karyawan</td>
                    <td style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{hist.processedDate}</td>
                    <td>{hist.processedBy}</td>
                    <td>
                      <span className="status-badge berhasil" style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ion-icon name="checkmark-circle-outline"></ion-icon>
                        <span>{hist.status}</span>
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <button
                        className="pending-btn approve"
                        style={{ padding: '4px 10px', fontSize: '11px', width: 'auto', backgroundColor: 'var(--color-gray-100)', color: 'var(--color-primary)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                        onClick={() => {
                          alert(`Membuka berkas arsip audit & draf komparatif slip gaji untuk ${hist.period}...\n\nOtorisator: ${hist.processedBy}\nJumlah Karyawan: ${hist.employeesPaid}\nTotal Kas: ${hist.totalSpend}`);
                        }}
                      >
                        Lihat Arsip
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-gray-400)', py: 4 }}>
                    Belum ada riwayat penggajian pada database lokal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
