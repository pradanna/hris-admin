import React from 'react';

export default function EmployeesView({
  store,
  employeeSearchQuery,
  setEmployeeSearchQuery,
  employeeFilterStatus,
  setEmployeeFilterStatus,
  contractSortOrder,
  setContractSortOrder,
  currentPageEmp,
  setCurrentPageEmp,
  activeEmployeeSubTab,
  setActiveEmployeeSubTab,
  archiveSearchQuery,
  setArchiveSearchQuery,
  currentPageArchive,
  setCurrentPageArchive,
  ITEMS_PER_PAGE,
  currentUserRole,
  setSelectedEmpId,
  setEditSalaryValue,
  setEditSalaryJabatan,
  setEditSalaryTransport,
  setEditSalaryKasbon,
  setEditSalaryEffectiveDate,
  setEditSalaryReason,
  setEditSalaryNotes,
  setActiveModal,
  setSelectedReqId,
  setActiveDropdownEmpId,
  activeDropdownEmpId,
  showToast
}) {
  const activeEmployees = store.employees.filter(emp =>
    emp.employeeStatus === 'Aktif' || !emp.employeeStatus
  );
  const archivedEmployees = store.employees.filter(emp =>
    emp.employeeStatus === 'Resign' || emp.employeeStatus === 'Nonaktif' || emp.employeeStatus === 'PHK'
  );

  const filtered = activeEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
      emp.division.toLowerCase().includes(employeeSearchQuery.toLowerCase());
    const matchesStatus = employeeFilterStatus === 'Semua' || emp.employeeStatus === employeeFilterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedEmployees = [...filtered].sort((a, b) => {
    if (contractSortOrder === 'none') return 0;
    const dateA = a.contractEndDate && a.contractEndDate !== '-' ? new Date(a.contractEndDate) : new Date('9999-12-31');
    const dateB = b.contractEndDate && b.contractEndDate !== '-' ? new Date(b.contractEndDate) : new Date('9999-12-31');
    return contractSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const totalPagesEmp = Math.ceil(sortedEmployees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPageEmp - 1) * ITEMS_PER_PAGE,
    currentPageEmp * ITEMS_PER_PAGE
  );

  const pendingRegs = store.pendingRequests.filter(r => r.type === 'Pendaftaran Mandiri');

  const filteredArchived = archivedEmployees.filter(emp =>
    emp.name.toLowerCase().includes(archiveSearchQuery.toLowerCase()) ||
    emp.role.toLowerCase().includes(archiveSearchQuery.toLowerCase()) ||
    emp.division.toLowerCase().includes(archiveSearchQuery.toLowerCase())
  );
  const totalPagesArchive = Math.ceil(filteredArchived.length / ITEMS_PER_PAGE);
  const paginatedArchived = filteredArchived.slice(
    (currentPageArchive - 1) * ITEMS_PER_PAGE,
    currentPageArchive * ITEMS_PER_PAGE
  );

  return (
    <>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid var(--color-border)', marginBottom: '24px' }}>
        <button
          className="panel-footer-btn"
          onClick={() => { setActiveEmployeeSubTab('active'); setCurrentPageEmp(1); }}
          style={{ padding: '8px 16px', margin: 0, background: 'none', border: 'none', borderBottom: `3px solid ${activeEmployeeSubTab === 'active' ? 'var(--color-primary)' : 'transparent'}`, color: activeEmployeeSubTab === 'active' ? 'var(--color-primary)' : 'var(--color-gray-500)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ion-icon name="people-outline" style={{ fontSize: '15px' }}></ion-icon>
          Karyawan Aktif ({activeEmployees.length})
        </button>
        <button
          className="panel-footer-btn"
          onClick={() => { setActiveEmployeeSubTab('archive'); setCurrentPageArchive(1); }}
          style={{ padding: '8px 16px', margin: 0, background: 'none', border: 'none', borderBottom: `3px solid ${activeEmployeeSubTab === 'archive' ? '#DC2626' : 'transparent'}`, color: activeEmployeeSubTab === 'archive' ? '#DC2626' : 'var(--color-gray-500)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ion-icon name="archive-outline" style={{ fontSize: '15px' }}></ion-icon>
          Arsip Karyawan ({archivedEmployees.length})
        </button>
        <button
          className="panel-footer-btn"
          onClick={() => setActiveEmployeeSubTab('inbox')}
          style={{ padding: '8px 16px', margin: 0, background: 'none', border: 'none', borderBottom: `3px solid ${activeEmployeeSubTab === 'inbox' ? 'var(--color-primary)' : 'transparent'}`, color: activeEmployeeSubTab === 'inbox' ? 'var(--color-primary)' : 'var(--color-gray-500)', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span>Persetujuan Pendaftaran</span>
          <span style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '9999px', fontWeight: 'bold' }}>
            {pendingRegs.length}
          </span>
        </button>
      </div>

      {activeEmployeeSubTab === 'active' ? (
        <div className="glass-card">
          <div className="table-header-row" style={{ alignItems: 'center', gap: '16px', padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
            <h3 className="table-section-title">Database Karyawan Aktif</h3>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                className="table-search-input"
                placeholder="Cari nama, role, divisi..."
                value={employeeSearchQuery}
                onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                style={{ width: '220px' }}
              />
              <select
                className="filter-select"
                value={employeeFilterStatus}
                onChange={(e) => setEmployeeFilterStatus(e.target.value)}
                style={{ padding: '6px 12px', height: '34px', fontSize: '11px' }}
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Resign">Resign</option>
                <option value="Suspend">Suspend</option>
              </select>
              <button
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '34px', backgroundColor: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}
                onClick={() => {
                  setActiveModal('invite_emp');
                }}
              >
                <ion-icon name="mail-outline"></ion-icon>
                <span>Kirim Link Pendaftaran</span>
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Lengkap</th>
                  <th>Jabatan</th>
                  <th>Divisi</th>
                  <th>Email</th>
                  <th>Tipe Kontrak</th>
                  <th 
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => {
                      if (contractSortOrder === 'none') setContractSortOrder('asc');
                      else if (contractSortOrder === 'asc') setContractSortOrder('desc');
                      else setContractSortOrder('none');
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Akhir Kontrak</span>
                      <ion-icon 
                        name={
                          contractSortOrder === 'asc' 
                            ? 'arrow-up-outline' 
                            : contractSortOrder === 'desc' 
                              ? 'arrow-down-outline' 
                              : 'swap-vertical-outline'
                        } 
                        style={{ 
                          fontSize: '14px', 
                          color: contractSortOrder !== 'none' ? 'var(--color-primary)' : 'var(--color-gray-400)' 
                        }}
                      ></ion-icon>
                    </div>
                  </th>
                  <th>Status Karyawan</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: '24px' }}>Tidak ada data karyawan ditemukan.</td>
                  </tr>
                ) : (
                  paginatedEmployees.map(emp => {
                    let rowBgColor = 'transparent';
                    if (emp.contractEndDate && emp.contractEndDate !== '-') {
                      const today = new Date('2026-07-03');
                      const endDate = new Date(emp.contractEndDate);
                      if (endDate < today) {
                        rowBgColor = '#FEF2F2';
                      } else {
                        const diffTime = endDate - today;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays <= 30) {
                          rowBgColor = '#FFFBEB';
                        }
                      }
                    }

                    return (
                      <tr key={emp.id} style={{ backgroundColor: rowBgColor }}>
                        <td>{emp.id}</td>
                        <td style={{ fontWeight: 600 }}>{emp.name}</td>
                        <td>{emp.role}</td>
                        <td>{emp.division}</td>
                        <td>{emp.email}</td>
                        <td>
                          <span className="pending-tag" style={{ backgroundColor: 'var(--color-gray-50)', border: '1px solid var(--color-border)', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, color: 'var(--color-gray-600)' }}>
                            {emp.contractType || 'PKWT'}
                          </span>
                        </td>
                        <td>
                          <span style={{ 
                            fontSize: '12px', 
                            fontWeight: emp.contractEndDate && emp.contractEndDate !== '-' ? 600 : 'normal',
                            color: emp.contractEndDate && emp.contractEndDate !== '-' 
                              ? (new Date(emp.contractEndDate) < new Date('2026-07-03') ? 'var(--color-danger-text)' : (Math.ceil((new Date(emp.contractEndDate) - new Date('2026-07-03')) / (1000*60*60*24)) <= 30 ? '#D97706' : 'var(--text-main)'))
                              : 'var(--color-gray-400)'
                          }}>
                            {emp.contractEndDate || '-'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${emp.employeeStatus === 'Aktif' ? 'berhasil' : (emp.employeeStatus === 'Resign' ? 'neutral' : 'pending')}`}>
                            {emp.employeeStatus || 'Aktif'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: '24px', position: 'relative' }}>
                          <button 
                            className="action-icon-btn" 
                            onClick={(e) => { 
                              e.stopPropagation();
                              setActiveDropdownEmpId(activeDropdownEmpId === emp.id ? null : emp.id); 
                            }} 
                            title="Pilihan Aksi"
                          >
                            <ion-icon name="ellipsis-vertical-outline" style={{ fontSize: '16px' }}></ion-icon>
                          </button>
                          
                          {activeDropdownEmpId === emp.id && (
                            <div className="glass-card" style={{
                              position: 'absolute',
                              right: '24px',
                              top: '36px',
                              zIndex: 100,
                              minWidth: '150px',
                              padding: '8px 0',
                              backgroundColor: 'white',
                              boxShadow: 'var(--shadow-lg)',
                              border: '1px solid var(--color-border)',
                              borderRadius: 'var(--radius-md)',
                              textAlign: 'left',
                              display: 'flex',
                              flexDirection: 'column'
                            }}>
                              <button 
                                style={{
                                  padding: '8px 16px',
                                  background: 'none',
                                  border: 'none',
                                  textAlign: 'left',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  color: 'var(--text-main)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}
                                onClick={() => {
                                  setSelectedEmpId(emp.id);
                                  setActiveModal('emp_detail');
                                  setActiveDropdownEmpId(null);
                                }}
                              >
                                <ion-icon name="eye-outline" style={{ color: 'var(--color-primary)' }}></ion-icon>
                                <span>Detail</span>
                              </button>
                              <button 
                                style={{
                                  padding: '8px 16px',
                                  background: 'none',
                                  border: 'none',
                                  textAlign: 'left',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  color: 'var(--text-main)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}
                                onClick={() => {
                                  setActiveDropdownEmpId(null);
                                  showToast('Fitur Edit Profil (Simulasi)');
                                }}
                              >
                                <ion-icon name="create-outline" style={{ color: 'var(--color-warning-text)' }}></ion-icon>
                                <span>Edit</span>
                              </button>
                              {(currentUserRole === 'Super Admin' || currentUserRole === 'Finance/Payroll Officer') && (
                                <button 
                                  style={{
                                    padding: '8px 16px',
                                    background: 'none',
                                    border: 'none',
                                    textAlign: 'left',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    color: 'var(--text-main)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                  onClick={() => {
                                    setSelectedEmpId(emp.id);
                                    setEditSalaryValue(emp.salary ? emp.salary.toString() : '');
                                    setEditSalaryJabatan(emp.tunjanganJabatan ? emp.tunjanganJabatan.toString() : '0');
                                    setEditSalaryTransport(emp.tunjanganTransport ? emp.tunjanganTransport.toString() : '0');
                                    setEditSalaryKasbon(emp.potonganKasbon ? emp.potonganKasbon.toString() : '0');
                                    setEditSalaryEffectiveDate('2026-07-01');
                                    setEditSalaryReason('Kenaikan Tahunan');
                                    setEditSalaryNotes('');
                                    setActiveModal('edit_salary');
                                    setActiveDropdownEmpId(null);
                                  }}
                                >
                                  <ion-icon name="cash-outline" style={{ color: 'var(--color-success-text)' }}></ion-icon>
                                  <span>Ubah Data Gaji</span>
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPagesEmp > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Menampilkan {((currentPageEmp - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPageEmp * ITEMS_PER_PAGE, filtered.length)} dari {filtered.length} Karyawan
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="pending-btn reject" 
                  onClick={() => setCurrentPageEmp(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPageEmp === 1}
                  style={{ height: '32px', padding: '0 12px', margin: 0, opacity: currentPageEmp === 1 ? 0.5 : 1, cursor: currentPageEmp === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Sebelumnya
                </button>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {Array.from({ length: totalPagesEmp }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPageEmp(page)}
                      style={{
                        height: '32px',
                        width: '32px',
                        border: page === currentPageEmp ? 'none' : '1px solid var(--color-border)',
                        backgroundColor: page === currentPageEmp ? 'var(--color-primary)' : 'white',
                        color: page === currentPageEmp ? 'white' : 'var(--text-main)',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  className="pending-btn reject" 
                  onClick={() => setCurrentPageEmp(prev => Math.min(prev + 1, totalPagesEmp))} 
                  disabled={currentPageEmp === totalPagesEmp}
                  style={{ height: '32px', padding: '0 12px', margin: 0, opacity: currentPageEmp === totalPagesEmp ? 0.5 : 1, cursor: currentPageEmp === totalPagesEmp ? 'not-allowed' : 'pointer' }}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      ) : activeEmployeeSubTab === 'archive' ? (
        /* ========== ARSIP KARYAWAN TAB ========== */
        <div className="glass-card">
          <div className="table-header-row" style={{ alignItems: 'center', gap: '16px', padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
            <div>
              <h3 className="table-section-title">Arsip Karyawan</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Mantan karyawan yang telah resign, kontrak berakhir, atau dinonaktifkan</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                className="table-search-input"
                placeholder="Cari nama, jabatan, divisi..."
                value={archiveSearchQuery}
                onChange={(e) => { setArchiveSearchQuery(e.target.value); setCurrentPageArchive(1); }}
                style={{ width: '220px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--color-border)' }}>
            {[
              { label: 'Total Arsip', value: archivedEmployees.length, color: '#6B7280', icon: 'people-outline' },
              { label: 'Resign', value: archivedEmployees.filter(e => e.employeeStatus === 'Resign').length, color: '#DC2626', icon: 'log-out-outline' },
              { label: 'Nonaktif', value: archivedEmployees.filter(e => e.employeeStatus === 'Nonaktif').length, color: '#D97706', icon: 'pause-circle-outline' },
              { label: 'PHK', value: archivedEmployees.filter(e => e.employeeStatus === 'PHK').length, color: '#7C3AED', icon: 'close-circle-outline' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderRight: i < 3 ? '1px solid var(--color-border)' : 'none' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ion-icon name={s.icon} style={{ fontSize: '16px', color: s.color }}></ion-icon>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Karyawan</th>
                  <th>Jabatan & Divisi</th>
                  <th>Jenis Kontrak</th>
                  <th>Status</th>
                  <th>Hari Kerja Terakhir</th>
                  <th>Alasan Keluar</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedArchived.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: '40px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <ion-icon name="archive-outline" style={{ fontSize: '40px', opacity: 0.3 }}></ion-icon>
                        <span>Tidak ada data arsip karyawan ditemukan.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedArchived.map(emp => {
                    const statusColor = emp.employeeStatus === 'Resign' ? { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' }
                      : emp.employeeStatus === 'Nonaktif' ? { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' }
                      : { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' };
                    return (
                      <tr key={emp.id} style={{ backgroundColor: '#FAFAFA', opacity: 0.9 }}>
                        <td style={{ fontSize: '12px', color: 'var(--color-gray-500)', fontFamily: 'monospace' }}>{emp.id}</td>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '13px' }}>{emp.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{emp.email}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '13px' }}>{emp.role}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{emp.division}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--color-gray-50)', border: '1px solid var(--color-border)', fontWeight: 600, color: 'var(--color-gray-600)' }}>
                            {emp.contractType}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '9999px', backgroundColor: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}`, fontWeight: 700 }}>
                            {emp.employeeStatus}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {emp.lastWorkingDay || emp.contractEndDate || '-'}
                        </td>
                        <td style={{ fontSize: '12px', maxWidth: '220px' }}>
                          <span style={{ color: 'var(--text-secondary)', fontStyle: emp.resignReason ? 'normal' : 'italic' }}>
                            {emp.resignReason || '-'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                          <button
                            onClick={() => { setSelectedEmpId(emp.id); setActiveModal('emp_profile'); }}
                            title="Lihat Profil"
                            style={{ padding: '6px 12px', background: 'var(--color-gray-50)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <ion-icon name="eye-outline" style={{ fontSize: '14px' }}></ion-icon>
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Archive Pagination */}
          {totalPagesArchive > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Menampilkan {((currentPageArchive - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPageArchive * ITEMS_PER_PAGE, filteredArchived.length)} dari {filteredArchived.length} Arsip
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="pending-btn reject"
                  onClick={() => setCurrentPageArchive(prev => Math.max(prev - 1, 1))}
                  disabled={currentPageArchive === 1}
                  style={{ height: '32px', padding: '0 12px', margin: 0, opacity: currentPageArchive === 1 ? 0.5 : 1, cursor: currentPageArchive === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalPagesArchive }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPageArchive(page)}
                    style={{ height: '32px', width: '32px', margin: 0, borderRadius: '6px', border: '1px solid var(--color-border)', background: currentPageArchive === page ? 'var(--color-primary)' : 'white', color: currentPageArchive === page ? 'white' : 'var(--color-gray-600)', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="pending-btn reject"
                  onClick={() => setCurrentPageArchive(prev => Math.min(prev + 1, totalPagesArchive))}
                  disabled={currentPageArchive === totalPagesArchive}
                  style={{ height: '32px', padding: '0 12px', margin: 0, opacity: currentPageArchive === totalPagesArchive ? 0.5 : 1, cursor: currentPageArchive === totalPagesArchive ? 'not-allowed' : 'pointer' }}
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card">
          <div className="table-header-row" style={{ alignItems: 'center', gap: '16px', padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
            <h3 className="table-section-title">Inbox Persetujuan Pendaftaran Mandiri</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>Menunggu verifikasi dan persetujuan HRD</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Nama Lengkap</th>
                  <th>Jabatan & Divisi</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pendingRegs.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: '32px' }}>Tidak ada pengajuan pendaftaran mandiri tertunda.</td>
                  </tr>
                ) : (
                  pendingRegs.map(reg => (
                    <tr key={reg.id}>
                      <td style={{ fontWeight: 600 }}>{reg.name}</td>
                      <td>{reg.role} • {reg.division || '-'}</td>
                      <td>{reg.email}</td>
                      <td><span className="pending-tag registration">{reg.type}</span></td>
                      <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button className="action-icon-btn" onClick={() => { setSelectedReqId(reg.id); setActiveModal('detail'); }} title="Lihat Berkas & Detail" style={{ padding: '6px', display: 'inline-flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: 'white', cursor: 'pointer' }}>
                            <ion-icon name="eye-outline" style={{ fontSize: '16px', color: 'var(--color-primary)' }}></ion-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
