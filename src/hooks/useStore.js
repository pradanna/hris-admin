import { useState, useEffect } from 'react';

import initialEmployees from '../karyawan.json';
import initialAttendances from '../attendances.json';

const initialPendingRequests = [
  {
    id: 'REQ007',
    name: 'Dewi Lestari',
    role: 'Staff Sales Counter',
    time: '30 menit lalu',
    type: 'Cuti Tahunan',
    tagClass: 'leave',
    avatar: '',
    reason: 'Pengajuan cuti tahunan untuk keperluan acara keluarga penting di luar kota selama 3 hari kerja.',
    duration: '3 Hari (15 Jul - 17 Jul 2026)',
    status: 'Pending',
    leaveBalance: 12, // Annual leave balance before this request
    attachment: '',
    requestDate: '2026-07-03'
  },
  {
    id: 'REQ001',
    name: 'Anisa Putri',
    role: 'Supervisor Kasir',
    time: '2 jam lalu',
    type: 'Cuti Sakit',
    tagClass: 'leave',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    reason: 'Izin tidak masuk kerja karena gejala demam berdarah. Surat dokter dari RS Siloam dilampirkan.',
    duration: '3 Hari (06 Jul - 08 Jul 2026)',
    status: 'Pending',
    leaveBalance: 10,
    attachment: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    requestDate: '2026-07-03'
  },
  {
    id: 'REQ002',
    name: 'Rizky Kurniawan',
    role: 'Kepala Gudang',
    time: '5 jam lalu',
    type: 'Lembur',
    tagClass: 'overtime',
    avatar: '',
    reason: 'Lembur bongkar muat semen Tiga Roda sebanyak 2 tronton masuk jam malam (4 Jam).',
    duration: '4 Jam (03 Jul 2026)',
    status: 'Pending',
    leaveBalance: 12,
    attachment: '',
    requestDate: '2026-07-03'
  },
  {
    id: 'REQ003',
    name: 'Feri Dermawan',
    role: 'Driver Truk Logistik',
    time: '1 hari lalu',
    type: 'Absen GPS Diluar Radius',
    tagClass: 'absent',
    avatar: '',
    reason: 'Melakukan absen masuk dari jarak 300m. Alasan: Macet antrean truk semen di gerbang masuk Gudang.',
    duration: '03 Jul 2026',
    status: 'Pending',
    leaveBalance: 8,
    attachment: '',
    requestDate: '2026-07-02'
  },
  {
    id: 'REQ004',
    name: 'Rian Hidayat',
    role: 'Staff Sales Counter',
    time: 'Baru saja',
    type: 'Pendaftaran Mandiri',
    tagClass: 'registration',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    reason: 'Formulir pendaftaran mandiri diisi lengkap oleh karyawan baru. Silakan periksa berkas & verifikasi data.',
    division: 'Sales & Marketing',
    email: 'rian.hidayat@karyamaterial.com',
    salary: 6200000,
    contractType: 'PKWT',
    duration: '-',
    status: 'Pending',
    leaveBalance: 12,
    attachment: '',
    requestDate: '2026-07-03'
  },
  {
    id: 'REQ005',
    name: 'Bambang Tri',
    role: 'Staff Sales Counter',
    time: '3 jam lalu',
    type: 'Izin Resmi',
    tagClass: 'leave',
    avatar: '',
    reason: 'Izin menghadiri upacara pernikahan saudara kandung kandung di Solo (2 Hari).',
    duration: '2 Hari (07 Jul - 08 Jul 2026)',
    status: 'Pending',
    leaveBalance: 12,
    attachment: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80', // Wedding rings invitation letter mock
    requestDate: '2026-07-03'
  },
  {
    id: 'REQ006',
    name: 'Siti Rahma',
    role: 'Admin Keuangan',
    time: '10 jam lalu',
    type: 'Tugas Keluar',
    tagClass: 'overtime',
    avatar: '',
    reason: 'Tugas dinas luar untuk pengurusan berkas legalitas dan perpajakan di kantor dinas terkait.',
    duration: '1 Hari (04 Jul 2026)',
    status: 'Pending',
    leaveBalance: 14,
    attachment: '',
    requestDate: '2026-07-02'
  },
  {
    id: 'REQ008',
    name: 'Anton Wibowo',
    role: 'Helper Gudang',
    time: '3 hari lalu',
    type: 'Lembur',
    tagClass: 'overtime',
    avatar: '',
    reason: 'Lembur H-3 bongkar muat semen Tiga Roda masuk jam malam (3 Jam).',
    duration: '3 Jam (30 Jun 2026)',
    status: 'Pending',
    leaveBalance: 12,
    attachment: '',
    requestDate: '2026-06-30'
  },
  {
    id: 'REQ009',
    name: 'Dimas Aditya',
    role: 'Sales Project',
    time: '2 hari lalu',
    type: 'Cuti Tahunan',
    tagClass: 'leave',
    avatar: '',
    reason: 'Pengajuan cuti tahunan mendesak untuk urusan keluarga penting.',
    duration: '2 Hari (01 Jul - 02 Jul 2026)',
    status: 'Pending',
    leaveBalance: 12,
    attachment: '',
    requestDate: '2026-07-01'
  }
];

const initialRecentActivities = [
  { id: 'ACT001', employee: 'Dewi Lestari', avatar: 'DL', action: 'Update BPJS Ketenagakerjaan Staff Sales Counter', time: 'Hari ini, 09:15', status: 'Berhasil' },
  { id: 'ACT002', employee: 'Adi Saputra', avatar: 'AS', action: 'Absensi Terlambat (15 Menit) - Bongkar Besi Beton', time: 'Hari ini, 08:45', status: 'Tercatat' },
  { id: 'ACT003', employee: 'Budi Santoso (Anda)', avatar: 'BS', action: 'Review Laporan Payroll Mingguan - Toko Pusat', time: 'Kemarin, 16:20', status: 'Selesai' }
];

const initialExpiringContracts = [
  { name: 'Anton Wibowo', type: 'Probation', daysLeft: 5, date: '07 Juli 2026', division: 'Gudang & Logistik' },
  { name: 'Sinta Permata', type: 'PKWT', daysLeft: 14, date: '16 Juli 2026', division: 'Kasir & Keuangan' },
  { name: 'Dimas Aditya', type: 'PKWT', daysLeft: 22, date: '24 Juli 2026', division: 'Sales & Marketing' }
];

const initialPayrollHistory = [
  {
    period: 'Juni 2026',
    totalSpend: 'Rp 198.400.000',
    employeesPaid: 32,
    processedDate: '28 Juni 2026, 15:30 WIB',
    processedBy: 'Budi Santoso (HR Manager)',
    status: 'Transfer Berhasil'
  },
  {
    period: 'Mei 2026',
    totalSpend: 'Rp 196.500.000',
    employeesPaid: 32,
    processedDate: '28 Mei 2026, 14:15 WIB',
    processedBy: 'Budi Santoso (HR Manager)',
    status: 'Transfer Berhasil'
  }
];

export function useStore() {
  const [employees, setEmployees] = useState(() => {
    const val = localStorage.getItem('hris_employees');
    const parsed = val ? JSON.parse(val) : null;
    const baseEmployees = (parsed && parsed.length >= initialEmployees.length) ? parsed : initialEmployees;
    
    return baseEmployees.map((emp, idx) => {
      if (!emp.contractEndDate) {
        if (emp.contractType === 'PKWTT') {
          return { ...emp, contractEndDate: '-' };
        }
        // Generate mock dates for simulation
        if (idx === 2) return { ...emp, contractEndDate: '2026-06-20' }; // Expired
        if (idx === 5) return { ...emp, contractEndDate: '2026-07-10' }; // Expiring soon
        if (idx === 7) return { ...emp, contractEndDate: '2026-07-05' }; // Expiring soon
        if (idx % 3 === 0) return { ...emp, contractEndDate: '2026-08-15' };
        return { ...emp, contractEndDate: '2027-06-30' };
      }
      return emp;
    });
  });
  // --- SHIFT SCHEDULER STATES & INITIALIZATION ---
  const [shiftMaster, setShiftMaster] = useState(() => {
    const val = localStorage.getItem('hris_shift_master');
    if (val) return JSON.parse(val);
    return [
      { code: 'P', name: 'Shift Pagi', start: '08:00', end: '16:00', color: '#0ea5e9', bg: '#e0f2fe' },
      { code: 'S', name: 'Shift Siang', start: '14:00', end: '22:00', color: '#8b5cf6', bg: '#f3e8ff' },
      { code: 'M', name: 'Shift Malam', start: '22:00', end: '06:00', color: '#be185d', bg: '#fce7f3' },
      { code: 'L', name: 'Libur', start: '-', end: '-', color: '#64748b', bg: '#f1f5f9' },
    ];
  });

  const [shifts, setShifts] = useState(() => {
    const val = localStorage.getItem('hris_shifts');
    if (val) return JSON.parse(val);
    // Initialize default shifts for employees
    const defaultShifts = {};
    employees.forEach(emp => {
      defaultShifts[emp.id] = {};
      // Generate some default patterns for July 2026 (days 1 to 31)
      for (let day = 1; day <= 31; day++) {
        // Let's create a rotating pattern: P, P, S, S, M, M, L
        const pattern = ['P', 'P', 'S', 'S', 'M', 'M', 'L'];
        const pIndex = (day + parseInt(emp.id.replace(/\D/g, '') || '0')) % pattern.length;
        defaultShifts[emp.id][day] = pattern[pIndex];
      }
    });
    return defaultShifts;
  });

  const [pendingRequests, setPendingRequests] = useState(() => {
    const val = localStorage.getItem('hris_pending_requests');
    let parsed = val ? JSON.parse(val) : null;
    if (!parsed || parsed.length === 0) {
      parsed = [
        ...initialPendingRequests,
        {
          id: 'REQ_SWAP_001',
          name: 'Anisa Putri',
          role: 'Supervisor Kasir',
          time: '1 jam lalu',
          type: 'Tukar Shift',
          tagClass: 'overtime',
          avatar: '',
          reason: 'Pengajuan tukar shift tanggal 15 Juli 2026 (Malam) dengan Rizky Kurniawan (Siang). Alasan: Menghadiri wisuda adik kandung.',
          details: {
            fromEmpId: 'EMP002', // Anisa Putri
            toEmpId: 'EMP003', // Rizky Kurniawan
            day: 15,
            fromShift: 'M',
            toShift: 'S'
          },
          status: 'Pending',
          requestDate: '2026-07-03'
        }
      ];
    } else {
      // Ensure the mock swap request is always there if missing
      if (!parsed.some(p => p.id === 'REQ_SWAP_001')) {
        parsed.push({
          id: 'REQ_SWAP_001',
          name: 'Anisa Putri',
          role: 'Supervisor Kasir',
          time: '1 jam lalu',
          type: 'Tukar Shift',
          tagClass: 'overtime',
          avatar: '',
          reason: 'Pengajuan tukar shift tanggal 15 Juli 2026 (Malam) dengan Rizky Kurniawan (Siang). Alasan: Menghadiri wisuda adik kandung.',
          details: {
            fromEmpId: 'EMP002', // Anisa Putri
            toEmpId: 'EMP003', // Rizky Kurniawan
            day: 15,
            fromShift: 'M',
            toShift: 'S'
          },
          status: 'Pending',
          requestDate: '2026-07-03'
        });
      }
    }
    return parsed.map(p => ({ status: p.status || 'Pending', ...p }));
  });

  const [activities, setActivities] = useState(initialRecentActivities);
  const [expiringContracts, setExpiringContracts] = useState(initialExpiringContracts);

  const [attendances, setAttendances] = useState(() => {
    const val = localStorage.getItem('hris_attendances');
    const parsed = val ? JSON.parse(val) : null;
    if (!parsed || parsed.length < initialAttendances.length) {
      return initialAttendances;
    }
    return parsed;
  });

  const [selectedBranch, setSelectedBranch] = useState('Semua Cabang');
  const [selectedDept, setSelectedDept] = useState('Semua Departemen');

  const defaultBlockers = [
    { name: 'Anton Wibowo', division: 'Gudang & Logistik', role: 'Helper Gudang', type: 'Probation', blocker: 'Menunggu Approval Lembur H-3' },
    { name: 'Sinta Permata', division: 'Kasir & Keuangan', role: 'Kasir Toko', type: 'PKWT', blocker: 'Absen Tanggal 15 Kosong' },
    { name: 'Dimas Aditya', division: 'Sales & Marketing', role: 'Sales Project', type: 'PKWT', blocker: 'Menunggu Approval Cuti Tahunan' }
  ];

  const [payrollStatus, setPayrollStatus] = useState(() => {
    const totalCount = localStorage.getItem('hris_employees') ? JSON.parse(localStorage.getItem('hris_employees')).length : initialEmployees.length;
    const processed = totalCount - defaultBlockers.length;
    const progress = Math.round((processed / totalCount) * 100);

    return {
      period: 'Juli 2026',
      daysLeft: 4,
      progress: progress,
      status: 'in_progress',
      totalEstimate: `Rp ${(totalCount * 6200000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`,
      bpjsCalculated: `Rp ${(totalCount * 180000).toLocaleString('id-ID', { maximumFractionDigits: 0 })}`,
      processedEmployees: processed,
      blockers: defaultBlockers
    };
  });

  const [payrollHistory, setPayrollHistory] = useState(initialPayrollHistory);

  const initialBroadcasts = [
    {
      id: 'BRD001',
      title: 'Pengumuman Libur Hari Raya',
      target: 'Semua Divisi',
      content: 'Sehubungan dengan hari libur nasional, operasional kantor akan diliburkan pada tanggal 10 Juli 2026. Toko fisik tetap buka dengan jadwal piket bergantian.',
      date: '02 Jul 2026, 09:00 WIB',
      sender: 'Budi Santoso (HR Manager)',
      category: 'Penting'
    },
    {
      id: 'BRD002',
      title: 'Update Penggunaan Masker & Protokol',
      target: 'Semua Divisi',
      content: 'Untuk menjaga kesehatan lingkungan kerja di area gudang logistik, seluruh staff helper diimbau tetap menggunakan masker saat melakukan bongkar muat semen.',
      date: '01 Jul 2026, 14:00 WIB',
      sender: 'Budi Santoso (HR Manager)',
      category: 'Himbauan'
    }
  ];

  const [broadcasts, setBroadcasts] = useState(() => {
    const val = localStorage.getItem('hris_broadcasts');
    return val ? JSON.parse(val) : initialBroadcasts;
  });

  const [officeSettings, setOfficeSettings] = useState({
    latitude: -6.2008,
    longitude: 106.8456,
    radius: 100
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hris_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('hris_pending_requests', JSON.stringify(pendingRequests));
  }, [pendingRequests]);

  useEffect(() => {
    localStorage.setItem('hris_attendances', JSON.stringify(attendances));
  }, [attendances]);

  useEffect(() => {
    localStorage.setItem('hris_broadcasts', JSON.stringify(broadcasts));
  }, [broadcasts]);

  useEffect(() => {
    localStorage.setItem('hris_shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('hris_shift_master', JSON.stringify(shiftMaster));
  }, [shiftMaster]);

  const updateEmployeeShift = (empId, day, shiftCode) => {
    setShifts(prev => {
      const copy = { ...prev };
      if (!copy[empId]) copy[empId] = {};
      copy[empId][day] = shiftCode;
      return copy;
    });
  };

  const updateShiftMaster = (newMasterList) => {
    setShiftMaster(newMasterList);
    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: 'Budi Santoso (Anda)',
        avatar: 'BS',
        action: `Update master jam kerja shift`,
        time: 'Baru saja',
        status: 'Berhasil'
      },
      ...prev
    ]);
  };

  const addEmployee = (emp) => {
    const newEmp = {
      id: `EMP00${employees.length + 1}`,
      status: 'Hadir',
      branch: 'Kantor Pusat (JKT)',
      contractType: 'PKWT',
      employeeStatus: 'Aktif',
      ...emp
    };
    setEmployees(prev => [...prev, newEmp]);
    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: 'Budi Santoso (Anda)',
        avatar: 'BS',
        action: `Tambah Karyawan Baru: ${emp.name}`,
        time: 'Baru saja',
        status: 'Berhasil'
      },
      ...prev
    ]);
  };

  const approveRequest = (id, customSalary) => {
    const request = pendingRequests.find(r => r.id === id);
    if (!request) return;

    setPendingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));

    if (request.type === 'Cuti Sakit') {
      setEmployees(prev => prev.map(e => e.name === request.name ? { ...e, status: 'Cuti Sakit' } : e));
    } else if (request.type === 'Pendaftaran Mandiri') {
      addEmployee({
        name: request.name,
        role: request.role,
        division: request.division || 'Sales & Marketing',
        email: request.email || '',
        salary: customSalary || request.salary || 0,
        contractType: request.contractType || 'PKWT',
        photoFront: '',
        photoRight: '',
        photoLeft: ''
      });
    } else if (request.type === 'Tukar Shift') {
      // Perform the shift swap in shifts state
      const { fromEmpId, toEmpId, day, fromShift, toShift } = request.details;
      setShifts(prev => {
        const copy = { ...prev };
        if (!copy[fromEmpId]) copy[fromEmpId] = {};
        if (!copy[toEmpId]) copy[toEmpId] = {};
        
        copy[fromEmpId][day] = toShift;
        copy[toEmpId][day] = fromShift;
        return copy;
      });
    }

    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: request.name,
        avatar: request.name.split(' ').map(n => n[0]).join(''),
        action: `Persetujuan ${request.type} Disetujui`,
        time: 'Baru saja',
        status: 'Selesai'
      },
      ...prev
    ]);
  };

  const rejectRequest = (id, reason) => {
    const request = pendingRequests.find(r => r.id === id);
    if (!request) return;

    setPendingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected', rejectReason: reason } : r));
    const reasonSuffix = reason ? ` [Alasan: ${reason}]` : '';

    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: request.name,
        avatar: request.name.split(' ').map(n => n[0]).join(''),
        action: `Persetujuan ${request.type} Ditolak${reasonSuffix}`,
        time: 'Baru saja',
        status: 'Tercatat'
      },
      ...prev
    ]);
  };

  const renewContract = (employeeName, decision, effectiveDate, endDate, notes, newSalary) => {
    setExpiringContracts(prev => prev.filter(con => con.name !== employeeName));
    let logMessage = '';

    setEmployees(prev => {
      const emp = prev.find(e => e.name === employeeName);
      if (emp) {
        if (decision === 'convert') {
          logMessage = `Pengangkatan Karyawan Tetap: ${employeeName} (Efektif: ${effectiveDate})`;
          return prev.map(e => e.name === employeeName ? { ...e, role: `${e.role} (Tetap)`, salary: newSalary } : e);
        } else if (decision === 'extend') {
          logMessage = `Perpanjang PKWT s/d ${endDate}: ${employeeName}`;
          return prev.map(e => e.name === employeeName ? { ...e, salary: newSalary } : e);
        } else if (decision === 'terminate') {
          logMessage = `Selesai Kontrak: ${employeeName} (Efektif: ${effectiveDate})`;
          return prev.filter(e => e.name !== employeeName);
        }
      } else {
        if (decision === 'convert') logMessage = `Pengangkatan Karyawan Tetap: ${employeeName} (Efektif: ${effectiveDate})`;
        else if (decision === 'extend') logMessage = `Perpanjang PKWT s/d ${endDate}: ${employeeName}`;
        else logMessage = `Selesai Kontrak: ${employeeName} (Efektif: ${effectiveDate})`;
      }
      return prev;
    });

    const noteSummary = notes ? ` [Evaluasi: ${notes}]` : '';
    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: 'Budi Santoso (Anda)',
        avatar: 'BS',
        action: `${logMessage}${noteSummary}`,
        time: 'Baru saja',
        status: 'Berhasil'
      },
      ...prev
    ]);
  };

  const sendBroadcast = (title, target, content, category, image = '') => {
    const newBrd = {
      id: `BRD00${broadcasts.length + 1}`,
      title,
      target,
      content,
      category,
      image,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      sender: 'Budi Santoso (HR Manager)'
    };
    setBroadcasts(prev => [newBrd, ...prev]);
    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: 'Budi Santoso (Anda)',
        avatar: 'BS',
        action: `Kirim Broadcast: "${title}" ke ${target}`,
        time: 'Baru saja',
        status: 'Berhasil'
      },
      ...prev
    ]);
  };

  const resolveBlocker = (name, actionType, details = '') => {
    setPayrollStatus(prev => {
      const blockers = prev.blockers.filter(b => b.name !== name);
      const processed = prev.processedEmployees + 1;
      let pct = Math.round((processed / employees.length) * 100);
      const progress = Math.min(100, pct);
      const status = blockers.length === 0 ? 'review' : prev.status;
      return { ...prev, blockers, processedEmployees: processed, progress, status };
    });

    let logMsg = '';
    if (actionType === 'bypass') {
      logMsg = `Bypass Payroll & Potong Gaji: ${name} (Alasan: ${details || 'Absen Alpha/Mangkir'})`;
    } else if (actionType === 'absen_manual') {
      logMsg = `Input Kehadiran Manual HR: ${name} (Clock In/Out: ${details})`;
    } else {
      logMsg = `Kirim Reminder Manual: ${name}`;
    }

    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: 'Budi Santoso (Anda)',
        avatar: 'BS',
        action: logMsg,
        time: 'Baru saja',
        status: 'Berhasil'
      },
      ...prev
    ]);
  };

  const processPayroll = () => {
    setEmployees(prev => prev.map(e => ({ ...e, isSalaryLocked: true })));
    setPayrollStatus(prev => ({ ...prev, progress: 100, processedEmployees: employees.length, status: 'review' }));
    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: 'Budi Santoso (Anda)',
        avatar: 'BS',
        action: 'Kalkulasi Payroll Selesai. Data Keuangan Juli 2026 Dikunci & Slip Gaji Digital Diterbitkan.',
        time: 'Baru saja',
        status: 'Selesai'
      },
      ...prev
    ]);
  };

  const submitPayrollApproval = () => {
    setPayrollStatus(prev => ({ ...prev, status: 'approved' }));
    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: 'Budi Santoso (Anda)',
        avatar: 'BS',
        action: 'Persetujuan Payroll Disetujui (Approved & Ready)',
        time: 'Baru saja',
        status: 'Berhasil'
      },
      ...prev
    ]);
  };

  const disbursePayroll = () => {
    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: 'Budi Santoso (Anda)',
        avatar: 'BS',
        action: 'Export Data Transfer Bank & Slip Gaji ESS Diterbitkan',
        time: 'Baru saja',
        status: 'Berhasil'
      },
      ...prev
    ]);
  };

  const updateSettings = (lat, lng, radius) => {
    setOfficeSettings({ latitude: lat, longitude: lng, radius });
    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: 'Budi Santoso (Anda)',
        avatar: 'BS',
        action: `Update Geofence: Radius ${radius}m`,
        time: 'Baru saja',
        status: 'Berhasil'
      },
      ...prev
    ]);
  };

  const updateEmployeeSalary = (id, data) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        const historyEntry = {
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          changedBy: data.changedBy || 'Super Admin',
          oldSalary: emp.salary || 0,
          newSalary: data.salary,
          reason: data.reason,
          effectiveDate: data.effectiveDate,
          notes: data.notes
        };
        const currentHistory = emp.salaryHistory || [];
        return {
          ...emp,
          salary: data.salary,
          tunjanganJabatan: data.tunjanganJabatan || 0,
          tunjanganTransport: data.tunjanganTransport || 0,
          potonganKasbon: data.potonganKasbon || 0,
          salaryHistory: [historyEntry, ...currentHistory]
        };
      }
      return emp;
    }));

    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: 'Budi Santoso (Anda)',
        avatar: 'BS',
        action: `Update Gaji Karyawan ${id} (Alasan: ${data.reason}, Efektif: ${data.effectiveDate})`,
        time: 'Baru saja',
        status: 'Berhasil'
      },
      ...prev
    ]);
  };
  const updateEmployeeProfile = (id, profileData) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id !== id) return emp;
      return { ...emp, ...profileData };
    }));
    setActivities(prev => [
      {
        id: `ACT-${Date.now()}`,
        employee: 'Budi Santoso (Anda)',
        avatar: 'BS',
        action: `Update Profil Lengkap Karyawan ${id} (BPJS, Pajak, Kontak Darurat)`,
        time: 'Baru saja',
        status: 'Berhasil'
      },
      ...prev
    ]);
  };


  useEffect(() => {
    const handleStorage = () => {
      const val = localStorage.getItem('hris_pending_requests');
      if (val) {
        setPendingRequests(JSON.parse(val));
      }
    };
    window.addEventListener('storage', handleStorage);
    // Polling interval fallback for same-tab
    const timer = setInterval(handleStorage, 1500);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(timer);
    };
  }, []);

  const [departmentsList, setDepartmentsList] = useState(() => {
    const val = localStorage.getItem('hris_master_departments');
    const defaultDepts = [
      'Operasional Toko', 
      'Gudang & Logistik', 
      'Kasir & Keuangan', 
      'Sales & Marketing',
      'Human Resources (HRD)',
      'Teknologi Informasi (IT)',
      'Umum & Security'
    ];
    let parsed = val ? JSON.parse(val) : null;
    // Force upgrade dataset if it is the legacy short list
    if (!parsed || parsed.length < defaultDepts.length) {
      parsed = defaultDepts;
    }
    return parsed;
  });

  const [rolesList, setRolesList] = useState(() => {
    const val = localStorage.getItem('hris_master_roles');
    const defaultRoles = [
      // Operasional Toko
      { name: 'Store Manager', department: 'Operasional Toko' },
      { name: 'Assistant Store Manager', department: 'Operasional Toko' },
      { name: 'Staff Sales Counter', department: 'Operasional Toko' },
      { name: 'Customer Service', department: 'Operasional Toko' },
      
      // Gudang & Logistik
      { name: 'Kepala Gudang', department: 'Gudang & Logistik' },
      { name: 'Supervisor Logistik', department: 'Gudang & Logistik' },
      { name: 'Helper Gudang', department: 'Gudang & Logistik' },
      { name: 'Driver Operasional', department: 'Gudang & Logistik' },
      { name: 'Packer', department: 'Gudang & Logistik' },

      // Kasir & Keuangan
      { name: 'Supervisor Kasir', department: 'Kasir & Keuangan' },
      { name: 'Kasir Toko', department: 'Kasir & Keuangan' },
      { name: 'Accounting Staff', department: 'Kasir & Keuangan' },
      { name: 'Finance Staff', department: 'Kasir & Keuangan' },

      // Sales & Marketing
      { name: 'Manager Sales', department: 'Sales & Marketing' },
      { name: 'Sales Project', department: 'Sales & Marketing' },
      { name: 'Digital Marketer', department: 'Sales & Marketing' },
      { name: 'Graphic Designer', department: 'Sales & Marketing' },

      // HRD
      { name: 'HR Manager', department: 'Human Resources (HRD)' },
      { name: 'Recruitment Specialist', department: 'Human Resources (HRD)' },
      { name: 'Payroll Staff', department: 'Human Resources (HRD)' },
      { name: 'General Affairs (GA)', department: 'Human Resources (HRD)' },

      // IT
      { name: 'IT Support', department: 'Teknologi Informasi (IT)' },
      { name: 'Web Developer', department: 'Teknologi Informasi (IT)' },
      { name: 'System Administrator', department: 'Teknologi Informasi (IT)' },

      // Umum
      { name: 'Security Guard', department: 'Umum & Security' },
      { name: 'Office Boy / Cleaning Service', department: 'Umum & Security' }
    ];
    let parsed = val ? JSON.parse(val) : null;
    if (!parsed || parsed.length < 10) {
      parsed = defaultRoles;
    }
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem('hris_master_departments', JSON.stringify(departmentsList));
  }, [departmentsList]);

  useEffect(() => {
    localStorage.setItem('hris_master_roles', JSON.stringify(rolesList));
  }, [rolesList]);

  const addDepartment = (name) => {
    if (!departmentsList.includes(name)) setDepartmentsList(prev => [...prev, name]);
  };

  const removeDepartment = (name) => {
    setDepartmentsList(prev => prev.filter(d => d !== name));
    // Hapus juga jabatan di bawah departemen ini agar integritas terjaga
    setRolesList(prev => prev.filter(r => r.department !== name));
  };

  const addRole = (name, department) => {
    if (!rolesList.some(r => r.name === name && r.department === department)) {
      setRolesList(prev => [...prev, { name, department }]);
    }
  };

  const removeRole = (name) => {
    setRolesList(prev => prev.filter(r => r.name !== name));
  };

  const branches = ['Semua Cabang', 'Toko Pusat (Kemang)', 'Cabang Serpong', 'Cabang Bekasi', 'Gudang Cibubur'];

  return {
    employees,
    pendingRequests,
    activities,
    expiringContracts,
    attendances,
    setAttendances,
    selectedBranch,
    setSelectedBranch,
    selectedDept,
    setSelectedDept,
    branches,
    departments: ['Semua Departemen', ...departmentsList],
    departmentsList,
    rolesList,
    addDepartment,
    removeDepartment,
    addRole,
    removeRole,
    payrollStatus,
    payrollHistory,
    broadcasts,
    officeSettings,
    addEmployee,
    sendBroadcast,
    approveRequest,
    rejectRequest,
    renewContract,
    resolveBlocker,
    processPayroll,
    submitPayrollApproval,
    disbursePayroll,
    updateSettings,
    updateEmployeeSalary,
    updateEmployeeProfile,
    shiftMaster,
    shifts,
    updateEmployeeShift,
    updateShiftMaster,
    addPendingRequest: (req) => {
      setPendingRequests(prev => {
        const next = [req, ...prev];
        localStorage.setItem('hris_pending_requests', JSON.stringify(next));
        return next;
      });
    }
  };
}
