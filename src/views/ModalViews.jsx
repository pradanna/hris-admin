import React, { useState } from 'react';
import { calculatePph21, getPtkpCategory, PTKP_OPTIONS } from '../utils/taxTer';

// Sub-component untuk panel data pajak karyawan (butuh useState, tidak boleh dalam IIFE)
function TaxPanel({ emp, store }) {
  const [localPtkp, setLocalPtkp] = useState(emp.ptkpStatus || 'TK/0');
  const [localNpwp, setLocalNpwp] = useState(emp.npwpNumber || '');
  const curCategory = getPtkpCategory(localPtkp);
  const catCol = { A: '#0369a1', B: '#7c3aed', C: '#be185d' }[curCategory] || '#0369a1';

  return (
    <div style={{ border: '1px solid #fbcfe8', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', backgroundColor: '#fce7f3', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ion-icon name="receipt-outline" style={{ fontSize: '16px', color: '#be185d' }}></ion-icon>
        <h5 style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#be185d' }}>2.5. Data Pajak &amp; PTKP (PPh 21)</h5>
      </div>
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '11px' }}>Status PTKP</label>
          <select
            className="form-input"
            value={localPtkp}
            onChange={e => setLocalPtkp(e.target.value)}
            style={{ height: '36px', fontSize: '12px' }}
          >
            {PTKP_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <p style={{ margin: '3px 0 0', fontSize: '10px', color: 'var(--text-secondary)' }}>
            Kategori TER: <strong style={{ color: catCol }}>Kategori {curCategory}</strong>
          </p>
        </div>
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '11px' }}>Nomor NPWP</label>
          <input
            type="text"
            className="form-input"
            value={localNpwp}
            onChange={e => setLocalNpwp(e.target.value)}
            placeholder="XX.XXX.XXX.X-XXX.XXX"
            style={{ height: '36px', fontSize: '12px' }}
          />
          <p style={{ margin: '3px 0 0', fontSize: '10px', color: localNpwp.trim() ? '#059669' : '#dc2626' }}>
            {localNpwp.trim() ? '✓ NPWP Valid — tarif normal' : '⚠ Tanpa NPWP — tarif +20%'}
          </p>
        </div>
      </div>
      <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          style={{ height: '30px', padding: '0 14px', background: '#be185d', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
          onClick={() => store.updateEmployeeProfile(emp.id, { ptkpStatus: localPtkp, npwpNumber: localNpwp })}
        >
          Simpan Data Pajak
        </button>
      </div>
    </div>
  );
}

// Sub-component untuk mengedit Profil Lengkap, Finansial, BPJS, & Kontak Darurat secara mandiri
function ProfileEditPanel({ emp, store, showToast }) {
  // Biodata Pribadi
  const [name, setName] = useState(emp.name || '');
  const [email, setEmail] = useState(emp.email || '');
  const [nikKtp, setNikKtp] = useState(emp.nikKtp || '');
  const [placeOfBirth, setPlaceOfBirth] = useState(emp.placeOfBirth || '');
  const [dateOfBirth, setDateOfBirth] = useState(emp.dateOfBirth || '');
  const [gender, setGender] = useState(emp.gender || 'Laki-laki');
  const [religion, setReligion] = useState(emp.religion || 'Islam');
  const [domicileAddress, setDomicileAddress] = useState(emp.domicileAddress || '');

  // Finansial, BPJS, & Kontak Darurat
  const [bankName, setBankName] = useState(emp.bankName || 'BCA');
  const [bankAccountNumber, setBankAccountNumber] = useState(emp.bankAccountNumber || '');
  const [bankAccountHolder, setBankAccountHolder] = useState(emp.bankAccountHolder || '');
  const [bpjsKesehatanNumber, setBpjsKesehatanNumber] = useState(emp.bpjsKesehatanNumber || '');
  const [bpjsNakerNumber, setBpjsNakerNumber] = useState(emp.bpjsNakerNumber || '');
  const [emergencyName, setEmergencyName] = useState(emp.emergencyName || '');
  const [emergencyRelation, setEmergencyRelation] = useState(emp.emergencyRelation || emp.emergencyRelationship || 'Orang Tua');
  const [emergencyPhone, setEmergencyPhone] = useState(emp.emergencyPhone || '');

  const handleSave = () => {
    if (!name.trim()) {
      alert('Nama Karyawan tidak boleh kosong!');
      return;
    }
    store.updateEmployeeProfile(emp.id, {
      name,
      email,
      nikKtp,
      placeOfBirth,
      dateOfBirth,
      gender,
      religion,
      domicileAddress,
      bankName,
      bankAccountNumber,
      bankAccountHolder,
      bpjsKesehatanNumber,
      bpjsNakerNumber,
      emergencyName,
      emergencyRelation,
      emergencyPhone
    });
    showToast('Profil Karyawan (Biodata, BPJS & Kontak Darurat) berhasil diperbarui.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Bagian 1: Biodata Karyawan */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ion-icon name="person-outline" style={{ fontSize: '16px', color: 'var(--color-primary)' }}></ion-icon>
          <h5 style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>2.5. Biodata Pribadi</h5>
        </div>
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>Nama Lengkap</label>
            <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} style={{ height: '36px', fontSize: '12px' }} placeholder="Budi Santoso" />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>Email Pribadi / Kerja</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} style={{ height: '36px', fontSize: '12px' }} placeholder="budi@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>NIK KTP (16 digit)</label>
            <input type="text" className="form-input" value={nikKtp} onChange={e => setNikKtp(e.target.value)} style={{ height: '36px', fontSize: '12px' }} placeholder="3201XXXXXXXXXXXX" maxLength={16} />
          </div>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '11px' }}>Tempat Lahir</label>
              <input type="text" className="form-input" value={placeOfBirth} onChange={e => setPlaceOfBirth(e.target.value)} style={{ height: '36px', fontSize: '12px' }} placeholder="Jakarta" />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '11px' }}>Tanggal Lahir</label>
              <input type="date" className="form-input" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} style={{ height: '36px', fontSize: '12px' }} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>Jenis Kelamin</label>
            <select className="form-input" value={gender} onChange={e => setGender(e.target.value)} style={{ height: '36px', fontSize: '12px' }}>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>Agama</label>
            <select className="form-input" value={religion} onChange={e => setReligion(e.target.value)} style={{ height: '36px', fontSize: '12px' }}>
              <option value="Islam">Islam</option>
              <option value="Kristen Protestan">Kristen Protestan</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Khonghucu">Khonghucu</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label" style={{ fontSize: '11px' }}>Alamat Domisili Sesuai KTP</label>
            <input type="text" className="form-input" value={domicileAddress} onChange={e => setDomicileAddress(e.target.value)} style={{ height: '36px', fontSize: '12px' }} placeholder="Jl. Kemang Raya No. 4" />
          </div>
        </div>
      </div>

      {/* Bagian 2: Rekening & BPJS */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ion-icon name="card-outline" style={{ fontSize: '16px', color: 'var(--color-primary)' }}></ion-icon>
          <h5 style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>2.6. BPJS &amp; Rekening Bank</h5>
        </div>
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '11px' }}>Bank</label>
              <select className="form-input" value={bankName} onChange={e => setBankName(e.target.value)} style={{ height: '36px', fontSize: '12px' }}>
                <option value="BCA">BCA</option>
                <option value="Mandiri">Mandiri</option>
                <option value="BNI">BNI</option>
                <option value="BRI">BRI</option>
                <option value="BSI">BSI</option>
              </select>
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '11px' }}>No. Rekening</label>
              <input type="text" className="form-input" value={bankAccountNumber} onChange={e => setBankAccountNumber(e.target.value)} style={{ height: '36px', fontSize: '12px' }} placeholder="1234567890" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>Pemilik Rekening</label>
            <input type="text" className="form-input" value={bankAccountHolder} onChange={e => setBankAccountHolder(e.target.value)} style={{ height: '36px', fontSize: '12px' }} placeholder="Nama Sesuai Buku Tabungan" />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>No. BPJS Kesehatan</label>
            <input type="text" className="form-input" value={bpjsKesehatanNumber} onChange={e => setBpjsKesehatanNumber(e.target.value)} style={{ height: '36px', fontSize: '12px' }} placeholder="000XXXXXXXXXX" />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>No. BPJS Ketenagakerjaan</label>
            <input type="text" className="form-input" value={bpjsNakerNumber} onChange={e => setBpjsNakerNumber(e.target.value)} style={{ height: '36px', fontSize: '12px' }} placeholder="190XXXXXXXXXX" />
          </div>
        </div>
      </div>

      {/* Bagian 3: Kontak Darurat */}
      <div style={{ border: '1px solid #fee2e2', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ion-icon name="call-outline" style={{ fontSize: '16px', color: '#ef4444' }}></ion-icon>
          <h5 style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>2.7. Kontak Darurat</h5>
        </div>
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>Nama Kontak Darurat</label>
            <input type="text" className="form-input" value={emergencyName} onChange={e => setEmergencyName(e.target.value)} style={{ height: '36px', fontSize: '12px' }} placeholder="Nama Kerabat" />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>Hubungan</label>
            <select className="form-input" value={emergencyRelation} onChange={e => setEmergencyRelation(e.target.value)} style={{ height: '36px', fontSize: '12px' }}>
              <option value="Orang Tua">Orang Tua</option>
              <option value="Suami / Istri">Suami / Istri</option>
              <option value="Saudara Kandung">Saudara Kandung</option>
              <option value="Anak">Anak</option>
              <option value="Kerabat Lain">Kerabat Lain</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px' }}>No. Telepon Darurat</label>
            <input type="text" className="form-input" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} style={{ height: '36px', fontSize: '12px' }} placeholder="08XXXXXXXXXX" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px', marginBottom: '8px' }}>
        <button
          style={{ height: '32px', padding: '0 16px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}
          onClick={handleSave}
        >
          <ion-icon name="save-outline"></ion-icon>
          <span>Simpan Data Profil &amp; BPJS</span>
        </button>
      </div>
    </div>
  );
}

export function ModalViews({
  store,
  activeModal,
  setActiveModal,
  selectedReqId,
  setSelectedReqId,
  selectedEmpName,
  setSelectedEmpName,
  selectedEmpDetail,
  setSelectedEmpDetail,
  renewDecision,
  setRenewDecision,
  renewEffectiveDate,
  setRenewEffectiveDate,
  renewEndDate,
  setRenewEndDate,
  renewSalary,
  setRenewSalary,
  renewNotes,
  setRenewNotes,
  rejectReason,
  setRejectReason,
  showInlineRejectInput,
  setShowInlineRejectInput,
  manualAbsenIn,
  setManualAbsenIn,
  manualAbsenOut,
  setManualAbsenOut,
  manualAbsenReason,
  setManualAbsenReason,
  addEmpName,
  setAddEmpName,
  addEmpEmail,
  setAddEmpEmail,
  addEmpRole,
  setAddEmpRole,
  addEmpDiv,
  setAddEmpDiv,
  addEmpContract,
  setAddEmpContract,
  addEmpStartDate,
  setAddEmpStartDate,
  addEmpEndDate,
  setAddEmpEndDate,
  addEmpSalary,
  setAddEmpSalary,
  editSalaryValue,
  setEditSalaryValue,
  editSalaryJabatan,
  setEditSalaryJabatan,
  editSalaryTransport,
  setEditSalaryTransport,
  editSalaryKasbon,
  setEditSalaryKasbon,
  editSalaryEffectiveDate,
  setEditSalaryEffectiveDate,
  editSalaryReason,
  setEditSalaryReason,
  editSalaryNotes,
  setEditSalaryNotes,
  selectedEmpId,
  setSelectedEmpId,
  currentUserRole,
  handleDirectApprove,
  showToast,
  inviteRole,
  setInviteRole,
  inviteDiv,
  setInviteDiv,
  inviteContract,
  setInviteContract,
  inviteStartDate,
  setInviteStartDate,
  magicLink,
  setMagicLink
}) {
  if (!activeModal) return null;

  const req = store.pendingRequests.find(r => r.id === selectedReqId) || {};
  const emp = store.employees.find(e => e.id === selectedEmpId) || {};

  return (
    <>
      {/* Renew/Follow-up Contract Modal */}
      {activeModal === 'renew' && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ width: '500px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'white', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ion-icon name="create-outline" style={{ color: 'var(--color-primary)' }}></ion-icon>
              <span>Tindak Lanjuti Kontrak Karyawan</span>
            </h3>

            <div style={{ backgroundColor: 'var(--color-gray-50)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px', marginBottom: '8px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{selectedEmpName}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{selectedEmpDetail}</p>
            </div>

            <div className="form-group">
              <label className="form-label">Keputusan Kontrak</label>
              <select className="form-input" value={renewDecision} onChange={(e) => setRenewDecision(e.target.value)}>
                <option value="convert">Angkat Karyawan Tetap (PKWTT)</option>
                <option value="extend">Perpanjang Kontrak (PKWT Baru)</option>
                <option value="terminate">Selesaikan Kontrak (Selesai / Putus)</option>
              </select>
            </div>

            {renewDecision === 'extend' && (
              <div className="form-group">
                <label className="form-label">Tanggal Berakhir Kontrak Baru</label>
                <input type="date" className="form-input" value={renewEndDate} onChange={(e) => setRenewEndDate(e.target.value)} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Catatan / Evaluasi Kinerja (Opsional)</label>
              <textarea className="form-input" value={renewNotes} onChange={(e) => setRenewNotes(e.target.value)} placeholder="Tulis evaluasi singkat..." style={{ height: '70px', resize: 'none' }}></textarea>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button className="pending-btn reject" onClick={() => setActiveModal(null)}>Batal</button>
              <button className="pending-btn approve" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }} onClick={() => {
                store.renewContract(selectedEmpName, renewDecision, renewEffectiveDate, renewEndDate, renewNotes);
                setActiveModal(null);
                showToast(`Keputusan kontrak untuk ${selectedEmpName} berhasil disimpan.`);
              }}>
                Simpan Keputusan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Request Modal */}
      {activeModal === 'reject' && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 1001, justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ width: '450px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'white' }}>
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)' }}>
              <ion-icon name="close-circle-outline" style={{ fontSize: '22px' }}></ion-icon>
              <span>Tolak Pengajuan</span>
            </h3>

            <div style={{ backgroundColor: 'var(--color-gray-50)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{req.name}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Pengajuan: {req.type}</p>
            </div>

            <div className="form-group">
              <label className="form-label">Alasan Penolakan (Wajib)</label>
              <textarea className="form-input" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Tulis alasan penolakan secara jelas..." style={{ height: '100px', resize: 'none' }} required></textarea>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="pending-btn reject" onClick={() => setActiveModal(null)}>Batal</button>
              <button className="pending-btn approve" style={{ backgroundColor: 'var(--color-danger)', color: 'white' }} onClick={() => {
                if (!rejectReason.trim()) { alert('Alasan penolakan wajib diisi!'); return; }
                store.rejectRequest(selectedReqId, rejectReason);
                setActiveModal(null);
                showToast(`Pengajuan untuk ${req.name} berhasil ditolak.`, 'error');
              }}>
                Tolak Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Request Modal */}
      {activeModal === 'detail' && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 1003, justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ width: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ion-icon name="document-text-outline" style={{ color: 'var(--color-primary)', fontSize: '24px' }}></ion-icon>
                <h3 className="chart-title" style={{ margin: 0 }}>Detail Berkas & Persetujuan Karyawan</h3>
              </div>
              <button className="action-icon-btn" onClick={() => setActiveModal(null)} title="Tutup Modal">
                <ion-icon name="close-outline" style={{ fontSize: '24px' }}></ion-icon>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>{req.name}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{req.role}</p>
              </div>
              <span className={`pending-tag ${req.tagClass}`} style={{ marginLeft: 'auto', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>{req.type}</span>
            </div>

            <div>
              <label className="form-label" style={{ color: 'var(--color-gray-500)', fontSize: '11px', fontWeight: 600 }}>Keterangan Pengajuan</label>
              <p style={{ fontSize: '12px', color: 'var(--text-main)', fontStyle: 'italic', backgroundColor: 'var(--color-gray-50)', padding: '12px 16px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-primary)', marginTop: '6px', margin: 0 }}>
                {req.reason}
              </p>
            </div>

            {req.type === 'Pendaftaran Mandiri' && (
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Section 1: Profil Pribadi & Legal */}
                <div>
                  <h5 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>1. Profil Pribadi & Legal</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '12px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>NIK KTP</label>
                      <input type="text" className="form-input" value={req.nikKtp || '320102**********'} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Tempat & Tanggal Lahir</label>
                      <input type="text" className="form-input" value={`${req.placeOfBirth || 'Jakarta'}, ${req.dateOfBirth || '1995-01-01'}`} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Jenis Kelamin / Agama</label>
                      <input type="text" className="form-input" value={`${req.gender || 'Laki-laki'} / ${req.religion || 'Islam'}`} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Email Pribadi</label>
                      <input type="text" className="form-input" value={req.email || '-'} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Alamat Domisili</label>
                      <input type="text" className="form-input" value={req.domicileAddress || 'Jl. Raya No. 10, Jakarta'} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                  </div>
                </div>

                {/* Section 2: Finansial & BPJS */}
                <div>
                  <h5 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>2. Finansial & BPJS</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '12px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Nama Bank & Rekening</label>
                      <input type="text" className="form-input" value={`${req.bankName || 'BCA'} - ${req.bankAccountNumber || '5220******'}`} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Nama Pemilik Rekening</label>
                      <input type="text" className="form-input" value={req.bankAccountHolder || req.name} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>NPWP / Status PTKP</label>
                      <input type="text" className="form-input" value={`${req.npwpNumber || '-'} / ${req.ptkpStatus || 'TK/0'}`} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 3' }}>
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>BPJS Kesehatan & Ketenagakerjaan</label>
                      <input type="text" className="form-input" value={`Kesehatan: ${req.bpjsKesehatanNumber || '-'}  |  Ketenagakerjaan: ${req.bpjsNakerNumber || '-'}`} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                  </div>
                </div>

                {/* Section 3: Struktur Jabatan & Kontak Darurat */}
                <div>
                  <h5 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>3. Kepegawaian & Kontak Darurat</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '12px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Rencana Jabatan</label>
                      <input type="text" className="form-input" value={req.role || '-'} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Divisi / Tipe Kontrak</label>
                      <input type="text" className="form-input" value={`${req.division || '-'} (${req.contractType || 'PKWT'})`} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Kontak Darurat (Hubungan)</label>
                      <input type="text" className="form-input" value={`${req.emergencyName || '-'} (${req.emergencyRelation || '-'})`} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 3' }}>
                      <label className="form-label" style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Nomor Handphone Darurat</label>
                      <input type="text" className="form-input" value={req.emergencyPhone || '-'} readOnly style={{ height: '36px', fontSize: '12px', backgroundColor: '#F8FAFC', color: 'var(--text-main)', border: '1px solid #E2E8F0' }} />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--color-gray-500)', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', padding: '12px', borderRadius: 'var(--radius-sm)', lineHeight: '1.4' }}>
                  <strong>Catatan Sistem:</strong> Foto biometrik belum diunggah. Karyawan akan mengisi foto mandiri setelah akun diaktifkan. Gaji pokok wajib ditentukan oleh admin saat menyetujui pendaftaran ini.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', justifyContent: 'flex-end' }}>
              <button className="pending-btn reject" onClick={() => { setRejectReason(''); setActiveModal('reject'); }} style={{ width: '160px', height: '40px', margin: 0, fontSize: '13px', fontWeight: 700 }}>Tolak Pengajuan</button>
              <button className="pending-btn approve" style={{ width: '160px', height: '40px', margin: 0, fontSize: '13px', fontWeight: 700, backgroundColor: 'var(--color-primary)', color: 'white' }} onClick={() => handleDirectApprove(req.id)}>Setujui Pengajuan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail & Persetujuan Pengajuan (Cuti / Izin / Lembur / Tugas Keluar) */}
      {activeModal === 'leave_detail' && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 1003, justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ width: '950px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: 'white', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ion-icon name="document-text-outline" style={{ color: 'var(--color-primary)', fontSize: '24px' }}></ion-icon>
                <h3 className="chart-title" style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Detail Berkas & Persetujuan Pengajuan</h3>
              </div>
              <button className="action-icon-btn" onClick={() => { setActiveModal(null); setShowInlineRejectInput(false); setRejectReason(''); }} title="Tutup Modal" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <ion-icon name="close-outline" style={{ fontSize: '24px', color: 'var(--color-gray-400)' }}></ion-icon>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: req.attachment ? '1.2fr 1fr' : '1fr', gap: '28px' }}>
              {/* Sisi Kiri: Pratinjau (Preview) Foto Surat Dokter / Berkas Izin */}
              {req.attachment && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="form-label" style={{ color: 'var(--color-gray-500)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dokumen / Lampiran Bukti Fisik</label>
                  <div style={{ border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--color-gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '380px', padding: '10px' }}>
                    <img 
                      src={req.attachment} 
                      alt="Lampiran Surat Dokter / Bukti Izin" 
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} 
                    />
                  </div>
                </div>
              )}

              {/* Sisi Kanan: Ringkasan Data Pengajuan */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ backgroundColor: 'var(--color-gray-50)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-main)' }}>{req.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 600 }}>{req.role}</div>
                  <span className={`pending-tag ${req.tagClass || 'leave'}`} style={{ display: 'inline-block', marginTop: '10px', fontSize: '11px', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                    {req.type}
                  </span>
                </div>

                {/* Durasi & Jatah Saldo Grid (Customized by Tab Type) */}
                {(() => {
                  const isCutiSakit = req.type === 'Cuti Sakit';
                  const isCutiTahunan = req.type.includes('Cuti') && !isCutiSakit;

                  if (isCutiTahunan) {
                    const matchDays = req.duration ? req.duration.match(/(\d+)\s*Hari/) : null;
                    const durationDays = matchDays ? parseInt(matchDays[1], 10) : 0;
                    const estimatedBalance = req.leaveBalance - durationDays;

                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--color-gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Durasi Cuti</label>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>{req.duration || '-'}</div>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--color-gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saldo Sebelum Cuti</label>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>{req.leaveBalance} Hari</div>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--color-gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimasi Saldo Akhir</label>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: estimatedBalance < 0 ? '#DC2626' : '#10B981', marginTop: '4px' }}>
                            {estimatedBalance} Hari
                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'normal', display: 'block', marginTop: '1px' }}>
                              ({req.leaveBalance} - {durationDays} hari)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (isCutiSakit || req.type.includes('Izin')) {
                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--color-gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Durasi & Tanggal Izin</label>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>{req.duration || '-'}</div>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--color-gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Sakit / Izin Tahun Ini</label>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#D97706', marginTop: '4px' }}>3 Hari <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>(Tidak memotong Cuti Tahunan)</span></div>
                        </div>
                      </div>
                    );
                  }

                  if (req.type === 'Lembur') {
                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--color-gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Durasi Lembur</label>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>{req.duration || '-'}</div>
                        </div>
                        <div>
                          <label style={{ fontSize: '11px', color: 'var(--color-gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimasi Upah Lembur</label>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>Rp 150.000 <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>(Simulasi hitung upah per jam)</span></div>
                        </div>
                      </div>
                    );
                  }

                  if (req.type === 'Tukar Shift' && req.details) {
                    const fromEmp = store.employees.find(e => e.id === req.details.fromEmpId) || {};
                    const toEmp = store.employees.find(e => e.id === req.details.toEmpId) || {};
                    const fromShiftConf = store.shiftMaster?.find(s => s.code === req.details.fromShift) || {};
                    const toShiftConf = store.shiftMaster?.find(s => s.code === req.details.toShift) || {};
                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: '#faf5ff', padding: '14px', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
                        <div>
                          <label style={{ fontSize: '10px', color: '#7c3aed', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dari Pengaju</label>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                            {fromEmp.name} (Tgl {req.details.day} Juli)
                          </div>
                          <span style={{ fontSize: '11px', display: 'inline-block', marginTop: '4px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: fromShiftConf.bg || '#f1f5f9', color: fromShiftConf.color || '#64748b' }}>
                            Shift {req.details.fromShift} ({fromShiftConf.start} - {fromShiftConf.end})
                          </span>
                        </div>
                        <div>
                          <label style={{ fontSize: '10px', color: '#7c3aed', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ditukar Dengan</label>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                            {toEmp.name} (Tgl {req.details.day} Juli)
                          </div>
                          <span style={{ fontSize: '11px', display: 'inline-block', marginTop: '4px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', backgroundColor: toShiftConf.bg || '#f1f5f9', color: toShiftConf.color || '#64748b' }}>
                            Shift {req.details.toShift} ({toShiftConf.start} - {toShiftConf.end})
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Tugas Keluar / Dinas
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--color-gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Durasi Penugasan</label>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>{req.duration || '-'}</div>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--color-gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Uang Saku Dinas</label>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>Rp 250.000 <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>(Simulasi allowance perjalanan dinas)</span></div>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--color-gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Keterangan / Alasan Karyawan</label>
                  <p style={{ fontSize: '12px', color: 'var(--text-main)', backgroundColor: 'var(--color-gray-50)', padding: '12px 14px', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)', marginTop: '6px', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                    "{req.reason}"
                  </p>
                </div>

                {req.status !== 'Pending' && (
                  <div style={{ marginTop: '8px', padding: '14px', borderRadius: '10px', backgroundColor: req.status === 'Approved' ? '#ECFDF5' : '#FEF2F2', border: `1px solid ${req.status === 'Approved' ? '#A7F3D0' : '#FECACA'}` }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: req.status === 'Approved' ? '#10B981' : '#DC2626', display: 'block' }}>
                      Status Keputusan: {req.status === 'Approved' ? 'DISETUJUI' : 'DITOLAK'}
                    </span>
                    {req.rejectReason && (
                      <p style={{ fontSize: '11px', color: '#DC2626', margin: '6px 0 0 0', fontWeight: 600 }}>Alasan Penolakan: "{req.rejectReason}"</p>
                    )}
                  </div>
                )}

                {/* Inline Rejection Reason Field */}
                {showInlineRejectInput && req.status === 'Pending' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#FEF2F2', padding: '16px', borderRadius: '12px', border: '1px solid #FECACA', animation: 'fadeIn 0.2s ease-in' }}>
                    <label style={{ fontSize: '11px', color: '#DC2626', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alasan Penolakan (Wajib Diisi)</label>
                    <textarea
                      placeholder="Masukkan alasan penolakan secara jelas..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #FCA5A5', fontSize: '12px', outline: 'none', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                      <button 
                        className="pending-btn" 
                        style={{ padding: '6px 12px', fontSize: '11px', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                        onClick={() => { setShowInlineRejectInput(false); setRejectReason(''); }}
                      >
                        Batal
                      </button>
                      <button 
                        className="pending-btn" 
                        disabled={!rejectReason.trim()}
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '11px', 
                          backgroundColor: '#DC2626', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: rejectReason.trim() ? 'pointer' : 'not-allowed', 
                          fontWeight: 700,
                          opacity: rejectReason.trim() ? 1 : 0.6
                        }}
                        onClick={() => {
                          store.rejectRequest(req.id, rejectReason);
                          setActiveModal(null);
                          setShowInlineRejectInput(false);
                          setRejectReason('');
                          showToast(`Pengajuan ${req.type} untuk ${req.name} telah ditolak.`);
                        }}
                      >
                        Konfirmasi Tolak
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {req.status === 'Pending' && !showInlineRejectInput && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', justifyContent: 'flex-end' }}>
                <button 
                  className="pending-btn reject" 
                  onClick={() => { setShowInlineRejectInput(true); }} 
                  style={{ width: '160px', height: '40px', margin: 0, fontSize: '13px', fontWeight: 700, border: '1px solid #DC2626', color: '#DC2626', background: 'white', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Tolak Pengajuan
                </button>
                <button 
                  className="pending-btn approve" 
                  style={{ width: '160px', height: '40px', margin: 0, fontSize: '13px', fontWeight: 700, backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }} 
                  onClick={() => {
                    store.approveRequest(req.id);
                    setActiveModal(null);
                    showToast(`Pengajuan ${req.type} untuk ${req.name} berhasil disetujui.`);
                  }}
                >
                  Setujui Pengajuan
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Absen Manual Modal */}
      {activeModal === 'absen_manual' && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 1003, justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ width: '460px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'white' }}>
            <h3 className="chart-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ion-icon name="time-outline" style={{ color: 'var(--color-primary)', fontSize: '22px' }}></ion-icon>
              <span>Input Absen Manual HR</span>
            </h3>

            <div style={{ backgroundColor: 'var(--color-gray-50)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px', marginTop: '8px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{selectedEmpName}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Penyelesaian Blocker Kehadiran</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Jam Masuk (Clock In)</label>
                <input type="time" className="form-input" value={manualAbsenIn} onChange={(e) => setManualAbsenIn(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Jam Keluar (Clock Out)</label>
                <input type="time" className="form-input" value={manualAbsenOut} onChange={(e) => setManualAbsenOut(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Alasan Penyesuaian Manual</label>
              <input type="text" className="form-input" value={manualAbsenReason} onChange={(e) => setManualAbsenReason(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button className="pending-btn reject" onClick={() => setActiveModal(null)}>Batal</button>
              <button className="pending-btn approve" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }} onClick={() => {
                store.resolveBlocker(selectedEmpName, 'absen_manual', `${manualAbsenIn} - ${manualAbsenOut}`);
                setActiveModal(null);
                showToast(`Koreksi kehadiran manual untuk ${selectedEmpName} berhasil disimpan.`);
              }}>
                Simpan Kehadiran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payslip Preview Modal */}
      {activeModal === 'payslip' && (() => {
        const empForPayslip = store.employees.find(e => e.name === selectedEmpName) || {};
        const salary = empForPayslip.salary || 6500000;
        const tunjanganJabatan = empForPayslip.tunjanganJabatan || Math.round(salary * 0.08);
        const tunjanganTransport = empForPayslip.tunjanganTransport || Math.round(salary * 0.05);
        const totalTunjangan = tunjanganJabatan + tunjanganTransport;
        const grossIncome = salary + totalTunjangan;
        const potonganKasbon = empForPayslip.potonganKasbon || 0;

        // BPJS karyawan
        const bpjsKes = Math.round(Math.min(grossIncome, 12000000) * 0.01);
        const bpjsJHT = Math.round(grossIncome * 0.02);
        const bpjsJP  = Math.round(Math.min(grossIncome, 9559600) * 0.01);
        const totalBpjs = bpjsKes + bpjsJHT + bpjsJP;

        // PPh 21 via TER (PMK 168/2023)
        const pphResult = calculatePph21(empForPayslip, grossIncome, 'gross');
        const pajakPph21 = pphResult.pphAmount;
        const ptkpCat = pphResult.category;
        const catColors = { A: { bg: '#e0f2fe', color: '#0369a1' }, B: { bg: '#f3e8ff', color: '#7c3aed' }, C: { bg: '#fce7f3', color: '#be185d' } };
        const catStyle = catColors[ptkpCat] || catColors.A;

        const totalPotongan = totalBpjs + potonganKasbon + pajakPph21;
        const netPay = grossIncome - totalPotongan;
        const isLocked = empForPayslip.isSalaryLocked || false;


        return (
          <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 1003, justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-card" style={{ width: '580px', padding: '32px', backgroundColor: 'white', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed var(--color-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)' }}>Panorama HR</h2>
                  <p style={{ fontSize: '11px', color: isLocked ? 'var(--color-success-text)' : 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: isLocked ? 700 : 'normal' }}>
                    <ion-icon name={isLocked ? "shield-checkmark-outline" : "document-text-outline"} style={{ fontSize: '14px' }}></ion-icon>
                    <span>{isLocked ? 'Slip Gaji Resmi (Terkunci & Diterbitkan)' : 'Slip Gaji Sementara (Draf Payroll)'}</span>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700 }}>Periode: Juli 2026</p>
                </div>
              </div>

              <p style={{ fontSize: '13px', marginBottom: '16px' }}><strong>Nama Karyawan:</strong> {empForPayslip.name} ({empForPayslip.role})</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-success)', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px', marginBottom: '8px' }}>PENERIMAAN (+)</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span>Gaji Pokok:</span>
                    <span>Rp {salary.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span>Tunjangan Jabatan:</span>
                    <span>Rp {tunjanganJabatan.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span>Tunjangan Transport:</span>
                    <span>Rp {tunjanganTransport.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-danger)', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px', marginBottom: '8px' }}>POTONGAN (-)</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    <span>BPJS Kesehatan (1%):</span>
                    <span>Rp {bpjsKes.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    <span>BPJS JHT (2%):</span>
                    <span>Rp {bpjsJHT.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px dashed var(--color-border)', color: 'var(--text-secondary)' }}>
                    <span>BPJS JP (1%):</span>
                    <span>Rp {bpjsJP.toLocaleString('id-ID')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      PPh 21
                      <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', backgroundColor: catStyle.bg, color: catStyle.color }}>
                        TER {ptkpCat} · {pphResult.terRatePercent}
                      </span>
                    </span>
                    <span>Rp {pajakPph21.toLocaleString('id-ID')}</span>
                  </div>
                  {pphResult.npwpPenalty && (
                    <div style={{ fontSize: '10px', color: '#b45309', backgroundColor: '#fef3c7', padding: '4px 8px', borderRadius: '4px', marginBottom: '6px' }}>
                      ⚠ Penalti 20% diterapkan (tidak memiliki NPWP)
                    </div>
                  )}
                  {potonganKasbon > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span>Potongan Kasbon:</span>
                      <span>Rp {potonganKasbon.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px dashed var(--color-border)', marginTop: '20px', paddingTop: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>Take Home Pay (Net):</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)' }}>Rp {netPay.toLocaleString('id-ID')}</span>
              </div>

              {isLocked && (
                <div style={{ marginTop: '16px', padding: '10px 12px', backgroundColor: 'var(--color-success-light)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ion-icon name="cloud-done-outline" style={{ color: 'var(--color-success-text)', fontSize: '18px' }}></ion-icon>
                  <span style={{ fontSize: '11px', color: 'var(--color-success-text)', fontWeight: 600 }}>Tersimpan aman di Cloud Database & dikirim ke portal ESS Karyawan.</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button 
                  className="btn-primary" 
                  style={{ 
                    width: 'auto', 
                    padding: '8px 16px', 
                    backgroundColor: '#1E293B', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '12px'
                  }} 
                  onClick={() => {
                    const hasNpwp = pphResult.hasNpwp;
                    const htmlContent = `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Slip Gaji - ${empForPayslip.name || ''}</title>
                          <style>
                            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; padding: 40px; line-height: 1.6; background-color: #f8fafc; }
                            .payslip-container { background: white; max-width: 800px; margin: 0 auto; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
                            .print-header-actions { max-width: 800px; margin: 0 auto 20px; display: flex; justify-content: space-between; align-items: center; background: #0f172a; padding: 12px 24px; border-radius: 8px; color: white; }
                            .print-btn { background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 13px; }
                            .print-btn:hover { background: #0369a1; }
                            .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 20px; margin-bottom: 20px; }
                            .company-name { font-size: 24px; font-weight: 800; color: #0284c7; margin: 0; }
                            .doc-title { font-size: 14px; color: #64748b; margin: 5px 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
                            .meta-table { width: 100%; margin-bottom: 30px; font-size: 14px; }
                            .meta-table td { padding: 6px 0; }
                            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
                            .section-title { font-size: 13px; font-weight: 800; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; }
                            .income-title { color: #16a34a; }
                            .deduction-title { color: #dc2626; }
                            .row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
                            .row.sub { color: #64748b; font-size: 12px; padding-left: 10px; }
                            .total-box { display: flex; justify-content: space-between; border-top: 2px dashed #cbd5e1; padding-top: 20px; margin-top: 20px; font-size: 16px; font-weight: 800; color: #0f172a; }
                            @media print {
                              body { background-color: white; padding: 0; }
                              .payslip-container { box-shadow: none; border: none; padding: 0; }
                              .print-header-actions { display: none; }
                            }
                          </style>
                        </head>
                        <body>
                          <div class="print-header-actions">
                            <span style="font-size: 14px; font-weight: 600;">Slip Gaji - Panorama HR</span>
                            <button class="print-btn" onclick="window.print()">Cetak / Simpan PDF</button>
                          </div>
                          
                          <div class="payslip-container">
                            <div class="header">
                              <h1 class="company-name">PANORAMA HR</h1>
                              <p class="doc-title">SLIP GAJI RESMI</p>
                            </div>
                            
                            <table class="meta-table">
                              <tr>
                                <td style="width: 15%"><strong>Nama</strong></td>
                                <td style="width: 35%">: ${empForPayslip.name || ''}</td>
                                <td style="width: 15%"><strong>Periode</strong></td>
                                <td style="width: 35%">: Juli 2026</td>
                              </tr>
                              <tr>
                                <td><strong>Jabatan</strong></td>
                                <td>: ${empForPayslip.role || ''}</td>
                                <td><strong>Kategori TER</strong></td>
                                <td>: Kategori ${ptkpCat} (${empForPayslip.ptkpStatus || 'TK/0'})</td>
                              </tr>
                              <tr>
                                <td><strong>Divisi</strong></td>
                                <td>: ${empForPayslip.division || '-'}</td>
                                <td><strong>Status NPWP</strong></td>
                                <td>: ${hasNpwp ? 'Memiliki NPWP' : 'Tidak Memiliki NPWP (Penalti 20%)'}</td>
                              </tr>
                            </table>

                            <div class="grid">
                              <div>
                                <h3 class="section-title income-title">PENERIMAAN (+)</h3>
                                <div class="row">
                                  <span>Gaji Pokok:</span>
                                  <span>Rp ${salary.toLocaleString('id-ID')}</span>
                                </div>
                                <div class="row">
                                  <span>Tunjangan Jabatan:</span>
                                  <span>Rp ${tunjanganJabatan.toLocaleString('id-ID')}</span>
                                </div>
                                <div class="row">
                                  <span>Tunjangan Transport:</span>
                                  <span>Rp ${tunjanganTransport.toLocaleString('id-ID')}</span>
                                </div>
                              </div>
                              
                              <div>
                                <h3 class="section-title deduction-title">POTONGAN (-)</h3>
                                <div class="row" style="font-weight: 600; margin-bottom: 2px;">
                                  <span>Iuran BPJS Kesehatan & Ketenagakerjaan:</span>
                                  <span>Rp ${totalBpjs.toLocaleString('id-ID')}</span>
                                </div>
                                <div class="row sub">
                                  <span>BPJS Kesehatan (1%):</span>
                                  <span>Rp ${bpjsKes.toLocaleString('id-ID')}</span>
                                </div>
                                <div class="row sub">
                                  <span>BPJS JHT (2%):</span>
                                  <span>Rp ${bpjsJHT.toLocaleString('id-ID')}</span>
                                </div>
                                <div class="row sub">
                                  <span>BPJS JP (1%):</span>
                                  <span>Rp ${bpjsJP.toLocaleString('id-ID')}</span>
                                </div>
                                <div class="row" style="margin-top: 10px; font-weight: 600;">
                                  <span>Pajak Penghasilan (PPh 21):</span>
                                  <span>Rp ${pajakPph21.toLocaleString('id-ID')}</span>
                                </div>
                                ${pphResult.npwpPenalty ? `
                                  <div class="row sub" style="color: #b45309;">
                                    <span>* Termasuk Penalti 20% tanpa NPWP</span>
                                  </div>
                                ` : ''}
                                ${potonganKasbon > 0 ? `
                                  <div class="row" style="margin-top: 10px;">
                                    <span>Potongan Kasbon:</span>
                                    <span>Rp ${potonganKasbon.toLocaleString('id-ID')}</span>
                                  </div>
                                ` : ''}
                              </div>
                            </div>

                            <div class="total-box">
                              <span>TAKE HOME PAY (NET):</span>
                              <span>Rp ${netPay.toLocaleString('id-ID')}</span>
                            </div>
                          </div>

                          <script>
                            setTimeout(function() {
                              window.print();
                            }, 500);
                          </script>
                        </body>
                      </html>
                    `;
                    const blob = new Blob([htmlContent], { type: 'text/html' });
                    const blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl, '_blank');
                  }}
                >
                  <ion-icon name="print-outline"></ion-icon>
                  <span>Cetak / PDF</span>
                </button>
                <button className="pending-btn reject" style={{ width: 'auto', padding: '8px 16px', margin: 0, borderRadius: '8px' }} onClick={() => setActiveModal(null)}>Tutup</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Employee Modal */}
      {activeModal === 'add_emp' && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 1000, justifyContent: 'center', alignItems: 'center', padding: '20px 0' }}>
          <div className="glass-card" style={{ width: '800px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'white', borderRadius: 'var(--radius-lg)', maxHeight: '95vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 className="chart-title" style={{ margin: 0 }}>Form Karyawan Baru</h3>
              <ion-icon name="close-outline" onClick={() => setActiveModal(null)} style={{ fontSize: '24px', cursor: 'pointer', color: 'var(--color-gray-400)' }}></ion-icon>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-light)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(15, 118, 110, 0.15)', lineHeight: '1.4', marginBottom: '8px' }}>
              <strong>Pendaftaran Awal (Quick Add):</strong> Setelah data disimpan, karyawan akan menerima email aktivasi untuk melengkapi berkas pribadi secara mandiri di portal ESS.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input type="text" className="form-input" value={addEmpName} onChange={(e) => setAddEmpName(e.target.value)} placeholder="Budi Santoso" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Kerja</label>
                  <input type="email" className="form-input" value={addEmpEmail} onChange={(e) => setAddEmpEmail(e.target.value)} placeholder="budi.s@karyamaterial.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Divisi</label>
                  <select 
                    className="form-input" 
                    value={addEmpDiv} 
                    onChange={(e) => {
                      const newDiv = e.target.value;
                      setAddEmpDiv(newDiv);
                      const matchingRoles = store.rolesList ? store.rolesList.filter(r => r.department === newDiv) : [];
                      if (matchingRoles.length > 0) {
                        setAddEmpRole(matchingRoles[0].name);
                      } else {
                        setAddEmpRole('');
                      }
                    }} 
                    style={{ height: '40px' }}
                  >
                    {store.departmentsList && store.departmentsList.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Jabatan (Role)</label>
                  <select className="form-input" value={addEmpRole} onChange={(e) => setAddEmpRole(e.target.value)} style={{ height: '40px' }}>
                    {store.rolesList && store.rolesList.filter(r => r.department === addEmpDiv).map(role => (
                      <option key={role.name} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Tipe Kontrak</label>
                  <select className="form-input" value={addEmpContract} onChange={(e) => setAddEmpContract(e.target.value)} style={{ height: '40px' }}>
                    <option value="PKWT">PKWT (Kontrak Kerja Waktu Tertentu)</option>
                    <option value="PKWTT">PKWTT (Karyawan Tetap)</option>
                    <option value="Harian">Harian Lepas</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal Mulai Kerja</label>
                  <input type="date" className="form-input" value={addEmpStartDate} onChange={(e) => setAddEmpStartDate(e.target.value)} />
                </div>
                {addEmpContract === 'PKWT' && (
                  <div className="form-group">
                    <label className="form-label">Tanggal Berakhir Kontrak</label>
                    <input type="date" className="form-input" value={addEmpEndDate} onChange={(e) => setAddEmpEndDate(e.target.value)} />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Gaji Pokok Awal (Gross Rupiah)</label>
                  <input type="number" className="form-input" value={addEmpSalary} onChange={(e) => setAddEmpSalary(e.target.value)} placeholder="6000000" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button className="pending-btn reject" onClick={() => setActiveModal(null)} style={{ width: '100px', height: '38px', margin: 0 }}>Batal</button>
              <button className="pending-btn approve" style={{ width: '160px', height: '38px', margin: 0, backgroundColor: 'var(--color-primary)', color: 'white' }} onClick={() => {
                if (!addEmpName.trim() || !addEmpEmail.trim()) { alert('Nama dan Email wajib diisi!'); return; }
                store.addEmployeeDirect(addEmpName, addEmpEmail, addEmpRole, addEmpDiv, addEmpContract, addEmpStartDate, addEmpEndDate, parseFloat(addEmpSalary) || 0);
                setActiveModal(null);
                showToast(`Karyawan ${addEmpName} berhasil ditambahkan.`);
              }}>
                Simpan & Aktifkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Employee (Magic Link) Modal */}
      {activeModal === 'invite_emp' && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ width: '520px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'white', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 className="chart-title" style={{ margin: 0 }}>Kirim Link Pendaftaran Mandiri</h3>
              <ion-icon name="close-outline" onClick={() => setActiveModal(null)} style={{ fontSize: '24px', cursor: 'pointer', color: 'var(--color-gray-400)' }}></ion-icon>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-light)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(15, 118, 110, 0.15)', lineHeight: '1.4' }}>
              <strong>Undangan Rekrutmen Mandiri:</strong> Tentukan rencana penempatan rekrutan. Tautan pendaftaran unik akan digenerate secara otomatis untuk dikirim ke email kandidat.
            </div>

            <div className="form-group">
              <label className="form-label">Divisi Penempatan & Tanggal Mulai</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <select 
                  className="form-input" 
                  value={inviteDiv} 
                  onChange={(e) => {
                    const newDiv = e.target.value;
                    setInviteDiv(newDiv);
                    const matchingRoles = store.rolesList ? store.rolesList.filter(r => r.department === newDiv) : [];
                    if (matchingRoles.length > 0) {
                      setInviteRole(matchingRoles[0].name);
                    } else {
                      setInviteRole('');
                    }
                  }} 
                  style={{ height: '40px' }}
                >
                  {store.departmentsList && store.departmentsList.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <input type="date" className="form-input" value={inviteStartDate} onChange={(e) => setInviteStartDate(e.target.value)} style={{ height: '40px' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Rencana Jabatan / Tipe Kontrak</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <select className="form-input" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{ height: '40px' }}>
                  {store.rolesList && store.rolesList.filter(r => r.department === inviteDiv).map(role => (
                    <option key={role.name} value={role.name}>{role.name}</option>
                  ))}
                </select>
                <select className="form-input" value={inviteContract} onChange={(e) => setInviteContract(e.target.value)} style={{ height: '40px' }}>
                  <option value="PKWT">PKWT (Kontrak)</option>
                  <option value="PKWTT">PKWTT (Tetap)</option>
                  <option value="Harian">Harian Lepas</option>
                </select>
              </div>
            </div>

            {magicLink && (
              <div className="form-group" style={{ backgroundColor: 'var(--color-bg)', padding: '12px', borderRadius: '8px', border: '1px dashed var(--color-primary)' }}>
                <label className="form-label" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Tautan Pendaftaran Unik (Salin Link):</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <input type="text" className="form-input" value={magicLink} readOnly style={{ flex: 1, fontSize: '11px', height: '36px', backgroundColor: 'white' }} />
                  <button 
                    className="btn-primary" 
                    style={{ height: '36px', padding: '0 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => {
                      navigator.clipboard.writeText(magicLink);
                      showToast('Tautan berhasil disalin ke clipboard!');
                    }}
                  >
                    <ion-icon name="copy-outline"></ion-icon>
                    <span>Salin</span>
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', justifyContent: 'flex-end' }}>
              <button className="pending-btn reject" onClick={() => setActiveModal(null)} style={{ width: '100px', height: '38px', margin: 0 }}>Batal</button>
              <button className="btn-primary" style={{ height: '38px', width: 'auto', padding: '0 20px' }} onClick={() => {
                const link = `http://localhost:3000/register?role=${encodeURIComponent(inviteRole)}&div=${encodeURIComponent(inviteDiv)}&contract=${inviteContract}&start=${inviteStartDate}&code=${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
                setMagicLink(link);
                showToast('Link Pendaftaran Mandiri berhasil digenerate.');
              }}>
                Generate Link Undangan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== EMPLOYEE DETAIL MODAL ===== */}
      {activeModal === 'emp_detail' && (() => {
        const statusColor = { 'Hadir': '#059669', 'Cuti Sakit': '#D97706', 'Alpha': '#DC2626', 'Terlambat': '#D97706' }[emp.status] || '#64748b';
        const ptkpCat = getPtkpCategory(emp.ptkpStatus || 'TK/0');
        const catColors = { A: { bg: '#e0f2fe', color: '#0369a1' }, B: { bg: '#f3e8ff', color: '#7c3aed' }, C: { bg: '#fce7f3', color: '#be185d' } };
        const catStyle = catColors[ptkpCat] || catColors.A;
        const hasNpwp = !!(emp.npwpNumber && emp.npwpNumber.trim() !== '' && emp.npwpNumber.trim() !== '-');

        const InfoRow = ({ label, value }) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
            <input 
              type="text" 
              className="form-input" 
              value={value || '-'} 
              readOnly 
              style={{ 
                backgroundColor: '#f8fafc', 
                color: 'var(--text-main)', 
                borderColor: '#e2e8f0', 
                cursor: 'default',
                fontSize: '12px',
                height: '36px',
                fontWeight: 500
              }} 
            />
          </div>
        );

        return (
          <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.45)', zIndex: 1003, justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ width: '780px', maxHeight: '92vh', overflowY: 'auto', backgroundColor: 'white', borderRadius: '18px', boxShadow: '0 25px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column' }}>

              {/* Header */}
              <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(135deg, #f0f9ff 0%, #fafafa 100%)' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--color-primary) 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 800, flexShrink: 0 }}>
                  {emp.name ? emp.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>{emp.name}</h2>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>{emp.role} · {emp.division} · {emp.branch || '-'}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', backgroundColor: '#e0f2fe', color: '#0369a1' }}>{emp.contractType || 'PKWT'}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', backgroundColor: '#dcfce7', color: '#15803d' }}>{emp.employeeStatus || 'Aktif'}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', backgroundColor: '#fef3c7', color: statusColor }}>{emp.status || 'Hadir'}</span>
                  </div>
                </div>
                <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                  <ion-icon name="close-outline" style={{ fontSize: '24px' }}></ion-icon>
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Section 1: Data Pribadi */}
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ion-icon name="person-outline" style={{ fontSize: '14px' }}></ion-icon>
                    Data Pribadi
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    <InfoRow label="ID Karyawan" value={emp.id} />
                    <InfoRow label="NIK / KTP" value={emp.nikKtp} />
                    <InfoRow label="Email" value={emp.email} />
                    <InfoRow label="Tempat Lahir" value={emp.placeOfBirth} />
                    <InfoRow label="Tanggal Lahir" value={emp.dateOfBirth} />
                    <InfoRow label="Jenis Kelamin" value={emp.gender} />
                    <InfoRow label="Agama" value={emp.religion} />
                    <div style={{ gridColumn: 'span 2' }}>
                      <InfoRow label="Alamat Domisili" value={emp.domicileAddress} />
                    </div>
                  </div>
                </div>

                {/* Section 2: Finansial & Bank */}
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: '#7c3aed', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ion-icon name="card-outline" style={{ fontSize: '14px' }}></ion-icon>
                    Finansial &amp; Rekening Bank
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    <InfoRow label="Gaji Pokok" value={emp.salary ? `Rp ${emp.salary.toLocaleString('id-ID')}` : '-'} />
                    <InfoRow label="Bank" value={emp.bankName} />
                    <InfoRow label="No. Rekening" value={emp.bankAccountNumber} />
                    <InfoRow label="Pemilik Rekening" value={emp.bankAccountHolder} />
                    <InfoRow label="No. BPJS Kesehatan" value={emp.bpjsKesehatanNumber} />
                    <InfoRow label="No. BPJS Ketenagakerjaan" value={emp.bpjsNakerNumber} />
                  </div>
                </div>

                {/* Section 3: Data Pajak */}
                <div style={{ border: '1px solid #fbcfe8', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', backgroundColor: '#fce7f3', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ion-icon name="receipt-outline" style={{ fontSize: '16px', color: '#be185d' }}></ion-icon>
                    <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#be185d' }}>Data Pajak (PPh 21)</h4>
                  </div>
                  <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '4px' }}>Status PTKP</span>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>{emp.ptkpStatus || 'TK/0'}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '4px' }}>Kategori TER</span>
                      <span style={{ fontSize: '13px', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', backgroundColor: catStyle.bg, color: catStyle.color }}>Kategori {ptkpCat}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '4px' }}>NPWP</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>{emp.npwpNumber || 'Tidak ada'}</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', backgroundColor: hasNpwp ? '#dcfce7' : '#fee2e2', color: hasNpwp ? '#15803d' : '#dc2626' }}>
                          {hasNpwp ? '✓ Valid' : '⚠ Penalti 20%'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Kontak Darurat */}
                {(emp.emergencyName || emp.emergencyPhone) && (
                  <div>
                    <h4 style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 700, color: '#dc2626', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ion-icon name="call-outline" style={{ fontSize: '14px' }}></ion-icon>
                      Kontak Darurat
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                      <InfoRow label="Nama" value={emp.emergencyName} />
                      <InfoRow label="Hubungan" value={emp.emergencyRelation} />
                      <InfoRow label="No. Telepon" value={emp.emergencyPhone} />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: '16px 28px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#fafafa' }}>
                <button
                  style={{ height: '36px', padding: '0 16px', background: 'none', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)', fontFamily: 'inherit' }}
                  onClick={() => setActiveModal(null)}
                >
                  Tutup
                </button>
                <button
                  style={{ height: '36px', padding: '0 18px', background: 'linear-gradient(135deg, var(--color-primary) 0%, #0369a1 100%)', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: 'white', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => {
                    setActiveModal('edit_salary');
                  }}
                >
                  <ion-icon name="create-outline" style={{ fontSize: '14px' }}></ion-icon>
                  Edit Gaji &amp; Pajak
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Edit Salary & Compensation Modal */}
      {activeModal === 'edit_salary' && (

        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ width: '700px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'white', borderRadius: '16px', maxHeight: '90vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '4px' }}>
              <h3 className="chart-title" style={{ margin: 0 }}>Ubah Data Gaji & Kompensasi</h3>
              <ion-icon name="close-outline" onClick={() => setActiveModal(null)} style={{ fontSize: '24px', cursor: 'pointer', color: 'var(--color-gray-400)' }}></ion-icon>
            </div>

            {/* Scrollable Form Body Container */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'var(--color-gray-50)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{emp.name}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Jabatan: {emp.role} • Divisi: {emp.division}</p>
              </div>

              {/* Part 1: Gaji & Tunjangan Inputs */}
              <div>
                <h5 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>1. Struktur Gaji Pokok & Tunjangan Tetap</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>Gaji Pokok Bulanan (Gross Rupiah)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={editSalaryValue} 
                      onChange={(e) => setEditSalaryValue(e.target.value)} 
                      placeholder="Contoh: 6500000" 
                      style={{ height: '36px', fontSize: '12px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>Tunjangan Jabatan (Rupiah)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={editSalaryJabatan} 
                      onChange={(e) => setEditSalaryJabatan(e.target.value)} 
                      placeholder="Contoh: 500000" 
                      style={{ height: '36px', fontSize: '12px' }}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Tunjangan Transport / Operasional (Rupiah)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={editSalaryTransport} 
                      onChange={(e) => setEditSalaryTransport(e.target.value)} 
                      placeholder="Contoh: 300000" 
                      style={{ height: '36px', fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Part 2: Audit Logs info / effective date */}
              <div>
                <h5 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>2. Pengesahan Perubahan & Tanggal Efektif</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>Tanggal Efektif Berlaku</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={editSalaryEffectiveDate} 
                      onChange={(e) => setEditSalaryEffectiveDate(e.target.value)} 
                      style={{ height: '36px', fontSize: '12px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>Alasan Penyesuaian Gaji</label>
                    <select 
                      className="form-input" 
                      value={editSalaryReason} 
                      onChange={(e) => setEditSalaryReason(e.target.value)} 
                      style={{ height: '36px', fontSize: '12px' }}
                    >
                      <option value="Set Gaji Awal">Set Gaji Awal (Karyawan Baru)</option>
                      <option value="Promosi Jabatan">Promosi Jabatan</option>
                      <option value="Penyesuaian Tahunan">Kenaikan / Penyesuaian Tahunan</option>
                      <option value="Koreksi Data Gaji">Koreksi Data / Input Salah</option>
                      <option value="Penurunan Jabatan">Penurunan Jabatan / Demosi</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Catatan / Keterangan Tambahan</label>
                    <textarea 
                      className="form-input" 
                      value={editSalaryNotes} 
                      onChange={(e) => setEditSalaryNotes(e.target.value)} 
                      placeholder="Tulis alasan penyesuaian evaluasi..." 
                      style={{ height: '60px', fontSize: '12px', resize: 'none', padding: '8px 12px' }}
                    />
                  </div>
                </div>
              </div>

              <TaxPanel emp={emp} store={store} />

              {/* Part 3: Change History Logs */}
              <div>
                <h5 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>3. Histori Perubahan Gaji &amp; Log Audit</h5>
                {emp.salaryHistory && emp.salaryHistory.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '130px', overflowY: 'auto', border: '1px solid var(--color-border)', padding: '12px', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                    {emp.salaryHistory.map((log, idx) => (
                      <div key={idx} style={{ fontSize: '11px', lineHeight: '1.4', borderBottom: idx < emp.salaryHistory.length - 1 ? '1px solid var(--color-border)' : 'none', paddingBottom: '8px', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--text-main)' }}>
                          <span style={{ color: 'var(--color-primary)' }}>{log.reason} (Efektif: {log.effectiveDate})</span>
                          <span style={{ color: 'var(--color-gray-400)' }}>{log.date}</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Gaji pokok diubah dari <strong>Rp {log.oldSalary.toLocaleString('id-ID')}</strong> menjadi <strong>Rp {log.newSalary.toLocaleString('id-ID')}</strong> oleh <strong>{log.changedBy}</strong>.
                        </div>
                        {log.notes && <div style={{ color: 'var(--color-gray-500)', fontStyle: 'italic', marginTop: '2px' }}>Catatan: "{log.notes}"</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '11px', color: 'var(--color-gray-400)', fontStyle: 'italic', margin: 0, padding: '4px 0' }}>Belum ada histori perubahan gaji (audit trail) untuk karyawan ini.</p>
                )}
              </div>
            </div>

            {/* Fixed Footer Buttons Container (Always visible at the bottom) */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '4px' }}>
              <button className="pending-btn reject" onClick={() => setActiveModal(null)} style={{ width: '100px', height: '38px', margin: 0 }}>Batal</button>
              <button 
                className="pending-btn approve" 
                style={{ width: '140px', height: '38px', margin: 0, backgroundColor: 'var(--color-primary)', color: 'white' }}
                onClick={() => {
                  const newSalary = parseFloat(editSalaryValue);
                  const newJabatan = parseFloat(editSalaryJabatan) || 0;
                  const newTransport = parseFloat(editSalaryTransport) || 0;
                  if (isNaN(newSalary) || newSalary <= 0) {
                    alert('Harap masukkan nominal gaji pokok yang valid!');
                    return;
                  }
                  store.updateEmployeeSalary(emp.id, {
                    salary: newSalary,
                    tunjanganJabatan: newJabatan,
                    tunjanganTransport: newTransport,
                    potonganKasbon: 0, // Ditetapkan ke 0/Dihapus
                    effectiveDate: editSalaryEffectiveDate,
                    reason: editSalaryReason,
                    notes: editSalaryNotes,
                    changedBy: currentUserRole
                  });
                  setActiveModal(null);
                  showToast(`Kompensasi ${emp.name} berhasil diperbarui.`);
                }}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile & Details Modal */}
      {activeModal === 'edit_profile' && (
        <div className="modal-backdrop" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-card" style={{ width: '700px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'white', borderRadius: '16px', maxHeight: '90vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '4px' }}>
              <h3 className="chart-title" style={{ margin: 0 }}>Ubah Profil Karyawan</h3>
              <ion-icon name="close-outline" onClick={() => setActiveModal(null)} style={{ fontSize: '24px', cursor: 'pointer', color: 'var(--color-gray-400)' }}></ion-icon>
            </div>

            {/* Scrollable Form Body Container */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: 'var(--color-gray-50)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{emp.name}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Jabatan: {emp.role} • Divisi: {emp.division}</p>
              </div>

              {/* Embed profile input blocks */}
              <ProfileEditPanel emp={emp} store={store} showToast={(msg) => {
                showToast(msg);
                setActiveModal(null);
              }} />
            </div>

            {/* Fixed Footer Buttons Container */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '4px' }}>
              <button className="pending-btn reject" onClick={() => setActiveModal(null)} style={{ width: '100px', height: '38px', margin: 0 }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
