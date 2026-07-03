import React, { useState, memo } from 'react';

// Memoized ShiftCell to optimize re-render performance of the 31 x N grid
const ShiftCell = memo(({ day, code, config, hasWarning, warnings, onClick }) => {
  return (
    <td style={{
      padding: '4px', textAlign: 'center', borderRight: '1px solid var(--color-border)',
      position: 'relative'
    }}>
      <button
        onClick={onClick}
        style={{
          width: '26px', height: '26px', borderRadius: '6px', border: 'none',
          backgroundColor: config.bg, color: config.color, fontSize: '11px', fontWeight: 800,
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
          transition: 'transform 0.1s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title={`Tanggal ${day}: ${config.name} (${config.start} - ${config.end})`}
      >
        {code}
      </button>

      {/* Warning Indicator */}
      {hasWarning && (
        <span 
          style={{
            position: 'absolute', top: '1px', right: '1px',
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: '#ef4444', border: '1px solid white',
            boxShadow: '0 0 6px #ef4444', animation: 'pulse 1s infinite'
          }}
          title={warnings.join('\n')}
        />
      )}
    </td>
  );
});

export default function ShiftPlannerView({ store, showToast }) {
  const { employees, shifts, updateEmployeeShift, shiftMaster } = store;
  const [selectedDayCell, setSelectedDayCell] = useState(null); // { empId, day }
  const [copiedPattern, setCopiedPattern] = useState(null); // array of codes [P, P, S...]

  // Get days in July 2026 (1 to 31)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Helper to get styling config for shift codes
  const getShiftConfig = (code) => {
    return shiftMaster.find(s => s.code === code) || { color: '#64748b', bg: '#f1f5f9', name: 'Off' };
  };

  // --- SMART VALIDATION CHECKS ---
  const checkWarnings = (empId, day, currentCode) => {
    const empShifts = shifts[empId] || {};
    const dayNum = parseInt(day);
    const warnings = [];

    // 1. Rest Period Check (Night shift followed by Morning shift)
    if (currentCode === 'M') {
      const tomorrowShift = empShifts[dayNum + 1];
      if (tomorrowShift === 'P') {
        warnings.push('Peringatan: Karyawan ini masuk Pagi keesokan harinya setelah Shift Malam. Waktu istirahat kurang dari 12 jam!');
      }
    }
    if (currentCode === 'P') {
      const yesterdayShift = empShifts[dayNum - 1];
      if (yesterdayShift === 'M') {
        warnings.push('Peringatan: Karyawan ini baru pulang Shift Malam pagi hari ini. Waktu istirahat kurang dari 12 jam!');
      }
    }

    // 2. 7-Day Straight Work Limit Check
    let straightWork = true;
    for (let i = 0; i < 7; i++) {
      const checkDay = dayNum - i;
      if (checkDay >= 1) {
        const sc = (checkDay === dayNum) ? currentCode : empShifts[checkDay];
        if (sc === 'L' || !sc) {
          straightWork = false;
          break;
        }
      } else {
        straightWork = false;
        break;
      }
    }
    if (straightWork) {
      warnings.push('Aturan Depnaker: Karyawan tidak boleh diplot bekerja 7 hari berturut-turut tanpa libur!');
    }

    return warnings;
  };

  // Handle cell click
  const handleCellClick = (empId, day) => {
    setSelectedDayCell({ empId, day });
  };

  // Apply shift code to selected cell
  const handleSelectShiftCode = (code) => {
    if (!selectedDayCell) return;
    const { empId, day } = selectedDayCell;

    const warnings = checkWarnings(empId, day, code);
    if (warnings.length > 0) {
      showToast(warnings[0], 'error');
    } else {
      showToast(`Jadwal tanggal ${day} berhasil diplot.`);
    }

    updateEmployeeShift(empId, day, code);
    setSelectedDayCell(null);
  };

  // --- COPY-PASTE MASSAL PATTERN ---
  const handleCopyPattern = (empId) => {
    const empShifts = shifts[empId] || {};
    const pattern = [1, 2, 3, 4, 5, 6, 7].map(d => empShifts[d] || 'L');
    setCopiedPattern(pattern);
    showToast(`Pola shift 7 hari karyawan berhasil disalin! (${pattern.join('-')})`);
  };

  const handlePastePattern = (targetEmpId) => {
    if (!copiedPattern) {
      showToast('Salin pola shift karyawan lain terlebih dahulu!', 'error');
      return;
    }
    for (let day = 1; day <= 31; day++) {
      const pIndex = (day - 1) % copiedPattern.length;
      updateEmployeeShift(targetEmpId, day, copiedPattern[pIndex]);
    }
    showToast(`Pola shift berhasil ditempelkan secara berulang ke karyawan ini.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #0369a1 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            boxShadow: '0 4px 10px rgba(var(--color-primary-rgb), 0.2)'
          }}>
            <ion-icon name="calendar-outline" style={{ fontSize: '20px' }}></ion-icon>
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Shift Scheduler Timeline</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Atur dan plot jadwal kerja bulanan karyawan dengan timeline interaktif bulanan
            </p>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '11px' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)', marginRight: '4px' }}>LEGEND SHIFT:</span>
          {shiftMaster.map(s => (
            <div key={s.code} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, borderRadius: '4px', backgroundColor: s.bg, color: s.color }}>
                {s.code}
              </span>
              <span style={{ fontWeight: 600 }}>{s.name} ({s.start})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduler Timeline Card */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
        
        {/* Bulk Action Header bar */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ion-icon name="information-circle-outline" style={{ color: 'var(--color-primary)', fontSize: '18px' }}></ion-icon>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              <strong>Panduan Plotting:</strong> Klik salah satu kotak tanggal di samping nama karyawan untuk memilih shift. Gunakan tombol copy/paste untuk menyalin pola.
            </span>
          </div>
          {copiedPattern && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', backgroundColor: '#e0f2fe', padding: '4px 10px', borderRadius: '6px' }}>
                Copied Pattern: {copiedPattern.join('-')}
              </span>
              <button 
                onClick={() => setCopiedPattern(null)}
                style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Timeline Container */}
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', backgroundColor: '#fafafa' }}>
                {/* Column Employee */}
                <th style={{ minWidth: '220px', position: 'sticky', left: 0, zIndex: 10, background: '#fafafa', padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', borderRight: '2px solid var(--color-border)' }}>
                  KARYAWAN
                </th>
                {/* Columns Date */}
                {daysInMonth.map(day => {
                  const isWeekend = day % 7 === 4 || day % 7 === 5;
                  return (
                    <th key={day} style={{
                      minWidth: '34px', width: '34px', textAlign: 'center', padding: '8px 4px', fontSize: '11px', fontWeight: 800,
                      backgroundColor: isWeekend ? '#fee2e2' : '#fafafa',
                      color: isWeekend ? 'var(--color-danger-text)' : 'var(--text-secondary)',
                      borderRight: '1px solid var(--color-border)'
                    }}>
                      {day}
                    </th>
                  );
                })}
                {/* Column Action Pattern */}
                <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>
                  POLA SHIFT
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const empShifts = shifts[emp.id] || {};
                return (
                  <tr key={emp.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    {/* Employee Profile Cell */}
                    <td style={{
                      position: 'sticky', left: 0, zIndex: 9, background: 'white',
                      padding: '12px 16px', borderRight: '2px solid var(--color-border)',
                      boxShadow: '4px 0 8px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-text)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800
                        }}>
                          {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>{emp.name}</h4>
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{emp.role}</span>
                        </div>
                      </div>
                    </td>

                    {/* Timeline Schedule Cells */}
                    {daysInMonth.map(day => {
                      const code = empShifts[day] || 'L';
                      const config = getShiftConfig(code);
                      const warnings = checkWarnings(emp.id, day, code);
                      const hasWarning = warnings.length > 0;

                      return (
                        <ShiftCell
                          key={day}
                          day={day}
                          code={code}
                          config={config}
                          hasWarning={hasWarning}
                          warnings={warnings}
                          onClick={() => handleCellClick(emp.id, day)}
                        />
                      );
                    })}

                    {/* Copy/Paste Action Buttons */}
                    <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleCopyPattern(emp.id)}
                          style={{
                            border: '1px solid var(--color-border)', background: 'white', borderRadius: '6px',
                            padding: '4px 8px', fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px'
                          }}
                          title="Copy pola shift 7 hari pertama karyawan ini"
                        >
                          <ion-icon name="copy-outline"></ion-icon>
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => handlePastePattern(emp.id)}
                          style={{
                            border: '1px solid #bae6fd', background: '#f0f9ff', borderRadius: '6px',
                            padding: '4px 8px', fontSize: '10px', fontWeight: 700, color: '#0369a1',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px'
                          }}
                          title="Paste pattern ke seluruh bulan"
                        >
                          <ion-icon name="clipboard-outline"></ion-icon>
                          <span>Paste</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Dropdown Popover Picker */}
        {selectedDayCell && (() => {
          const emp = employees.find(e => e.id === selectedDayCell.empId) || {};
          return (
            <div style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              zIndex: 1000, backgroundColor: 'white', padding: '20px', borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: '1px solid var(--color-border)', width: '320px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                  Plot Shift: Tgl {selectedDayCell.day} Juli
                </span>
                <button 
                  onClick={() => setSelectedDayCell(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray-400)' }}
                >
                  <ion-icon name="close-outline" style={{ fontSize: '20px' }}></ion-icon>
                </button>
              </div>
              <p style={{ margin: '0 0 14px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                Karyawan: <strong>{emp.name}</strong> ({emp.role})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {shiftMaster.map(s => (
                  <button
                    key={s.code}
                    onClick={() => handleSelectShiftCode(s.code)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
                      padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)',
                      backgroundColor: s.bg, color: s.color, fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                      fontSize: '12px', transition: 'filter 0.1s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '4px', backgroundColor: s.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>
                        {s.code}
                      </span>
                      <span>{s.name}</span>
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: '10px', opacity: 0.8 }}>{s.start} - {s.end}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

      </div>

      {/* Styles inject for warning pulsing */}
      <style dangerouslySetInnerHTML={{ __html: '@keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.6; } 100% { transform: scale(1); opacity: 1; } }' }} />
    </div>
  );
}
