import React, { useState, useEffect } from 'react';

export default function MasterDataView({ store, showToast }) {
  const [newDeptName, setNewDeptName] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  
  // State untuk departemen aktif yang sedang dipilih di bagian kiri
  const [activeDept, setActiveDept] = useState('');

  // Set default activeDept ke departemen pertama saat load
  useEffect(() => {
    if (store.departmentsList && store.departmentsList.length > 0 && !activeDept) {
      setActiveDept(store.departmentsList[0]);
    }
  }, [store.departmentsList, activeDept]);

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    store.addDepartment(newDeptName.trim());
    
    // Set departemen yang baru dibuat sebagai departemen aktif
    setActiveDept(newDeptName.trim());
    setNewDeptName('');
    showToast(`Departemen "${newDeptName.trim()}" berhasil ditambahkan.`);
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (!newRoleName.trim() || !activeDept) {
      alert('Nama Jabatan wajib diisi dan Departemen harus dipilih!');
      return;
    }
    store.addRole(newRoleName.trim(), activeDept);
    setNewRoleName('');
    showToast(`Jabatan "${newRoleName.trim()}" berhasil ditambahkan ke departemen "${activeDept}".`);
  };

  // Jabatan-jabatan yang disaring di bawah departemen aktif
  const rolesInActiveDept = store.rolesList 
    ? store.rolesList.filter(r => r.department === activeDept) 
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title & Description Header */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Struktur Organisasi & Master Data</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Klik nama departemen di panel kiri untuk mengelola rincian sub-jabatan (staf) di panel kanan.</p>
        </div>
        <div style={{ fontSize: '32px', color: 'var(--color-primary)' }}>
          <ion-icon name="git-branch-outline"></ion-icon>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        
        {/* PANEL KIRI: Master Departemen / Divisi */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
          <h3 className="chart-title" style={{ fontSize: '14px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ion-icon name="business-outline" style={{ color: 'var(--color-primary)', fontSize: '18px' }}></ion-icon>
            <span>Master Departemen ({store.departmentsList ? store.departmentsList.length : 0})</span>
          </h3>

          {/* Form Tambah Departemen */}
          <form onSubmit={handleAddDept} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Tambah departemen baru..." 
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              style={{ height: '38px', fontSize: '12px', flex: 1 }}
              required
            />
            <button type="submit" className="btn-primary" style={{ width: '38px', height: '38px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }} title="Tambah Departemen">
              <ion-icon name="add-outline" style={{ fontSize: '20px' }}></ion-icon>
            </button>
          </form>

          {/* List View Departemen */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
            {store.departmentsList && store.departmentsList.map(dept => {
              const isSelected = activeDept === dept;
              const countJobs = store.rolesList ? store.rolesList.filter(r => r.department === dept).length : 0;
              
              return (
                <div 
                  key={dept} 
                  onClick={() => setActiveDept(dept)}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px 16px', 
                    border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)', 
                    borderRadius: '8px', 
                    backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-gray-50)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 4px rgba(15, 118, 110, 0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ion-icon name={isSelected ? "folder-open-outline" : "folder-outline"} style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-gray-400)', fontSize: '18px' }}></ion-icon>
                    <span style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 600, color: isSelected ? 'var(--color-primary)' : 'var(--text-main)' }}>
                      {dept}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '10px', backgroundColor: isSelected ? 'rgba(15, 118, 110, 0.2)' : 'var(--color-gray-200)', color: isSelected ? 'var(--color-primary)' : 'var(--color-gray-600)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                      {countJobs} Jabatan
                    </span>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation(); // Mencegah memicu onClick item list
                        if (confirm(`Apakah Anda yakin ingin menghapus departemen "${dept}"?\n\nPERINGATAN: Semua sub-jabatan di bawah departemen ini juga akan ikut dihapus secara otomatis!`)) {
                          store.removeDepartment(dept);
                          if (activeDept === dept) {
                            setActiveDept(store.departmentsList.find(d => d !== dept) || '');
                          }
                          showToast(`Departemen ${dept} berhasil dihapus.`);
                        }
                      }}
                      style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                      title="Hapus Departemen"
                    >
                      <ion-icon name="trash-outline" style={{ fontSize: '16px' }}></ion-icon>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL KANAN: Detail & Sub-Jabatan Terkait */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeDept ? (
            <>
              {/* Header Info Departemen Terpilih */}
              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '4px' }}>Departemen Terpilih</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: '6px 0 2px 0' }}>
                  {activeDept}
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>Kelola jabatan spesifik yang bernaung di bawah divisi ini.</p>
              </div>

              {/* Form Tambah Jabatan ke Departemen Aktif */}
              <form onSubmit={handleAddRole} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={`Tambah jabatan baru untuk ${activeDept}...`} 
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  style={{ height: '38px', fontSize: '12px', flex: 1 }}
                  required
                />
                <button type="submit" className="btn-primary" style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '0 14px', fontSize: '12px', fontWeight: 700 }}>
                  <ion-icon name="add-outline" style={{ fontSize: '18px' }}></ion-icon>
                  <span>Tambah</span>
                </button>
              </form>

              {/* List Jabatan dalam Departemen Aktif */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Daftar Jabatan Aktif:</span>
                {rolesInActiveDept.length > 0 ? (
                  rolesInActiveDept.map(role => (
                    <div 
                      key={role.name} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '10px 14px', 
                        border: '1px solid var(--color-border)', 
                        borderRadius: '8px', 
                        backgroundColor: 'white',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-main)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ion-icon name="ribbon-outline" style={{ color: 'var(--color-primary)' }}></ion-icon>
                        <span>{role.name}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin menghapus jabatan "${role.name}" di departemen "${activeDept}"?`)) {
                            store.removeRole(role.name);
                            showToast(`Jabatan ${role.name} berhasil dihapus.`);
                          }
                        }}
                        style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                        title="Hapus Jabatan"
                      >
                        <ion-icon name="close-circle-outline" style={{ fontSize: '16px' }}></ion-icon>
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '32px 0', border: '1px dashed var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-gray-50)' }}>
                    <p style={{ fontStyle: 'italic', color: 'var(--color-gray-400)', fontSize: '11px', margin: 0 }}>Belum ada jabatan yang ditambahkan untuk departemen ini.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '8px', color: 'var(--color-gray-400)' }}>
              <ion-icon name="folder-open-outline" style={{ fontSize: '48px' }}></ion-icon>
              <p style={{ fontStyle: 'italic', fontSize: '12px', margin: 0 }}>Pilih salah satu departemen di panel kiri untuk melihat daftar jabatannya.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
