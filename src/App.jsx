import React, { useState, useEffect } from 'react';
import { useStore } from './hooks/useStore';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import EmployeesView from './views/EmployeesView';
import AttendanceView from './views/AttendanceView';
import LeavesView from './views/LeavesView';
import PayrollView from './views/PayrollView';
import SettingsView from './views/SettingsView';
import BroadcastView from './views/BroadcastView';
import MasterDataView from './views/MasterDataView';
import PayrollComponentsView from './views/PayrollComponentsView';
import { ModalViews } from './views/ModalViews';

export default function App() {
  const store = useStore();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activePayrollSubTab, setActivePayrollSubTab] = useState('run');
  const [activeEmployeeSubTab, setActiveEmployeeSubTab] = useState('active');

  // Search/Filters State
  const [globalSearch, setGlobalSearch] = useState('');
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [employeeFilterStatus, setEmployeeFilterStatus] = useState('Semua');
  const [blockersSearchQuery, setBlockersSearchQuery] = useState('');
  const [draftsSearchQuery, setDraftsSearchQuery] = useState('');
  const [contractSortOrder, setContractSortOrder] = useState('none'); // 'none' | 'asc' | 'desc'
  const [archiveSearchQuery, setArchiveSearchQuery] = useState('');
  const [currentPageArchive, setCurrentPageArchive] = useState(1);

  // Modals visibility and active item states
  const [activeModal, setActiveModal] = useState(null); // 'renew', 'reject', 'detail', 'payroll_approve', 'absen_manual', 'payslip', 'add_emp', 'invite_emp'
  const [selectedReqId, setSelectedReqId] = useState(null);
  const [selectedEmpName, setSelectedEmpName] = useState('');
  const [selectedEmpDetail, setSelectedEmpDetail] = useState('');
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [activeDropdownEmpId, setActiveDropdownEmpId] = useState(null);
  const [editSalaryValue, setEditSalaryValue] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('Super Admin');
  const [editSalaryJabatan, setEditSalaryJabatan] = useState('');
  const [editSalaryTransport, setEditSalaryTransport] = useState('');
  const [editSalaryKasbon, setEditSalaryKasbon] = useState('');
  const [editSalaryEffectiveDate, setEditSalaryEffectiveDate] = useState('2026-07-01');
  const [editSalaryReason, setEditSalaryReason] = useState('Kenaikan Tahunan');
  const [editSalaryNotes, setEditSalaryNotes] = useState('');

  // Pagination states
  const [currentPageEmp, setCurrentPageEmp] = useState(1);
  const [currentPageAtt, setCurrentPageAtt] = useState(1);
  const [currentPageLeave, setCurrentPageLeave] = useState(1);
  const [activeLeaveSubTab, setActiveLeaveSubTab] = useState('cuti'); // 'cuti' | 'izin' | 'lembur' | 'tugas'
  const [leaveStatusFilter, setLeaveStatusFilter] = useState('Pending'); // 'Pending' | 'Approved' | 'Rejected'
  const [leaveDateFrom, setLeaveDateFrom] = useState('2026-07-01');
  const [leaveDateTo, setLeaveDateTo] = useState('2026-07-10');
  const ITEMS_PER_PAGE = 5;

  // Attendance filter states
  const [attDateFrom, setAttDateFrom] = useState('2026-07-01');
  const [attDateTo, setAttDateTo] = useState('2026-07-03');
  const [attDivisionFilter, setAttDivisionFilter] = useState('Semua');
  const [attStatusFilter, setAttStatusFilter] = useState('Semua');
  const [activeAttSubTab, setActiveAttSubTab] = useState('rekap'); // 'rekap' | 'harian'
  const [attRekapMonth, setAttRekapMonth] = useState('2026-07'); // for rekap tab filter

  // Form input states
  const [renewDecision, setRenewDecision] = useState('convert');
  const [renewEffectiveDate, setRenewEffectiveDate] = useState('2026-07-02');
  const [renewEndDate, setRenewEndDate] = useState('2027-07-02');
  const [renewSalary, setRenewSalary] = useState(10000000);
  const [renewNotes, setRenewNotes] = useState('');

  const [rejectReason, setRejectReason] = useState('');
  const [showInlineRejectInput, setShowInlineRejectInput] = useState(false);

  const [manualAbsenIn, setManualAbsenIn] = useState('08:00');
  const [manualAbsenOut, setManualAbsenOut] = useState('17:00');
  const [manualAbsenReason, setManualAbsenReason] = useState('Koreksi kehadiran disetujui HRD');

  const [addEmpName, setAddEmpName] = useState('');
  const [addEmpEmail, setAddEmpEmail] = useState('');
  const [addEmpRole, setAddEmpRole] = useState('Staff Sales Counter');
  const [addEmpDiv, setAddEmpDiv] = useState('Sales & Marketing');
  const [addEmpContract, setAddEmpContract] = useState('PKWT');
  const [addEmpStartDate, setAddEmpStartDate] = useState('2026-07-02');
  const [addEmpEndDate, setAddEmpEndDate] = useState('2027-07-02');
  const [addEmpSalary, setAddEmpSalary] = useState('');

  const [inviteRole, setInviteRole] = useState('Staff Sales Counter');
  const [inviteDiv, setInviteDiv] = useState('Sales & Marketing');
  const [inviteContract, setInviteContract] = useState('PKWT');
  const [inviteStartDate, setInviteStartDate] = useState('2026-07-02');
  const [magicLink, setMagicLink] = useState('');

  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownEmpId(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    setCurrentPageEmp(1);
  }, [employeeSearchQuery, employeeFilterStatus]);

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Sync tab clicks with sidebar
  const handleTabChange = (tabId) => {
    if (tabId === 'payroll_run') {
      setActiveTab('payroll');
      setActivePayrollSubTab('run');
    } else if (tabId === 'payroll_history') {
      setActiveTab('payroll');
      setActivePayrollSubTab('history');
    } else {
      setActiveTab(tabId);
    }
    setGlobalSearch('');
  };

  const handleDirectApprove = (id) => {
    const request = store.pendingRequests.find(r => r.id === id);
    if (!request) return;

    if (request.type === 'Pendaftaran Mandiri') {
      const inputVal = prompt(`Masukkan Gaji Pokok Bulanan (Gross Rupiah) untuk ${request.name}:`, "6000000");
      if (inputVal === null) return; // cancel
      const salary = parseFloat(inputVal.replace(/\D/g, '')) || 0;
      store.approveRequest(id, salary);
      showToast(`Karyawan baru ${request.name} berhasil disetujui & ditambahkan ke sistem.`);
    } else {
      store.approveRequest(id);
      showToast(`Persetujuan ${request.type} untuk ${request.name} berhasil disetujui.`);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <div id="sidebar-container" className="sidebar">
        <Sidebar activeTab={activeTab === 'payroll' ? (activePayrollSubTab === 'run' ? 'payroll_run' : 'payroll_history') : activeTab} setActiveTab={handleTabChange} />
      </div>

      {/* Main Workspace Area */}
      <div className="main-workspace">
        {/* Topbar Header */}
        <header className="topbar">
          <div className="search-wrapper">
            <ion-icon name="search-outline" style={{ color: 'var(--color-gray-400)', fontSize: '18px' }}></ion-icon>
            <input
              type="text"
              className="search-input"
              placeholder="Cari karyawan atau laporan..."
              value={globalSearch}
              onChange={(e) => {
                const query = e.target.value;
                setGlobalSearch(query);
                if (activeTab === 'employees') {
                  setEmployeeSearchQuery(query);
                } else if (activeTab === 'payroll') {
                  setDraftsSearchQuery(query);
                  setBlockersSearchQuery(query);
                }
              }}
            />
          </div>

          <div className="topbar-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-gray-500)' }}>Simulasi Role:</span>
              <select 
                value={currentUserRole} 
                onChange={(e) => {
                  setCurrentUserRole(e.target.value);
                  showToast(`Role diubah menjadi ${e.target.value}`);
                }}
                style={{
                  height: '32px',
                  padding: '0 8px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'white',
                  fontWeight: 600,
                  color: 'var(--color-primary)'
                }}
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Finance/Payroll Officer">Finance/Payroll Officer</option>
                <option value="HR Officer">HR Officer</option>
                <option value="Operational Manager">Operational Manager</option>
              </select>
            </div>
            <button className="action-icon-btn" title="Notifikasi" onClick={() => showToast('Tidak ada notifikasi baru.')}>
              <ion-icon name="notifications-outline" style={{ fontSize: '20px' }}></ion-icon>
            </button>
            <button className="action-icon-btn" title="Riwayat Aktivitas" onClick={() => showToast('Menampilkan log aktivitas terbaru.')}>
              <ion-icon name="time-outline" style={{ fontSize: '20px' }}></ion-icon>
            </button>

            {/* HR Manager Admin Info */}
            <div className="topbar-user">
              <div className="user-meta">
                <h4 className="user-name">Budi Santoso</h4>
                <p className="user-role">HR Manager</p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                alt="HR Manager Avatar"
                className="user-avatar"
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="content-canvas">
          {activeTab === 'dashboard' && (
            <DashboardView
              store={store}
              handleTabChange={handleTabChange}
              setSelectedEmpName={setSelectedEmpName}
              setSelectedEmpDetail={setSelectedEmpDetail}
              setRenewDecision={setRenewDecision}
              setRenewEffectiveDate={setRenewEffectiveDate}
              setRenewNotes={setRenewNotes}
              setActiveModal={setActiveModal}
              setSelectedReqId={setSelectedReqId}
              setRejectReason={setRejectReason}
              handleDirectApprove={handleDirectApprove}
            />
          )}
          {activeTab === 'employees' && (
            <EmployeesView
              store={store}
              employeeSearchQuery={employeeSearchQuery}
              setEmployeeSearchQuery={setEmployeeSearchQuery}
              employeeFilterStatus={employeeFilterStatus}
              setEmployeeFilterStatus={setEmployeeFilterStatus}
              contractSortOrder={contractSortOrder}
              setContractSortOrder={setContractSortOrder}
              currentPageEmp={currentPageEmp}
              setCurrentPageEmp={setCurrentPageEmp}
              activeEmployeeSubTab={activeEmployeeSubTab}
              setActiveEmployeeSubTab={setActiveEmployeeSubTab}
              archiveSearchQuery={archiveSearchQuery}
              setArchiveSearchQuery={setArchiveSearchQuery}
              currentPageArchive={currentPageArchive}
              setCurrentPageArchive={setCurrentPageArchive}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              currentUserRole={currentUserRole}
              setSelectedEmpId={setSelectedEmpId}
              setEditSalaryValue={setEditSalaryValue}
              setEditSalaryJabatan={setEditSalaryJabatan}
              setEditSalaryTransport={setEditSalaryTransport}
              setEditSalaryKasbon={setEditSalaryKasbon}
              setEditSalaryEffectiveDate={setEditSalaryEffectiveDate}
              setEditSalaryReason={setEditSalaryReason}
              setEditSalaryNotes={setEditSalaryNotes}
              setActiveModal={setActiveModal}
              setSelectedReqId={setSelectedReqId}
              setActiveDropdownEmpId={setActiveDropdownEmpId}
              activeDropdownEmpId={activeDropdownEmpId}
              showToast={showToast}
            />
          )}
          {activeTab === 'attendance' && (
            <AttendanceView
              store={store}
              attDateFrom={attDateFrom}
              setAttDateFrom={setAttDateFrom}
              attDateTo={attDateTo}
              setAttDateTo={setAttDateTo}
              attDivisionFilter={attDivisionFilter}
              setAttDivisionFilter={setAttDivisionFilter}
              attStatusFilter={attStatusFilter}
              setAttStatusFilter={setAttStatusFilter}
              activeAttSubTab={activeAttSubTab}
              setActiveAttSubTab={setActiveAttSubTab}
              attRekapMonth={attRekapMonth}
              setAttRekapMonth={setAttRekapMonth}
              currentPageAtt={currentPageAtt}
              setCurrentPageAtt={setCurrentPageAtt}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              showToast={showToast}
            />
          )}
          {activeTab === 'leaves' && (
            <LeavesView
              store={store}
              leaveDateFrom={leaveDateFrom}
              setLeaveDateFrom={setLeaveDateFrom}
              leaveDateTo={leaveDateTo}
              setLeaveDateTo={setLeaveDateTo}
              leaveStatusFilter={leaveStatusFilter}
              setLeaveStatusFilter={setLeaveStatusFilter}
              activeLeaveSubTab={activeLeaveSubTab}
              setActiveLeaveSubTab={setActiveLeaveSubTab}
              currentPageLeave={currentPageLeave}
              setCurrentPageLeave={setCurrentPageLeave}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
              setActiveModal={setActiveModal}
              setSelectedReqId={setSelectedReqId}
            />
          )}
          {activeTab === 'broadcast' && (
            <BroadcastView
              store={store}
              showToast={showToast}
            />
          )}
          {activeTab === 'payroll' && (
            <PayrollView
              store={store}
              activePayrollSubTab={activePayrollSubTab}
              setActivePayrollSubTab={setActivePayrollSubTab}
              setSelectedEmpName={setSelectedEmpName}
              setManualAbsenIn={setManualAbsenIn}
              setManualAbsenOut={setManualAbsenOut}
              setActiveModal={setActiveModal}
              setSelectedEmpDetail={setSelectedEmpDetail}
              handleTabChange={handleTabChange}
              setActiveLeaveSubTab={setActiveLeaveSubTab}
              setSelectedReqId={setSelectedReqId}
              showToast={showToast}
            />
          )}
          {activeTab === 'payroll_components' && (
            <PayrollComponentsView
              store={store}
            />
          )}
          {activeTab === 'master_data' && (
            <MasterDataView
              store={store}
              showToast={showToast}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsView
              store={store}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <ModalViews
        store={store}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        selectedReqId={selectedReqId}
        setSelectedReqId={setSelectedReqId}
        selectedEmpName={selectedEmpName}
        setSelectedEmpName={setSelectedEmpName}
        selectedEmpDetail={selectedEmpDetail}
        setSelectedEmpDetail={setSelectedEmpDetail}
        renewDecision={renewDecision}
        setRenewDecision={setRenewDecision}
        renewEffectiveDate={renewEffectiveDate}
        setRenewEffectiveDate={setRenewEffectiveDate}
        renewEndDate={renewEndDate}
        setRenewEndDate={setRenewEndDate}
        renewSalary={renewSalary}
        setRenewSalary={setRenewSalary}
        renewNotes={renewNotes}
        setRenewNotes={setRenewNotes}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        showInlineRejectInput={showInlineRejectInput}
        setShowInlineRejectInput={setShowInlineRejectInput}
        manualAbsenIn={manualAbsenIn}
        setManualAbsenIn={setManualAbsenIn}
        manualAbsenOut={manualAbsenOut}
        setManualAbsenOut={setManualAbsenOut}
        manualAbsenReason={manualAbsenReason}
        setManualAbsenReason={setManualAbsenReason}
        addEmpName={addEmpName}
        setAddEmpName={setAddEmpName}
        addEmpEmail={addEmpEmail}
        setAddEmpEmail={setAddEmpEmail}
        addEmpRole={addEmpRole}
        setAddEmpRole={setAddEmpRole}
        addEmpDiv={addEmpDiv}
        setAddEmpDiv={setAddEmpDiv}
        addEmpContract={addEmpContract}
        setAddEmpContract={setAddEmpContract}
        addEmpStartDate={addEmpStartDate}
        setAddEmpStartDate={setAddEmpStartDate}
        addEmpEndDate={addEmpEndDate}
        setAddEmpEndDate={setAddEmpEndDate}
        addEmpSalary={addEmpSalary}
        setAddEmpSalary={setAddEmpSalary}
        editSalaryValue={editSalaryValue}
        setEditSalaryValue={setEditSalaryValue}
        editSalaryJabatan={editSalaryJabatan}
        setEditSalaryJabatan={setEditSalaryJabatan}
        editSalaryTransport={editSalaryTransport}
        setEditSalaryTransport={setEditSalaryTransport}
        editSalaryKasbon={editSalaryKasbon}
        setEditSalaryKasbon={setEditSalaryKasbon}
        editSalaryEffectiveDate={editSalaryEffectiveDate}
        setEditSalaryEffectiveDate={setEditSalaryEffectiveDate}
        editSalaryReason={editSalaryReason}
        setEditSalaryReason={setEditSalaryReason}
        editSalaryNotes={editSalaryNotes}
        setEditSalaryNotes={setEditSalaryNotes}
        selectedEmpId={selectedEmpId}
        setSelectedEmpId={setSelectedEmpId}
        currentUserRole={currentUserRole}
        handleDirectApprove={handleDirectApprove}
        showToast={showToast}
      />

      {/* Toast Notifications */}
      <div id="toast-container" style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast-notification ${t.type === 'error' ? 'error' : ''}`}>
            <ion-icon name={t.type === 'error' ? 'close-circle-outline' : 'checkmark-circle-outline'} style={{ fontSize: '18px' }}></ion-icon>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
