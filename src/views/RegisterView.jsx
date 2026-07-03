import React, { useState } from 'react';

export default function RegisterView({ store, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nikKtp: '',
    placeOfBirth: '',
    dateOfBirth: '',
    gender: 'Laki-laki',
    religion: 'Islam',
    domicileAddress: '',
    bankName: 'BCA',
    bankAccount: '',
    ptkpStatus: 'TK/0',
    npwpNumber: '',
    emergencyName: '',
    emergencyRelationship: 'Orang Tua',
    emergencyPhone: ''
  });

  // Extract initial parameters from URL query string
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    const divParam = params.get('div');
    const contractParam = params.get('contract');
    const startParam = params.get('start');

    // pre-fill or validate magic link metadata if required
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.nikKtp) {
      showToast('Mohon lengkapi Nama, Email, dan NIK KTP!', 'error');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const role = params.get('role') || 'Staff Sales Counter';
    const division = params.get('div') || 'Sales & Marketing';
    const contractType = params.get('contract') || 'PKWT';
    const contractStartDate = params.get('start') || '2026-07-02';

    // Submit self-registration request
    store.addPendingRequest({
      id: Date.now(),
      name: formData.name,
      type: 'Pendaftaran Mandiri',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      details: `Role: ${role} | Divisi: ${division} | Kontrak: ${contractType} | Mulai: ${contractStartDate}`,
      payload: {
        ...formData,
        role,
        division,
        contractType,
        contractStartDate,
        employeeStatus: 'Aktif'
      }
    });

    showToast('Pendaftaran mandiri berhasil diajukan! Menunggu persetujuan HRD.');
    // Redirect or show success
    window.location.href = window.location.origin + window.location.pathname + '?registered=success';
  };

  const isSuccess = new URLSearchParams(window.location.search).get('registered') === 'success';

  if (isSuccess) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '80vh', padding: '24px', backgroundColor: 'var(--color-bg)'
      }}>
        <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '40px', textAlign: 'center', backgroundColor: 'white' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ecfdf5',
            color: '#10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', marginBottom: '20px'
          }}>
            <ion-icon name="checkmark-circle-outline"></ion-icon>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 10px' }}>Pendaftaran Berhasil!</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 24px' }}>
            Data diri Anda telah dikirimkan ke HRD. Silakan hubungi HRD atau tunggu pemberitahuan berikutnya untuk persetujuan akun Anda.
          </p>
          <button 
            className="btn-primary" 
            onClick={() => window.location.href = window.location.origin + window.location.pathname}
            style={{ width: '100%' }}
          >
            Kembali ke Halaman Utama
          </button>
        </div>
      </div>
    );
  }

  const params = new URLSearchParams(window.location.search);
  const targetRole = params.get('role') || 'Karyawan Baru';
  const targetDiv = params.get('div') || 'Panorama HR';

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', padding: '40px 20px', backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(at 0% 0%, hsla(186,100%,94%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(187,100%,92%,1) 0, transparent 50%)'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '750px', padding: '40px', backgroundColor: 'white', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>Portal Pendaftaran Mandiri</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Lengkapi data diri Anda untuk pengajuan akun karyawan baru di <strong>Panorama HR</strong>.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1' }}>
              Divisi: {targetDiv}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1' }}>
              Rencana Jabatan: {targetRole}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1: Data Pribadi */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              1. Biodata Pribadi
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required placeholder="Budi Santoso" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Pribadi</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} required placeholder="budi@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">NIK KTP (16 Digit)</label>
                <input type="text" className="form-input" name="nikKtp" value={formData.nikKtp} onChange={handleChange} required placeholder="320123XXXXXXXXXX" maxLength={16} />
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label className="form-label">Tempat Lahir</label>
                  <input type="text" className="form-input" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} placeholder="Jakarta" />
                </div>
                <div>
                  <label className="form-label">Tanggal Lahir</label>
                  <input type="date" className="form-input" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Jenis Kelamin</label>
                <select className="form-input" name="gender" value={formData.gender} onChange={handleChange} style={{ height: '40px' }}>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Agama</label>
                <select className="form-input" name="religion" value={formData.religion} onChange={handleChange} style={{ height: '40px' }}>
                  <option value="Islam">Islam</option>
                  <option value="Kristen Protestan">Kristen Protestan</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Khonghucu">Khonghucu</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Alamat Domisili Sesuai KTP</label>
                <input type="text" className="form-input" name="domicileAddress" value={formData.domicileAddress} onChange={handleChange} placeholder="Jl. Raya Kemerdekaan No. 12, Jakarta" />
              </div>
            </div>
          </div>

          {/* Section 2: Finansial & Pajak */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              2. Informasi Finansial & Perpajakan
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px' }}>
                <div>
                  <label className="form-label">Bank</label>
                  <select className="form-input" name="bankName" value={formData.bankName} onChange={handleChange} style={{ height: '40px' }}>
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BNI">BNI</option>
                    <option value="BRI">BRI</option>
                    <option value="BSI">BSI</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Nomor Rekening</label>
                  <input type="text" className="form-input" name="bankAccount" value={formData.bankAccount} onChange={handleChange} placeholder="1234567890" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status PTKP</label>
                <select className="form-input" name="ptkpStatus" value={formData.ptkpStatus} onChange={handleChange} style={{ height: '40px' }}>
                  <option value="TK/0">TK/0 (Tidak Kawin, Tanpa Tanggungan)</option>
                  <option value="TK/1">TK/1 (Tidak Kawin, 1 Tanggungan)</option>
                  <option value="TK/2">TK/2 (Tidak Kawin, 2 Tanggungan)</option>
                  <option value="TK/3">TK/3 (Tidak Kawin, 3 Tanggungan)</option>
                  <option value="K/0">K/0 (Kawin, Tanpa Tanggungan)</option>
                  <option value="K/1">K/1 (Kawin, 1 Tanggungan)</option>
                  <option value="K/2">K/2 (Kawin, 2 Tanggungan)</option>
                  <option value="K/3">K/3 (Kawin, 3 Tanggungan)</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Nomor NPWP (Opsional - Dikenakan Penalti Pajak 20% jika kosong)</label>
                <input type="text" className="form-input" name="npwpNumber" value={formData.npwpNumber} onChange={handleChange} placeholder="01.234.567.8-901.000" />
              </div>
            </div>
          </div>

          {/* Section 3: Kontak Darurat */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px' }}>
              3. Kontak Darurat (Emergency Contact)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Nama Kontak Darurat</label>
                <input type="text" className="form-input" name="emergencyName" value={formData.emergencyName} onChange={handleChange} required placeholder="Nama lengkap wali/kerabat" />
              </div>
              <div className="form-group">
                <label className="form-label">Hubungan</label>
                <select className="form-input" name="emergencyRelationship" value={formData.emergencyRelationship} onChange={handleChange} style={{ height: '40px' }}>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Suami / Istri">Suami / Istri</option>
                  <option value="Saudara Kandung">Saudara Kandung</option>
                  <option value="Anak">Anak</option>
                  <option value="Kerabat Lain">Kerabat Lain</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Nomor HP / Telepon Darurat</label>
                <input type="text" className="form-input" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} required placeholder="08XXXXXXXXXX" />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
            <button type="button" className="pending-btn reject" onClick={() => window.location.href = window.location.origin + window.location.pathname} style={{ width: '120px', height: '42px', margin: 0 }}>
              Batal
            </button>
            <button type="submit" className="btn-primary" style={{ height: '42px', padding: '0 30px' }}>
              Kirim Pendaftaran
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
