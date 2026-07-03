import React from 'react';

export default function PayrollComponentsView({ store }) {
  const components = [
    { name: 'Gaji Pokok (Basic Salary)', type: 'Penerimaan (+)', calculation: 'Nominal Dasar Tetap Kontrak Karyawan', status: 'Wajib', desc: 'Acuan dasar perhitungan tunjangan dan potongan BPJS.' },
    { name: 'Tunjangan Jabatan', type: 'Penerimaan (+)', calculation: '8% dari Gaji Pokok', status: 'Dinamis', desc: 'Diberikan sebagai kompensasi atas level tanggung jawab posisi.' },
    { name: 'Tunjangan Transportasi & Makan', type: 'Penerimaan (+)', calculation: '5% dari Gaji Pokok', status: 'Dinamis', desc: 'Tunjangan operasional harian kehadiran karyawan.' },
    { name: 'Pajak Penghasilan (PPh 21)', type: 'Potongan (-)', calculation: '3% dari Gaji Pokok', status: 'Wajib Pajak', desc: 'Potongan pajak penghasilan karyawan disetorkan langsung ke kas negara.' },
    { name: 'Potongan Kasbon (Pinjaman)', type: 'Potongan (-)', calculation: 'Nominal Cicilan Bulanan Karyawan', status: 'Opsional', desc: 'Pemotongan gaji otomatis jika karyawan memiliki hutang kasbon aktif.' },
    { name: 'BPJS Ketenagakerjaan (ESS)', type: 'Potongan (-)', calculation: '1% ditanggung karyawan, 4% perusahaan', status: 'Wajib', desc: 'Jaminan Hari Tua (JHT), Kecelakaan Kerja (JKK), dan Kematian (JKM).' },
    { name: 'BPJS Kesehatan (ESS)', type: 'Potongan (-)', calculation: '1% ditanggung karyawan, 4% perusahaan', status: 'Wajib', desc: 'Jaminan pemeliharaan kesehatan bagi karyawan dan keluarga inti.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title & Description Header */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Komponen Gaji & Parameter Finansial</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Daftar parameter kalkulasi tunjangan, potongan pajak, serta BPJS kesehatan/ketenagakerjaan yang dikonfigurasi di Panorama HR.</p>
        </div>
        <div style={{ fontSize: '32px', color: 'var(--color-primary)' }}>
          <ion-icon name="calculator-outline"></ion-icon>
        </div>
      </div>

      {/* Main Components Grid */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
          <h3 className="chart-title" style={{ fontSize: '14px', margin: 0 }}>Rincian Komponen Perhitungan Payroll</h3>
          <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700, backgroundColor: 'var(--color-primary-light)', padding: '4px 10px', borderRadius: '4px' }}>
            Regulasi Juli 2026
          </span>
        </div>

        <table className="custom-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th>Nama Komponen</th>
              <th>Tipe Parameter</th>
              <th>Metode Kalkulasi</th>
              <th>Status Berlaku</th>
              <th>Deskripsi Singkat</th>
            </tr>
          </thead>
          <tbody>
            {components.map((comp) => {
              const isEarning = comp.type.includes('Penerimaan');
              return (
                <tr key={comp.name}>
                  <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{comp.name}</td>
                  <td>
                    <span className={isEarning ? 'status-badge berhasil' : 'status-badge batal'} style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '12px' }}>
                      {comp.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{comp.calculation}</td>
                  <td>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: comp.status === 'Wajib' ? 'var(--color-primary)' : 'var(--text-secondary)' }}>
                      {comp.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-secondary)', maxWidth: '280px', lineHeight: '1.4' }}>{comp.desc}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
