import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  // Peta Kategori Menu
  const menuCategories = [
    {
      title: 'DATA MASTER',
      items: [
        { id: 'dashboard', label: 'Home / Dashboard', icon: 'home-outline' },
        { id: 'master_data', label: 'Departemen & Jabatan', icon: 'git-branch-outline' },
        { id: 'employees', label: 'Data Karyawan', icon: 'people-outline', badge: 'New' }
      ]
    },
    {
      title: 'OPERASIONAL HR',
      items: [
        { id: 'attendance', label: 'Laporan Kehadiran', icon: 'checkmark-done-circle-outline' },
        { id: 'shift_planner', label: 'Penjadwalan Shift', icon: 'calendar-number-outline' },
        { id: 'leaves', label: 'Manajemen Pengajuan', icon: 'calendar-outline' },
        { id: 'broadcast', label: 'Broadcast Pesan', icon: 'megaphone-outline' }
      ]
    },
    {
      title: 'KEUANGAN & PAYROLL',
      items: [
        { id: 'payroll_run', label: 'Proses Payroll', icon: 'wallet-outline' },
        { id: 'payroll_history', label: 'Riwayat Gaji & Slip', icon: 'receipt-outline' },
        // { id: 'payroll_components', label: 'Komponen Gaji', icon: 'calculator-outline' },
        { id: 'payroll_setting', label: 'Pengaturan Payroll', icon: 'options-outline' }
      ]
    },
    {
      title: 'PENGATURAN SISTEM',
      items: [
        { id: 'settings', label: 'Pengaturan Kantor', icon: 'settings-outline' },
        { id: 'shift_master', label: 'Jam Kerja & Shift', icon: 'time-outline' }
      ]
    }
  ];

  const renderMenuItem = (item) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        style={{
          border: 'none',
          background: isActive ? 'var(--color-primary)' : 'none',
          color: isActive ? 'white' : 'var(--color-gray-700)',
          textAlign: 'left',
          width: '100%',
          fontFamily: 'inherit',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          borderRadius: '8px',
          fontWeight: isActive ? '600' : '500',
          fontSize: '13px',
          transition: 'all 0.15s ease',
          marginBottom: '2px'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
            e.currentTarget.style.color = 'var(--color-gray-900)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-gray-700)';
          }
        }}
      >
        <ion-icon 
          name={item.icon} 
          style={{ 
            fontSize: '18px', 
            color: isActive ? 'white' : 'var(--color-gray-500)',
            transition: 'color 0.15s' 
          }}
        ></ion-icon>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge && !isActive && (
          <span style={{ 
            fontSize: '10px', 
            fontWeight: '600', 
            backgroundColor: '#DCFCE7', 
            color: '#15803D', 
            padding: '1px 6px', 
            borderRadius: '10px',
            lineHeight: '1'
          }}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 14px' }}>
      
      {/* Premium Profile Header matching Acai */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', cursor: 'pointer' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '10px', 
          backgroundColor: '#1E293B', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          <ion-icon name="pulse-outline"></ion-icon>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-gray-900)', lineHeight: '1.2' }}>Panorama HR</span>
          <span style={{ fontSize: '11px', color: 'var(--color-gray-500)', marginTop: '2px' }}>admin@panoramahr.com</span>
        </div>
        <ion-icon name="swap-vertical-outline" style={{ fontSize: '16px', color: 'var(--color-gray-400)' }}></ion-icon>
      </div>

      {/* Section Divider Line */}
      <div style={{ height: '1px', backgroundColor: '#E2E8F0', marginBottom: '14px' }}></div>

      {/* Navigation List grouped by Category */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto', paddingRight: '2px' }}>
        {menuCategories.map((category) => (
          <div key={category.title} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 800, 
              color: 'var(--color-gray-400)', 
              letterSpacing: '0.06em', 
              margin: '0 0 6px 8px',
              textTransform: 'uppercase'
            }}>
              {category.title}
            </span>
            {category.items.map(item => renderMenuItem(item))}
          </div>
        ))}
      </nav>

      {/* Footer Version */}
      <div style={{ fontSize: '10px', color: 'var(--color-gray-400)', textAlign: 'center', paddingTop: '12px', borderTop: '1px solid #E2E8F0', marginTop: '12px' }}>
        v1.0.0-Beta • React Mode
      </div>
    </div>
  );
}
