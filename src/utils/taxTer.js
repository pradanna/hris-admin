/**
 * taxTer.js — Modul Master Tarif TER (Tarif Efektif Rata-rata)
 * Berdasarkan PMK No. 168/PMK.010/2023 (berlaku 1 Januari 2024)
 * 
 * Kategori TER ditentukan dari Status PTKP karyawan:
 *   Kategori A : TK/0, TK/1, K/0
 *   Kategori B : TK/2, TK/3, K/1, K/2
 *   Kategori C : K/3
 */

// ---------------------------------------------------------------------------
// 1. TABEL TARIF TER (Penghasilan Bruto per BULAN)
//    Setiap entry: { min, max, rate }  (max: null = tidak terbatas)
//    rate = desimal (0.005 = 0.5%)
// ---------------------------------------------------------------------------

/** Kategori A: TK/0, TK/1, K/0 */
const TER_A = [
  { min: 0,          max: 5_400_000,   rate: 0.000 },
  { min: 5_400_001,  max: 5_650_000,   rate: 0.0025 },
  { min: 5_650_001,  max: 6_050_000,   rate: 0.005  },
  { min: 6_050_001,  max: 6_350_000,   rate: 0.0075 },
  { min: 6_350_001,  max: 6_700_000,   rate: 0.010  },
  { min: 6_700_001,  max: 7_050_000,   rate: 0.0125 },
  { min: 7_050_001,  max: 7_550_000,   rate: 0.015  },
  { min: 7_550_001,  max: 8_050_000,   rate: 0.0175 },
  { min: 8_050_001,  max: 8_550_000,   rate: 0.020  },
  { min: 8_550_001,  max: 9_050_000,   rate: 0.0225 },
  { min: 9_050_001,  max: 9_550_000,   rate: 0.025  },
  { min: 9_550_001,  max: 10_050_000,  rate: 0.030  },
  { min: 10_050_001, max: 10_550_000,  rate: 0.035  },
  { min: 10_550_001, max: 11_050_000,  rate: 0.0375 },
  { min: 11_050_001, max: 11_600_000,  rate: 0.040  },
  { min: 11_600_001, max: 12_600_000,  rate: 0.0425 },
  { min: 12_600_001, max: 13_600_000,  rate: 0.045  },
  { min: 13_600_001, max: 14_950_000,  rate: 0.0475 },
  { min: 14_950_001, max: 16_400_000,  rate: 0.050  },
  { min: 16_400_001, max: 18_450_000,  rate: 0.055  },
  { min: 18_450_001, max: 21_850_000,  rate: 0.060  },
  { min: 21_850_001, max: 26_000_000,  rate: 0.065  },
  { min: 26_000_001, max: 27_700_000,  rate: 0.070  },
  { min: 27_700_001, max: 29_350_000,  rate: 0.075  },
  { min: 29_350_001, max: 31_450_000,  rate: 0.080  },
  { min: 31_450_001, max: 33_950_000,  rate: 0.085  },
  { min: 33_950_001, max: 37_100_000,  rate: 0.090  },
  { min: 37_100_001, max: 41_100_000,  rate: 0.095  },
  { min: 41_100_001, max: null,        rate: 0.100  },
];

/** Kategori B: TK/2, TK/3, K/1, K/2 */
const TER_B = [
  { min: 0,          max: 6_200_000,   rate: 0.000  },
  { min: 6_200_001,  max: 6_500_000,   rate: 0.0025 },
  { min: 6_500_001,  max: 6_850_000,   rate: 0.005  },
  { min: 6_850_001,  max: 7_300_000,   rate: 0.0075 },
  { min: 7_300_001,  max: 9_200_000,   rate: 0.010  },
  { min: 9_200_001,  max: 10_750_000,  rate: 0.0125 },
  { min: 10_750_001, max: 11_250_000,  rate: 0.015  },
  { min: 11_250_001, max: 11_600_000,  rate: 0.0175 },
  { min: 11_600_001, max: 12_600_000,  rate: 0.020  },
  { min: 12_600_001, max: 13_600_000,  rate: 0.025  },
  { min: 13_600_001, max: 14_950_000,  rate: 0.030  },
  { min: 14_950_001, max: 16_400_000,  rate: 0.035  },
  { min: 16_400_001, max: 18_450_000,  rate: 0.040  },
  { min: 18_450_001, max: 21_850_000,  rate: 0.045  },
  { min: 21_850_001, max: 26_000_000,  rate: 0.050  },
  { min: 26_000_001, max: 27_700_000,  rate: 0.055  },
  { min: 27_700_001, max: 29_350_000,  rate: 0.060  },
  { min: 29_350_001, max: 31_450_000,  rate: 0.065  },
  { min: 31_450_001, max: 33_950_000,  rate: 0.070  },
  { min: 33_950_001, max: 37_100_000,  rate: 0.075  },
  { min: 37_100_001, max: 41_100_000,  rate: 0.080  },
  { min: 41_100_001, max: null,        rate: 0.085  },
];

/** Kategori C: K/3 */
const TER_C = [
  { min: 0,          max: 6_600_000,   rate: 0.000  },
  { min: 6_600_001,  max: 6_950_000,   rate: 0.0025 },
  { min: 6_950_001,  max: 7_350_000,   rate: 0.005  },
  { min: 7_350_001,  max: 7_800_000,   rate: 0.0075 },
  { min: 7_800_001,  max: 8_850_000,   rate: 0.010  },
  { min: 8_850_001,  max: 9_800_000,   rate: 0.0125 },
  { min: 9_800_001,  max: 10_950_000,  rate: 0.015  },
  { min: 10_950_001, max: 11_200_000,  rate: 0.0175 },
  { min: 11_200_001, max: 12_050_000,  rate: 0.020  },
  { min: 12_050_001, max: 12_950_000,  rate: 0.025  },
  { min: 12_950_001, max: 14_150_000,  rate: 0.030  },
  { min: 14_150_001, max: 15_550_000,  rate: 0.035  },
  { min: 15_550_001, max: 17_050_000,  rate: 0.040  },
  { min: 17_050_001, max: 19_500_000,  rate: 0.045  },
  { min: 19_500_001, max: 22_700_000,  rate: 0.050  },
  { min: 22_700_001, max: 26_600_000,  rate: 0.055  },
  { min: 26_600_001, max: 28_100_000,  rate: 0.060  },
  { min: 28_100_001, max: 30_100_000,  rate: 0.065  },
  { min: 30_100_001, max: 32_600_000,  rate: 0.070  },
  { min: 32_600_001, max: 35_400_000,  rate: 0.075  },
  { min: 35_400_001, max: 38_900_000,  rate: 0.080  },
  { min: 38_900_001, max: null,        rate: 0.085  },
];

const TER_TABLES = { A: TER_A, B: TER_B, C: TER_C };

// ---------------------------------------------------------------------------
// 2. PETA STATUS PTKP → KATEGORI TER
// ---------------------------------------------------------------------------
const PTKP_TO_CATEGORY = {
  'TK/0': 'A',
  'TK/1': 'A',
  'K/0':  'A',
  'TK/2': 'B',
  'TK/3': 'B',
  'K/1':  'B',
  'K/2':  'B',
  'K/3':  'C',
};

/**
 * Daftar semua opsi PTKP beserta label dan kategori TER-nya.
 * Dipakai untuk dropdown di UI.
 */
export const PTKP_OPTIONS = [
  { value: 'TK/0', label: 'TK/0 — Tidak Kawin, 0 Tanggungan', category: 'A' },
  { value: 'TK/1', label: 'TK/1 — Tidak Kawin, 1 Tanggungan', category: 'A' },
  { value: 'K/0',  label: 'K/0  — Kawin, 0 Tanggungan',       category: 'A' },
  { value: 'TK/2', label: 'TK/2 — Tidak Kawin, 2 Tanggungan', category: 'B' },
  { value: 'TK/3', label: 'TK/3 — Tidak Kawin, 3 Tanggungan', category: 'B' },
  { value: 'K/1',  label: 'K/1  — Kawin, 1 Tanggungan',       category: 'B' },
  { value: 'K/2',  label: 'K/2  — Kawin, 2 Tanggungan',       category: 'B' },
  { value: 'K/3',  label: 'K/3  — Kawin, 3 Tanggungan',       category: 'C' },
];

// ---------------------------------------------------------------------------
// 3. FUNGSI UTAMA
// ---------------------------------------------------------------------------

/**
 * Mendapatkan kategori TER dari status PTKP.
 * Default ke 'A' jika tidak dikenali.
 */
export function getPtkpCategory(ptkpStatus) {
  return PTKP_TO_CATEGORY[ptkpStatus] || 'A';
}

/**
 * Mendapatkan persentase tarif TER untuk kategori dan penghasilan bruto tertentu.
 * @param {'A'|'B'|'C'} category 
 * @param {number} grossMonthly  Penghasilan bruto bulanan (Rupiah)
 * @returns {number} Tarif sebagai desimal (mis. 0.025 = 2.5%)
 */
export function getTerRate(category, grossMonthly) {
  const table = TER_TABLES[category] || TER_A;
  const bracket = table.find(
    b => grossMonthly >= b.min && (b.max === null || grossMonthly <= b.max)
  );
  return bracket ? bracket.rate : 0;
}

/**
 * Mengecek apakah karyawan dianggap memiliki NPWP valid.
 * Karyawan dianggap punya NPWP jika field npwpNumber terisi (bukan kosong/'-').
 */
export function hasValidNpwp(emp) {
  const n = emp.npwpNumber || '';
  return n.trim() !== '' && n.trim() !== '-';
}

/**
 * Menghitung potongan PPh 21 menggunakan metode TER.
 * 
 * @param {object} emp       Data karyawan (butuh: ptkpStatus, npwpNumber)
 * @param {number} grossIncome  Penghasilan bruto bulanan total (termasuk semua tunjangan)
 * @param {'gross'|'nett'} method  Metode pemotongan ('gross' = dipotong karyawan, 'nett' = ditanggung perusahaan)
 * 
 * @returns {{
 *   pphAmount: number,      Nominal PPh 21 (Rupiah)
 *   terRate: number,        Tarif TER yang berlaku (desimal)
 *   terRatePercent: string, Tarif TER dalam format "X.XX%"
 *   category: 'A'|'B'|'C', Kategori TER
 *   ptkpStatus: string,     Status PTKP karyawan
 *   hasNpwp: boolean,       Apakah memiliki NPWP
 *   npwpPenalty: boolean,   Apakah dikenakan penalti 20% (tidak punya NPWP)
 *   isNett: boolean,        Apakah ditanggung perusahaan
 * }}
 */
export function calculatePph21(emp, grossIncome, method = 'gross') {
  const ptkpStatus = emp.ptkpStatus || 'TK/0';
  const category   = getPtkpCategory(ptkpStatus);
  const terRate    = getTerRate(category, grossIncome);
  const empHasNpwp = hasValidNpwp(emp);

  // Penalti 20% lebih tinggi jika tidak punya NPWP (Pasal 21 ayat 5a UU HPP)
  const effectiveRate = empHasNpwp ? terRate : terRate * 1.2;

  const basePph = Math.round(grossIncome * effectiveRate);
  const pphAmount = basePph;

  return {
    pphAmount,
    terRate,
    effectiveRate,
    terRatePercent: `${(terRate * 100).toFixed(2)}%`,
    effectiveRatePercent: `${(effectiveRate * 100).toFixed(2)}%`,
    category,
    ptkpStatus,
    hasNpwp: empHasNpwp,
    npwpPenalty: !empHasNpwp && terRate > 0,
    isNett: method === 'nett',
  };
}

/**
 * Format angka ke format Rupiah.
 */
export function formatRp(amount) {
  return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
}
