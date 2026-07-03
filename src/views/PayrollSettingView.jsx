import React, { useState } from 'react';
import { PTKP_OPTIONS } from '../utils/taxTer';

// Reusable section card wrapper
function SettingSection({ icon, title, subtitle, color = 'var(--color-primary)', children }) {
  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
      {/* Section Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '18px 24px',
        borderBottom: '1px solid var(--color-border)',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          backgroundColor: color, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'white', fontSize: '20px', flexShrink: 0
        }}>
          <ion-icon name={icon}></ion-icon>
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>{title}</h3>
          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{subtitle}</p>
        </div>
      </div>
      {/* Section Body */}
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  );
}

// Reusable field row
function FieldRow({ label, hint, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      gap: '24px', padding: '14px 0', borderBottom: '1px dashed var(--color-border)'
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{label}</p>
        {hint && <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{hint}</p>}
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
        {children}
      </div>
    </div>
  );
}

// Styled number input with suffix
function NumberInput({ value, onChange, suffix, prefix, min = 0, max, step = 0.1, width = '90px' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {prefix && <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{prefix}</span>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        style={{
          width, height: '34px', padding: '0 10px',
          border: '1.5px solid var(--color-border)',
          borderRadius: '7px', fontSize: '13px', fontWeight: 600,
          fontFamily: 'inherit', color: 'var(--text-main)',
          backgroundColor: 'white', textAlign: 'right',
          outline: 'none', transition: 'border-color 0.15s',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
      />
      {suffix && <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{suffix}</span>}
    </div>
  );
}

// Styled select input
function SelectInput({ value, onChange, options, width = '160px' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width, height: '34px', padding: '0 10px',
        border: '1.5px solid var(--color-border)',
        borderRadius: '7px', fontSize: '12px', fontWeight: 600,
        fontFamily: 'inherit', color: 'var(--text-main)',
        backgroundColor: 'white', cursor: 'pointer',
        outline: 'none',
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export default function PayrollSettingView({ showToast }) {
  // --- 1. BPJS State ---
  const [bpjsKesEmp, setBpjsKesEmp] = useState(1);
  const [bpjsKesCap, setBpjsKesCap] = useState(12000000);
  const [bpjsJHT, setBpjsJHT] = useState(2);
  const [bpjsJP, setBpjsJP] = useState(1);
  const [bpjsJPCap, setBpjsJPCap] = useState(9559600);

  // --- 2. Attendance Deduction State ---
  const [lateMode, setLateMode] = useState('flat'); // 'flat' | 'proportional'
  const [lateFlat, setLateFlat] = useState(5000);
  const [lateUnit, setLateUnit] = useState('kejadian'); // 'menit' | 'kejadian'
  const [alphaMode, setAlphaMode] = useState('prorate'); // 'prorate' | 'flat'
  const [alphaFlat, setAlphaFlat] = useState(150000);
  const [earlyMode, setEarlyMode] = useState('proportional'); // 'proportional' | 'flat'
  const [earlyFlat, setEarlyFlat] = useState(50000);

  // --- 3. Overtime State ---
  const [otWeekday1, setOtWeekday1] = useState(1.5);
  const [otWeekdayNext, setOtWeekdayNext] = useState(2);
  const [otHoliday, setOtHoliday] = useState(2);
  const [otHolidayLong, setOtHolidayLong] = useState(3);
  const [otDivisor, setOtDivisor] = useState(173);

  // --- 4. Cut-off State ---
  const [cutoffStart, setCutoffStart] = useState(21);
  const [cutoffEnd, setCutoffEnd] = useState(20);
  const [payday, setPayday] = useState(25);

  // --- 5. PPh 21 State ---
  const [pphActive, setPphActive] = useState(true);
  const [pphMethod, setPphMethod] = useState('gross'); // 'gross' | 'nett'

  const handleSave = () => {
    showToast && showToast('Pengaturan Payroll berhasil disimpan.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Page Header */}
      <div className="glass-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #0369a1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '22px', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
            }}>
              <ion-icon name="options-outline"></ion-icon>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Pengaturan Payroll
                </h2>
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px',
                  backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a'
                }}>
                  ⚠ Berlaku Global
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                Konfigurasi BPJS · Potongan Kehadiran · Pengali Lembur · Cut-off Periode
              </p>
            </div>
          </div>
          {/* Right: Save Button */}
          <button
            onClick={handleSave}
            style={{
              height: '38px', padding: '0 20px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #0369a1 100%)',
              color: 'white', border: 'none', borderRadius: '9px',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '7px',
              boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
              transition: 'opacity 0.15s, transform 0.15s'
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <ion-icon name="save-outline" style={{ fontSize: '16px' }}></ion-icon>
            Simpan Semua
          </button>
        </div>
      </div>

      {/* === SECTION 1: BPJS === */}
      <SettingSection
        icon="shield-checkmark-outline"
        title="Konfigurasi BPJS (Sesuai Regulasi Nasional)"
        subtitle="Persentase potongan berlaku menyeluruh untuk semua karyawan terdaftar"
        color="#0891b2"
      >
        <FieldRow
          label="BPJS Kesehatan — Potongan Karyawan"
          hint="Persentase gaji yang ditanggung karyawan. Batas atas gaji yang dipotong dapat dikonfigurasikan."
        >
          <NumberInput value={bpjsKesEmp} onChange={setBpjsKesEmp} suffix="%" min={0} max={10} step={0.5} width="70px" />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Batas gaji maks:</span>
          <NumberInput value={bpjsKesCap} onChange={setBpjsKesCap} prefix="Rp" suffix="" min={0} step={100000} width="120px" />
        </FieldRow>
        <FieldRow
          label="BPJS Ketenagakerjaan (JHT) — Potongan Karyawan"
          hint="Jaminan Hari Tua. Default 2% ditanggung karyawan; perusahaan menanggung 3.7%."
        >
          <NumberInput value={bpjsJHT} onChange={setBpjsJHT} suffix="%" min={0} max={10} step={0.5} width="70px" />
          <span style={{
            fontSize: '11px', color: 'var(--text-secondary)',
            backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px'
          }}>
            Perusahaan: 3.7%
          </span>
        </FieldRow>
        <FieldRow
          label="BPJS Ketenagakerjaan (JP) — Potongan Karyawan"
          hint="Jaminan Pensiun. Dipotong dari gaji hingga batas atas yang dikonfigurasi."
        >
          <NumberInput value={bpjsJP} onChange={setBpjsJP} suffix="%" min={0} max={5} step={0.5} width="70px" />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Batas gaji maks:</span>
          <NumberInput value={bpjsJPCap} onChange={setBpjsJPCap} prefix="Rp" suffix="" min={0} step={100000} width="120px" />
        </FieldRow>
      </SettingSection>

      {/* === SECTION 2: ATTENDANCE DEDUCTIONS === */}
      <SettingSection
        icon="alarm-outline"
        title="Aturan Potongan Kehadiran (Attendance Deductions)"
        subtitle="Konsekuensi finansial otomatis yang terhubung langsung dengan Laporan Kehadiran Global"
        color="#7c3aed"
      >
        {/* Late */}
        <FieldRow
          label="Potongan Keterlambatan (Late Cut)"
          hint="Pemotongan gaji jika karyawan terlambat. Pilih metode: nominal flat per kejadian/menit, atau proporsional upah per jam."
        >
          <SelectInput
            value={lateMode}
            onChange={setLateMode}
            options={[
              { value: 'flat', label: 'Nominal Flat' },
              { value: 'proportional', label: 'Proporsional / Jam' }
            ]}
            width="170px"
          />
          {lateMode === 'flat' && (
            <>
              <NumberInput value={lateFlat} onChange={setLateFlat} prefix="Rp" min={0} step={1000} width="100px" />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>per</span>
              <SelectInput
                value={lateUnit}
                onChange={setLateUnit}
                options={[
                  { value: 'kejadian', label: 'kejadian' },
                  { value: 'menit', label: 'menit' }
                ]}
                width="110px"
              />
            </>
          )}
          {lateMode === 'proportional' && (
            <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700, backgroundColor: '#f3e8ff', padding: '4px 10px', borderRadius: '6px' }}>
              Auto: (Gaji Pokok / 173) × Menit Terlambat / 60
            </span>
          )}
        </FieldRow>

        {/* Alpha */}
        <FieldRow
          label="Potongan Mangkir (Alpha Cut)"
          hint="Pemotongan gaji harian jika karyawan tidak masuk tanpa keterangan (Alpha)."
        >
          <SelectInput
            value={alphaMode}
            onChange={setAlphaMode}
            options={[
              { value: 'prorate', label: 'Prorate Harian' },
              { value: 'flat', label: 'Nominal Flat' }
            ]}
            width="170px"
          />
          {alphaMode === 'flat' && (
            <NumberInput value={alphaFlat} onChange={setAlphaFlat} prefix="Rp" min={0} step={10000} width="110px" />
          )}
          {alphaMode === 'prorate' && (
            <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700, backgroundColor: '#f3e8ff', padding: '4px 10px', borderRadius: '6px' }}>
              Auto: Gaji Pokok / HKE (Hari Kerja Efektif)
            </span>
          )}
        </FieldRow>

        {/* Early Out */}
        <FieldRow
          label="Potongan Pulang Cepat (Early Out)"
          hint="Pemotongan jika karyawan melakukan clock-out sebelum jam kerja resmi berakhir."
        >
          <SelectInput
            value={earlyMode}
            onChange={setEarlyMode}
            options={[
              { value: 'proportional', label: 'Proporsional / Jam' },
              { value: 'flat', label: 'Nominal Flat' }
            ]}
            width="170px"
          />
          {earlyMode === 'flat' && (
            <NumberInput value={earlyFlat} onChange={setEarlyFlat} prefix="Rp" min={0} step={5000} width="100px" />
          )}
          {earlyMode === 'proportional' && (
            <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700, backgroundColor: '#f3e8ff', padding: '4px 10px', borderRadius: '6px' }}>
              Auto: (Gaji Pokok / 173) × Menit Lebih Awal / 60
            </span>
          )}
        </FieldRow>
      </SettingSection>

      {/* === SECTION 3: OVERTIME === */}
      <SettingSection
        icon="trending-up-outline"
        title="Aturan Pengali Lembur (Overtime Multiplier)"
        subtitle="Perhitungan otomatis untuk pengajuan lembur yang telah disetujui di halaman Pengajuan"
        color="#d97706"
      >
        <FieldRow
          label="Pengali Hari Kerja — Jam Pertama"
          hint="Skala upah lembur di hari kerja biasa untuk jam pertama (Depnaker: 1.5×)."
        >
          <NumberInput value={otWeekday1} onChange={setOtWeekday1} suffix="× upah/jam" min={1} max={5} step={0.5} width="65px" />
        </FieldRow>
        <FieldRow
          label="Pengali Hari Kerja — Jam Berikutnya"
          hint="Skala upah lembur untuk jam kedua dan seterusnya di hari kerja biasa (Depnaker: 2×)."
        >
          <NumberInput value={otWeekdayNext} onChange={setOtWeekdayNext} suffix="× upah/jam" min={1} max={5} step={0.5} width="65px" />
        </FieldRow>
        <FieldRow
          label="Pengali Hari Libur / Akhir Pekan"
          hint="Skala upah lembur jika karyawan masuk di hari libur resmi atau akhir pekan."
        >
          <NumberInput value={otHoliday} onChange={setOtHoliday} suffix="× upah/jam" min={1} max={5} step={0.5} width="65px" />
        </FieldRow>
        <FieldRow
          label="Pengali Hari Libur Nasional Panjang"
          hint="Skala upah lembur jika karyawan masuk di hari libur nasional panjang (cuti bersama)."
        >
          <NumberInput value={otHolidayLong} onChange={setOtHolidayLong} suffix="× upah/jam" min={1} max={6} step={0.5} width="65px" />
        </FieldRow>
        <FieldRow
          label="Rumus Dasar Upah Lembur per Jam"
          hint="Formula pembagi standar (Default Kemnaker RI: Gaji Pokok ÷ 173). Ubah divisor jika perusahaan menggunakan standar berbeda."
        >
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>Gaji Pokok ÷</span>
          <NumberInput value={otDivisor} onChange={setOtDivisor} min={100} max={250} step={1} width="80px" />
          <span style={{ fontSize: '11px', color: '#d97706', fontWeight: 700, backgroundColor: '#fef3c7', padding: '4px 10px', borderRadius: '6px' }}>
            Standar Kemnaker RI
          </span>
        </FieldRow>
      </SettingSection>

      {/* === SECTION 4: CUT-OFF === */}
      <SettingSection
        icon="calendar-number-outline"
        title="Sistem Tanggal & Cut-off Periode"
        subtitle="Rentang waktu penarikan data performa absen dan jadwal pembayaran gaji karyawan"
        color="#059669"
      >
        <FieldRow
          label="Tanggal Cut-off Absensi — Mulai"
          hint="Data kehadiran ditarik mulai tanggal ini (bulan sebelumnya). Contoh: tanggal 21 bulan lalu."
        >
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Setiap tanggal</span>
          <NumberInput value={cutoffStart} onChange={setCutoffStart} suffix="(bln lalu)" min={1} max={31} step={1} width="65px" />
        </FieldRow>
        <FieldRow
          label="Tanggal Cut-off Absensi — Selesai"
          hint="Data kehadiran ditarik hingga tanggal ini (bulan berjalan). Contoh: tanggal 20 bulan ini."
        >
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Setiap tanggal</span>
          <NumberInput value={cutoffEnd} onChange={setCutoffEnd} suffix="(bln ini)" min={1} max={31} step={1} width="65px" />
        </FieldRow>
        <FieldRow
          label="Tanggal Pembayaran Gaji (Payday)"
          hint="Tanggal rilis slip gaji otomatis ke portal karyawan. Jika jatuh hari libur, dibayarkan sehari sebelumnya."
        >
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Setiap tanggal</span>
          <NumberInput value={payday} onChange={setPayday} suffix="tiap bulan" min={1} max={31} step={1} width="65px" />
          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, backgroundColor: '#d1fae5', padding: '4px 10px', borderRadius: '6px' }}>
            Otomatis rilis slip
          </span>
        </FieldRow>

        {/* Cut-off summary banner */}
        <div style={{
          marginTop: '16px', padding: '14px 16px',
          backgroundColor: '#f0fdf4', borderRadius: '8px',
          border: '1px solid #bbf7d0',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <ion-icon name="information-circle-outline" style={{ fontSize: '20px', color: '#059669', flexShrink: 0 }}></ion-icon>
          <p style={{ margin: 0, fontSize: '12px', color: '#065f46', lineHeight: '1.6' }}>
            <strong>Ringkasan Periode Aktif:</strong> Data absensi ditarik dari tanggal{' '}
            <strong>{cutoffStart} bulan lalu</strong> s/d tanggal{' '}
            <strong>{cutoffEnd} bulan berjalan</strong>. Gaji dibayarkan setiap tanggal{' '}
            <strong>{payday}</strong>.
          </p>
        </div>
      </SettingSection>

      {/* === SECTION 5: PPh 21 === */}
      <SettingSection
        icon="receipt-outline"
        title="Konfigurasi PPh 21 (Pajak Penghasilan)"
        subtitle="Pemotongan PPh 21 otomatis menggunakan metode TER (PMK 168/2023)"
        color="#be185d"
      >
        {/* Toggle aktif */}
        <FieldRow
          label="Aktifkan Pemotongan PPh 21 Otomatis"
          hint="Jika aktif, PPh 21 akan dihitung dan dipotong secara otomatis saat Payroll Run menggunakan tarif TER resmi Dirjen Pajak."
        >
          <button
            onClick={() => setPphActive(v => !v)}
            style={{
              width: '48px', height: '26px', borderRadius: '13px', border: 'none',
              backgroundColor: pphActive ? '#be185d' : '#cbd5e1',
              cursor: 'pointer', position: 'relative', transition: 'background-color 0.2s',
              flexShrink: 0
            }}
          >
            <span style={{
              position: 'absolute', top: '3px',
              left: pphActive ? '25px' : '3px',
              width: '20px', height: '20px',
              borderRadius: '50%', backgroundColor: 'white',
              transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }} />
          </button>
          <span style={{
            fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px',
            backgroundColor: pphActive ? '#fce7f3' : '#f1f5f9',
            color: pphActive ? '#be185d' : '#64748b'
          }}>
            {pphActive ? 'Aktif' : 'Nonaktif'}
          </span>
        </FieldRow>

        {/* Metode pemotongan */}
        {pphActive && (
          <FieldRow
            label="Metode Pemotongan Pajak"
            hint="Gross: pajak dipotong dari gaji karyawan (karyawan menanggung). Nett: perusahaan menanggung pajak, gaji karyawan tidak dipotong."
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[{ v: 'gross', label: 'Gross', sub: 'Pajak ditanggung karyawan (dipotong dari gaji)' }, { v: 'nett', label: 'Nett', sub: 'Pajak ditanggung / disubsidi penuh perusahaan' }].map(opt => (
                <label key={opt.v} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="pphMethod"
                    value={opt.v}
                    checked={pphMethod === opt.v}
                    onChange={() => setPphMethod(opt.v)}
                    style={{ marginTop: '2px', accentColor: '#be185d' }}
                  />
                  <div>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{opt.label}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{opt.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </FieldRow>
        )}

        {/* Tabel ringkasan kategori TER */}
        {pphActive && (
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
              Referensi Kategori TER Berdasarkan Status PTKP
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                { cat: 'A', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', statuses: 'TK/0, TK/1, K/0', range: '0% – 10%' },
                { cat: 'B', color: '#7c3aed', bg: '#f3e8ff', border: '#d8b4fe', statuses: 'TK/2, TK/3, K/1, K/2', range: '0% – 8.5%' },
                { cat: 'C', color: '#be185d', bg: '#fce7f3', border: '#fbcfe8', statuses: 'K/3', range: '0% – 8.5%' },
              ].map(({ cat, color, bg, border, statuses, range }) => (
                <div key={cat} style={{
                  padding: '12px', borderRadius: '8px',
                  backgroundColor: bg, border: `1px solid ${border}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{
                      width: '22px', height: '22px', borderRadius: '6px',
                      backgroundColor: color, color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 800, flexShrink: 0
                    }}>{cat}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color }}>Kategori {cat}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-main)', fontWeight: 600 }}>{statuses}</p>
                  <p style={{ margin: '3px 0 0', fontSize: '10px', color: 'var(--text-secondary)' }}>Tarif: {range}</p>
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0 0', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Dasar hukum: <strong>PMK No. 168/PMK.010/2023</strong> (berlaku 1 Jan 2024).
              Karyawan tanpa NPWP dikenakan tarif <strong>20% lebih tinggi</strong> dari tarif normal (UU HPP Pasal 21 ayat 5a).
            </p>
          </div>
        )}
      </SettingSection>

      {/* Bottom Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '16px' }}>
        <button
          onClick={handleSave}
          style={{
            height: '40px', padding: '0 28px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #0369a1 100%)',
            color: 'white', border: 'none', borderRadius: '9px',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 14px rgba(var(--color-primary-rgb), 0.3)',
            transition: 'opacity 0.15s, transform 0.15s'
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <ion-icon name="save-outline" style={{ fontSize: '18px' }}></ion-icon>
          Simpan Semua Pengaturan
        </button>
      </div>
    </div>
  );
}
