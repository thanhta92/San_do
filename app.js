/**
 * BIỂU ĐỒ CHUYỂN DẠ (PARTOGRAPH) - BỆNH VIỆN MỸ ĐỨC PHÚ NHUẬN
 * Mã số biểu mẫu: MS: TD-03 • MĐPN.028.PS.02.028
 * Module: Quản lý ma trận lưới động, tỷ lệ thời gian thực và nhập liệu lâm sàng
 */

// ==============================================================
// 1. CONFIGURATION & CONSTANTS
// ==============================================================

const CONFIG = {
  pxPerMinute: 1.0,        // 1 phút = 1px => 60 phút = 60px
  minColWidth: 50,         // Chiều rộng tối thiểu = 50px
  defaultColWidth: 60,     // 1 ô chuẩn 60 phút = 60px
  defaultCols: 10,         // 10 cột = 600px
  fhrHeight: 70,           // Chiều cao phần Tim thai
  cervixTickHeight: 20,    // 20px mỗi cm (12 nấc: 0-10 cm + vạch +3)
  vitalsTickHeight: 14,
  cntTickHeight: 20,       // 20px mỗi cơn co (6 nấc từ 1 đến 6)
  currentUser: "NHS. LÊ THỊ HỒNG"
};

// Mock Treatment Sheet Data (Dữ liệu lịch sử từ Tờ điều trị bệnh án điện tử)
const MOCK_TREATMENT_RECORDS = [
  {
    id: "treat-1", date: "22/09/2026", time: "06:30", laborHour: 0,
    dilation: 3.5, descent: 5, liquor: "KR", molding: "0", position: "TT",
    fhr: 142, cntCount: 2, cntDur: "mild", pulse: 76, bpSys: 110, bpDia: 70, temp: 36.6,
    urineProtein: "-", urineAcetone: "-", urineVolume: 250, oxytocin: "", oxytocinUnit: "giọt/phút",
    drugs: "Theo dõi chuyển dạ pha tiềm tàng", examiner: "NHS. LÊ THỊ HỒNG",
    notes: "Khám vào viện: Cổ tử cung mở 3.5cm, ngôi đầu cao lỏng"
  },
  {
    id: "treat-2", date: "22/09/2026", time: "08:00", laborHour: 0,
    dilation: 4.0, descent: 4, liquor: "↓", molding: "0", position: "TT",
    fhr: 140, cntCount: 3, cntDur: "moderate", pulse: 78, bpSys: 110, bpDia: 70, temp: 36.7,
    urineProtein: "-", urineAcetone: "-", urineVolume: 200, oxytocin: "", oxytocinUnit: "giọt/phút",
    drugs: "Ringer lactate 500ml", examiner: "BS. TRẦN VĂN AN",
    notes: "CTC mở 4cm, xóa 70%, ối vỡ tự nhiên dịch trong, bắt đầu pha tích cực"
  },
  {
    id: "treat-3", date: "22/09/2026", time: "09:00", laborHour: 1.0,
    dilation: 4.5, descent: 4, liquor: "T", molding: "0", position: "TT",
    fhr: 140, cntCount: 3, cntDur: "moderate", pulse: 80, bpSys: 115, bpDia: 70, temp: 36.8,
    urineProtein: "-", urineAcetone: "-", urineVolume: 180, oxytocin: "", oxytocinUnit: "giọt/phút",
    drugs: "Ringer lactate 500ml", examiner: "NHS. LÊ THỊ HỒNG",
    notes: "Tim thai 140 l/p đều rõ, cơn gò 3 cơn/10 phút"
  },
  {
    id: "treat-4", date: "22/09/2026", time: "10:00", laborHour: 2.0,
    dilation: 5.5, descent: 3, liquor: "T", molding: "0", position: "TT",
    fhr: 142, cntCount: 3, cntDur: "moderate", pulse: 82, bpSys: 115, bpDia: 75, temp: 36.9,
    urineProtein: "-", urineAcetone: "-", urineVolume: 150, oxytocin: "", oxytocinUnit: "giọt/phút",
    drugs: "", examiner: "NHS. LÊ THỊ HỒNG",
    notes: "CTC mở 5.5cm, đầu chúc 3/5, ối trong"
  },
  {
    id: "treat-5", date: "22/09/2026", time: "11:30", laborHour: 3.5,
    dilation: 7.0, descent: 2, liquor: "T", molding: "+", position: "TT",
    fhr: 138, cntCount: 4, cntDur: "strong", pulse: 86, bpSys: 120, bpDia: 80, temp: 37.0,
    urineProtein: "-", urineAcetone: "-", urineVolume: 100, oxytocin: "8", oxytocinUnit: "giọt/phút",
    drugs: "Oxytocin 5 UI pha Dextrose 5%", examiner: "BS. TRẦN VĂN AN",
    notes: "CTC mở 7cm, mép mỏng mềm, đầu lọt cao 2/5. Tăng co Oxytocin 8 g/p"
  },
  {
    id: "treat-6", date: "22/09/2026", time: "12:30", laborHour: 4.5,
    dilation: 9.0, descent: 1, liquor: "T", molding: "+", position: "CV",
    fhr: 144, cntCount: 4, cntDur: "strong", pulse: 92, bpSys: 125, bpDia: 80, temp: 37.1,
    urineProtein: "-", urineAcetone: "-", urineVolume: 100, oxytocin: "12", oxytocinUnit: "giọt/phút",
    drugs: "Duy trì Oxytocin 12 g/p", examiner: "NHS. LÊ THỊ HỒNG",
    notes: "CTC mở 9cm, sản phụ mót rặn nhẹ"
  },
  {
    id: "treat-7", date: "22/09/2026", time: "13:30", laborHour: 5.5,
    dilation: 10.0, descent: 0, liquor: "T", molding: "+", position: "CV",
    fhr: 140, cntCount: 5, cntDur: "strong", pulse: 96, bpSys: 130, bpDia: 85, temp: 37.2,
    urineProtein: "-", urineAcetone: "-", urineVolume: 80, oxytocin: "12", oxytocinUnit: "giọt/phút",
    drugs: "Chuyển rặn đẻ tại bàn sinh", examiner: "BS. TRẦN VĂN AN",
    notes: "CTC mở trọn 10cm, đầu lọt thấp 0/5. Hướng dẫn rặn đẻ"
  }
];

// Presets Data
const PRESETS = {
  demo_time_gap: {
    name: "Minh họa co giãn thời gian (09:00, 10:00, 11:30, 12:30)",
    patient: {
      name: "NGUYỄN THỊ MAI", age: 28, recordId: "2026/OB-0492", bed: "Phòng sinh 02",
      para: "0000 (Con so)", diag: "Thai 39 tuần 2 ngày chuyển dạ hoạt động",
      admitTime: "06:00", admitDate: "22/09/2026", chartDate: "22/09/2026",
      ruptured: true, ruptureTime: "07:30"
    },
    observations: [
      {
        id: "obs-1", date: "22/09/2026", time: "09:00", minutesFromStart: 0, laborHour: 0,
        dilation: 4.0, descent: -1, liquor: "↓", molding: "0", position: "TT",
        fhr: 140, cntCount: 3, cntDur: "moderate", oxytocinVal: "", oxytocinUnit: "giọt/phút",
        drugs: "Ringer lactate 500ml", pulse: 79, bpSys: 110, bpDia: 70, temp: 36.7,
        urineProtein: "-", urineAcetone: "-", urineVolume: 200, examiner: "NHS. LÊ THỊ HỒNG",
        notes: "Ối vỡ tự nhiên lúc 07:30, dịch trong. Cổ tử cung mở 4cm xóa 70%."
      },
      {
        id: "obs-2", date: "22/09/2026", time: "10:00", minutesFromStart: 60, laborHour: 1.0,
        dilation: 5.0, descent: -1, liquor: "TĐ", molding: "0", position: "TT",
        fhr: 138, cntCount: 3, cntDur: "moderate", oxytocinVal: "", oxytocinUnit: "giọt/phút",
        drugs: "", pulse: 82, bpSys: 115, bpDia: 75, temp: 36.8,
        urineProtein: "-", urineAcetone: "-", urineVolume: 150, examiner: "NHS. LÊ THỊ HỒNG",
        notes: "Tim thai nghe rõ 138 l/p. Cơn co tử cung đều đặn 3 cơn/10 phút."
      },
      {
        id: "obs-3", date: "22/09/2026", time: "11:30", minutesFromStart: 150, laborHour: 2.5,
        dilation: 6.5, descent: 0, liquor: "TT", molding: "+", position: "TT",
        fhr: 142, cntCount: 4, cntDur: "strong", oxytocinVal: "8", oxytocinUnit: "giọt/phút",
        drugs: "Oxytocin 5 UI pha Dextrose 5%", pulse: 86, bpSys: 120, bpDia: 80, temp: 37.0,
        urineProtein: "-", urineAcetone: "-", urineVolume: 120, examiner: "BS. TRẦN VĂN AN",
        notes: "Khoảng cách 90 phút (1.5 giờ). Tăng co Oxytocin 8 giọt/phút."
      },
      {
        id: "obs-4", date: "22/09/2026", time: "12:30", minutesFromStart: 210, laborHour: 3.5,
        dilation: 9.0, descent: 1, liquor: "TT", molding: "+", position: "CV",
        fhr: 144, cntCount: 4, cntDur: "strong", oxytocinVal: "12", oxytocinUnit: "giọt/phút",
        drugs: "Duy trì Oxytocin 12 giọt/phút", pulse: 90, bpSys: 120, bpDia: 80, temp: 37.1,
        urineProtein: "-", urineAcetone: "-", urineVolume: 100, examiner: "BS. TRẦN VĂN AN",
        notes: "Khoảng cách 60 phút (1 giờ). Đầu lọt +1, sản phụ mót rặn nhẹ."
      }
    ]
  },
  normal: {
    name: "1. Chuyển dạ thường tiến triển tốt",
    patient: {
      name: "NGUYỄN THỊ MAI", age: 28, recordId: "2026/OB-0492", bed: "Phòng sinh 02",
      para: "0000", diag: "Thai 39 tuần chuyển dạ hoạt động",
      admitTime: "06:00", admitDate: "22/09/2026", chartDate: "22/09/2026",
      ruptured: true, ruptureTime: "07:30"
    },
    observations: [
      {
        id: "n-1", date: "22/09/2026", time: "08:00", minutesFromStart: 0, laborHour: 0,
        dilation: 4.0, descent: -3, liquor: "T", molding: "0", position: "TT",
        fhr: 140, cntCount: 3, cntDur: "moderate", oxytocinVal: "", oxytocinUnit: "giọt/phút", drugs: "",
        pulse: 80, bpSys: 110, bpDia: 70, temp: 36.8, urineProtein: "-", urineAcetone: "-", urineVolume: 200, examiner: "NHS. HỒNG"
      },
      {
        id: "n-2", date: "22/09/2026", time: "09:00", minutesFromStart: 60, laborHour: 1.0,
        dilation: 5.0, descent: -2, liquor: "T", molding: "0", position: "TT",
        fhr: 138, cntCount: 3, cntDur: "moderate", oxytocinVal: "", oxytocinUnit: "giọt/phút", drugs: "",
        pulse: 82, bpSys: 115, bpDia: 75, temp: 36.9, urineProtein: "-", urineAcetone: "-", urineVolume: 150, examiner: "NHS. HỒNG"
      },
      {
        id: "n-3", date: "22/09/2026", time: "10:00", minutesFromStart: 120, laborHour: 2.0,
        dilation: 6.5, descent: -1, liquor: "T", molding: "0", position: "TT",
        fhr: 142, cntCount: 4, cntDur: "moderate", oxytocinVal: "", oxytocinUnit: "giọt/phút", drugs: "",
        pulse: 84, bpSys: 120, bpDia: 80, temp: 37.0, urineProtein: "-", urineAcetone: "-", urineVolume: 120, examiner: "NHS. HỒNG"
      },
      {
        id: "n-4", date: "22/09/2026", time: "11:00", minutesFromStart: 180, laborHour: 3.0,
        dilation: 8.0, descent: 1, liquor: "T", molding: "+", position: "CV",
        fhr: 136, cntCount: 4, cntDur: "strong", oxytocinVal: "", oxytocinUnit: "giọt/phút", drugs: "",
        pulse: 88, bpSys: 120, bpDia: 80, temp: 37.1, urineProtein: "-", urineAcetone: "-", urineVolume: 100, examiner: "BS. AN"
      },
      {
        id: "n-5", date: "22/09/2026", time: "12:00", minutesFromStart: 240, laborHour: 4.0,
        dilation: 10.0, descent: 3, liquor: "T", molding: "+", position: "CV",
        fhr: 140, cntCount: 5, cntDur: "strong", oxytocinVal: "", oxytocinUnit: "giọt/phút", drugs: "Sinh thường",
        pulse: 92, bpSys: 125, bpDia: 85, temp: 37.0, urineProtein: "-", urineAcetone: "-", urineVolume: 80, examiner: "BS. AN"
      }
    ]
  },
  prolonged: {
    name: "2. Chậm tiến triển vượt đường báo động",
    patient: {
      name: "LÊ THỊ THỦY", age: 30, recordId: "2026/OB-0520", bed: "Phòng sinh 03",
      para: "0000", diag: "Chuyển dạ kéo dài do cơn gò yếu",
      admitTime: "05:00", admitDate: "22/09/2026", chartDate: "22/09/2026",
      ruptured: true, ruptureTime: "06:00"
    },
    observations: [
      {
        id: "p-1", date: "22/09/2026", time: "06:00", minutesFromStart: 0, laborHour: 0,
        dilation: 4.0, descent: -3, liquor: "T", molding: "0", position: "TT",
        fhr: 144, cntCount: 2, cntDur: "mild", oxytocinVal: "", oxytocinUnit: "giọt/phút", drugs: "",
        pulse: 78, bpSys: 110, bpDia: 70, temp: 36.6, urineProtein: "-", urineAcetone: "-", urineVolume: 200, examiner: "NHS. HỒNG"
      },
      {
        id: "p-2", date: "22/09/2026", time: "08:00", minutesFromStart: 120, laborHour: 2.0,
        dilation: 4.5, descent: -3, liquor: "T", molding: "0", position: "TT",
        fhr: 140, cntCount: 2, cntDur: "mild", oxytocinVal: "", oxytocinUnit: "giọt/phút", drugs: "Trình BS: Gò thưa",
        pulse: 80, bpSys: 115, bpDia: 70, temp: 36.8, urineProtein: "-", urineAcetone: "-", urineVolume: 150, examiner: "NHS. HỒNG"
      },
      {
        id: "p-3", date: "22/09/2026", time: "10:00", minutesFromStart: 240, laborHour: 4.0,
        dilation: 5.0, descent: -2, liquor: "T", molding: "+", position: "TT",
        fhr: 138, cntCount: 2, cntDur: "mild", oxytocinVal: "8", oxytocinUnit: "giọt/phút", drugs: "Tăng co Oxytocin 5UI",
        pulse: 84, bpSys: 120, bpDia: 75, temp: 37.0, urineProtein: "-", urineAcetone: "-", urineVolume: 120, examiner: "BS. AN"
      },
      {
        id: "p-4", date: "22/09/2026", time: "11:30", minutesFromStart: 330, laborHour: 5.5,
        dilation: 7.5, descent: 0, liquor: "T", molding: "+", position: "CV",
        fhr: 142, cntCount: 4, cntDur: "strong", oxytocinVal: "12", oxytocinUnit: "giọt/phút", drugs: "",
        pulse: 88, bpSys: 120, bpDia: 80, temp: 37.1, urineProtein: "-", urineAcetone: "-", urineVolume: 100, examiner: "NHS. HỒNG"
      },
      {
        id: "p-5", date: "22/09/2026", time: "13:00", minutesFromStart: 420, laborHour: 7.0,
        dilation: 10.0, descent: 3, liquor: "T", molding: "+", position: "CV",
        fhr: 140, cntCount: 5, cntDur: "strong", oxytocinVal: "12", oxytocinUnit: "giọt/phút", drugs: "Mở trọn",
        pulse: 92, bpSys: 125, bpDia: 80, temp: 37.0, urineProtein: "-", urineAcetone: "-", urineVolume: 80, examiner: "BS. AN"
      }
    ]
  },
  alert_action: {
    name: "3. Bất tương xứng đầu chậu (Chạm đường hành động)",
    patient: {
      name: "PHẠM THU TRANG", age: 32, recordId: "2026/OB-0588", bed: "Phòng sinh 04",
      para: "0000 (Thai to ước lượng 3900g)", diag: "Chuyển dạ ngưng tiến triển / BXĐC",
      admitTime: "04:00", admitDate: "22/09/2026", chartDate: "22/09/2026",
      ruptured: true, ruptureTime: "05:00"
    },
    observations: [
      {
        id: "c-1", date: "22/09/2026", time: "05:00", minutesFromStart: 0, laborHour: 0,
        dilation: 4.0, descent: -3, liquor: "T", molding: "0", position: "TT",
        fhr: 140, cntCount: 3, cntDur: "moderate", oxytocinVal: "", oxytocinUnit: "giọt/phút", drugs: "",
        pulse: 80, bpSys: 120, bpDia: 80, temp: 36.8, urineProtein: "-", urineAcetone: "-", urineVolume: 180, examiner: "NHS. HỒNG"
      },
      {
        id: "c-2", date: "22/09/2026", time: "07:00", minutesFromStart: 120, laborHour: 2.0,
        dilation: 5.0, descent: -3, liquor: "T", molding: "+", position: "TT",
        fhr: 136, cntCount: 3, cntDur: "moderate", oxytocinVal: "", oxytocinUnit: "giọt/phút", drugs: "",
        pulse: 82, bpSys: 120, bpDia: 80, temp: 37.0, urineProtein: "-", urineAcetone: "-", urineVolume: 150, examiner: "NHS. HỒNG"
      },
      {
        id: "c-3", date: "22/09/2026", time: "09:00", minutesFromStart: 240, laborHour: 4.0,
        dilation: 6.0, descent: -3, liquor: "T", molding: "++", position: "TT",
        fhr: 138, cntCount: 4, cntDur: "strong", oxytocinVal: "8", oxytocinUnit: "giọt/phút", drugs: "Oxytocin thử thách",
        pulse: 86, bpSys: 125, bpDia: 80, temp: 37.2, urineProtein: "-", urineAcetone: "-", urineVolume: 120, examiner: "BS. AN"
      },
      {
        id: "c-4", date: "22/09/2026", time: "11:00", minutesFromStart: 360, laborHour: 6.0,
        dilation: 6.0, descent: -3, liquor: "T", molding: "+++", position: "TT",
        fhr: 134, cntCount: 4, cntDur: "strong", oxytocinVal: "12", oxytocinUnit: "giọt/phút", drugs: "Hội chẩn",
        pulse: 92, bpSys: 130, bpDia: 85, temp: 37.4, urineProtein: "-", urineAcetone: "-", urineVolume: 100, examiner: "BS. AN"
      },
      {
        id: "c-5", date: "22/09/2026", time: "13:00", minutesFromStart: 480, laborHour: 8.0,
        dilation: 6.0, descent: -3, liquor: "T", molding: "+++", position: "TT",
        fhr: 130, cntCount: 5, cntDur: "strong", oxytocinVal: "Ngưng", oxytocinUnit: "giọt/phút", drugs: "HCMLT Cấp cứu",
        pulse: 104, bpSys: 145, bpDia: 90, temp: 37.8, urineProtein: "+", urineAcetone: "-", urineVolume: 70, examiner: "BS. AN"
      }
    ]
  }
};

// Application State
let appData = {
  patient: { ...PRESETS.demo_time_gap.patient },
  observations: JSON.parse(JSON.stringify(PRESETS.demo_time_gap.observations)),
  defaultOxytocinUnit: 'giọt/phút'
};

// ==============================================================
// 2. DOM CACHE
// ==============================================================

const el = {
  container: document.getElementById('matrixColumnsContainer'),
  svgOverlay: document.getElementById('matrixSvgOverlay'),
  tooltip: document.getElementById('matrixTooltip'),
  toastBox: document.getElementById('appToastBox'),
  sidebar: document.getElementById('patientSidebarCol'),

  headerDrugs: document.querySelector('.sec-drugs'),
  headerClinical: document.querySelector('.sec-clinical'),
  headerNhs: document.querySelector('.sec-nhs'),
  headerPulse: document.querySelector('.sec-pulse'),
  headerBp: document.querySelector('.sec-bp'),
  secFhr: document.querySelector('.sec-fhr'),
  secCervix: document.querySelector('.sec-cervix-descent'),
  oxytocinHeaderUnit: document.getElementById('oxytocinHeaderUnit'),

  modal: document.getElementById('obsModal'),
  modalObsTitle: document.getElementById('modalObsTitle'),
  form: document.getElementById('obsForm'),
  btnSaveObservation: document.getElementById('btnSaveObservation'),
  btnQuickOpen: document.getElementById('btnQuickOpenObs'),
  btnCloseModal: document.getElementById('btnCloseObsModal'),
  btnCancelModal: document.getElementById('btnCancelModal'),
  btnDeleteObs: document.getElementById('btnDeleteObservation'),
  btnPrint: document.getElementById('btnPrintPartograph'),
  btnReset: document.getElementById('btnResetChart'),
  btnPresetMenu: document.getElementById('btnPresetMenu'),
  presetDropdownList: document.getElementById('presetDropdownList'),

  btnLoadTreatment: document.getElementById('btnLoadTreatmentRecord'),
  treatmentModal: document.getElementById('treatmentRecordsModal'),
  treatmentRecordsList: document.getElementById('treatmentRecordsList'),
  searchTreatmentInput: document.getElementById('searchTreatmentInput'),
  btnCloseTreatmentModal: document.getElementById('btnCloseTreatmentModal'),
  btnCancelTreatmentModal: document.getElementById('btnCancelTreatmentModal'),

  editObsId: document.getElementById('editObsId'),
  inputObsDate: document.getElementById('inputObsDate'),
  inputObsTime: document.getElementById('inputObsTime'),
  inputLaborHour: document.getElementById('inputLaborHour'),
  inputNHSName: document.getElementById('inputNHSName'),
  inputClinicalNote: document.getElementById('inputClinicalNote'),
  dispTimeDelta: document.getElementById('dispTimeDelta'),
  inputDilation: document.getElementById('inputDilation'),
  inputDescent: document.getElementById('inputDescent'),
  inputLiquor: document.getElementById('inputLiquor'),
  inputLiquorCustom: document.getElementById('inputLiquorCustom'),
  inputMolding: document.getElementById('inputMolding'),
  inputPosition: document.getElementById('inputPosition'),
  inputCaput: document.getElementById('inputCaput'),
  inputAsynclitism: document.getElementById('inputAsynclitism'),
  inputFHR: document.getElementById('inputFHR'),
  inputContractionCount: document.getElementById('inputContractionCount'),
  inputContractionDur: document.getElementById('inputContractionDur'),
  inputOxytocinVal: document.getElementById('inputOxytocinVal'),
  inputOxytocinUnit: document.getElementById('inputOxytocinUnit'),
  oxytocinUnitNotice: document.getElementById('oxytocinUnitNotice'),
  inputDrugs: document.getElementById('inputDrugs'),
  inputPulse: document.getElementById('inputPulse'),
  inputBpCombined: document.getElementById('inputBpCombined'),
  inputBpSys: document.getElementById('inputBpSys'),
  inputBpDia: document.getElementById('inputBpDia'),
  inputTemp: document.getElementById('inputTemp'),
  inputUrineProtein: document.getElementById('inputUrineProtein'),
  inputUrineAcetone: document.getElementById('inputUrineAcetone'),
  inputUrineVolume: document.getElementById('inputUrineVolume'),

  btnCopyPrevUrineProtein: document.getElementById('btnCopyPrevUrineProtein'),
  btnCopyPrevUrineAcetone: document.getElementById('btnCopyPrevUrineAcetone'),
  btnCopyPrevOxytocin: document.getElementById('btnCopyPrevOxytocin'),
  btnCopyPrevDrugs: document.getElementById('btnCopyPrevDrugs'),

  patientNameInput: document.getElementById('patientNameInput'),
  patientAgeInput: document.getElementById('patientAgeInput'),
  patientRecordInput: document.getElementById('patientRecordInput'),
  patientBedInput: document.getElementById('patientBedInput'),
  patientParaInput: document.getElementById('patientParaInput'),
  patientDiagInput: document.getElementById('patientDiagInput'),
  patientAdmitTimeInput: document.getElementById('patientAdmitTimeInput'),
  patientAdmitDateInput: document.getElementById('patientAdmitDateInput'),
  patientChartDateInput: document.getElementById('patientChartDateInput'),
  patientRuptureTimeInput: document.getElementById('patientRuptureTimeInput'),
  chkIntactMembrane: document.getElementById('chkIntactMembrane'),
  chkRupturedMembrane: document.getElementById('chkRupturedMembrane'),

  pulseWarning: document.getElementById('pulseWarning'),
  bpSysWarning: document.getElementById('bpSysWarning'),
  bpDiaWarning: document.getElementById('bpDiaWarning'),
  tempWarning: document.getElementById('tempWarning')
};

let previousOxytocinUnit = 'giọt/phút';

// ==============================================================
// 3. INITIALIZATION & LIFECYCLE
// ==============================================================

document.addEventListener('DOMContentLoaded', initApp);

window.addEventListener('load', () => requestAnimationFrame(renderSvgOverlay));
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => requestAnimationFrame(renderSvgOverlay));
}

function initApp() {
  bindEvents();
  renderAll();
  openModalForAdd();
}

// ==============================================================
// 4. EVENT BINDINGS & REALTIME INPUT SETUP
// ==============================================================

function bindEvents() {
  // Preset Menu
  if (el.btnPresetMenu && el.presetDropdownList) {
    el.btnPresetMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      el.presetDropdownList.classList.toggle('show');
    });
    document.addEventListener('click', () => el.presetDropdownList.classList.remove('show'));
  }

  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const pKey = item.getAttribute('data-preset');
      if (pKey && PRESETS[pKey]) {
        loadPreset(pKey);
        showToast(`Đã tải ca mẫu: ${PRESETS[pKey].name}`, 'info');
      }
    });
  });

  // Modal Actions
  if (el.btnQuickOpen) el.btnQuickOpen.addEventListener('click', () => openModalForAdd());
  if (el.btnCloseModal) el.btnCloseModal.addEventListener('click', closeModal);
  if (el.btnCancelModal) el.btnCancelModal.addEventListener('click', closeModal);
  if (el.btnDeleteObs) el.btnDeleteObs.addEventListener('click', deleteCurrentObs);
  if (el.btnSaveObservation) el.btnSaveObservation.addEventListener('click', handleFormSubmit);

  if (el.form) {
    el.form.addEventListener('submit', (e) => { e.preventDefault(); handleFormSubmit(e); });
    el.form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleFormSubmit(e);
      }
    });
  }

  // --- Realtime Input Setup with Masking & Constraints ---
  setupTimeInput(el.inputObsTime, () => calculateTimeDeltaDisplay());
  setupDateInput(el.inputObsDate);

  setupNumericClamp(el.inputFHR, 3, 0, 250);
  setupNumericClamp(el.inputContractionCount, 1, 1, 6);
  setupNumericClamp(el.inputPulse, 3, 0, 250, () => checkLiveWarnings());
  setupNumericClamp(el.inputUrineVolume, 4, 0, 2000);

  setupDilationInput(el.inputDilation);
  setupBpInput(el.inputBpCombined, () => checkLiveWarnings());
  setupTempInput(el.inputTemp, () => checkLiveWarnings());
  setupOxytocinInput(el.inputOxytocinVal);

  if (el.inputBpSys) el.inputBpSys.addEventListener('input', checkLiveWarnings);
  if (el.inputBpDia) el.inputBpDia.addEventListener('input', checkLiveWarnings);

  // Quick Copy Previous Value Actions
  if (el.btnCopyPrevUrineProtein) {
    el.btnCopyPrevUrineProtein.addEventListener('click', () => {
      const prev = getPrecedingObservation();
      if (prev && prev.urineProtein) {
        el.inputUrineProtein.value = prev.urineProtein;
        showToast(`Đã lấy Đạm niệu mốc trước (${prev.time || ''}): ${prev.urineProtein}`, 'info');
      } else {
        showToast('Chưa có dữ liệu Đạm niệu ở mốc trước đó', 'warning');
      }
    });
  }

  if (el.btnCopyPrevUrineAcetone) {
    el.btnCopyPrevUrineAcetone.addEventListener('click', () => {
      const prev = getPrecedingObservation();
      if (prev && prev.urineAcetone) {
        el.inputUrineAcetone.value = prev.urineAcetone;
        showToast(`Đã lấy Keton niệu mốc trước (${prev.time || ''}): ${prev.urineAcetone}`, 'info');
      } else {
        showToast('Chưa có dữ liệu Keton niệu ở mốc trước đó', 'warning');
      }
    });
  }

  if (el.btnCopyPrevOxytocin) {
    el.btnCopyPrevOxytocin.addEventListener('click', () => {
      const prev = getPrecedingObservation();
      if (prev && (prev.oxytocinVal !== undefined && prev.oxytocinVal !== '')) {
        el.inputOxytocinVal.value = prev.oxytocinVal;
        if (prev.oxytocinUnit && el.inputOxytocinUnit) {
          el.inputOxytocinUnit.value = prev.oxytocinUnit;
        }
        showToast(`Đã lấy Oxytocin mốc trước (${prev.time || ''}): ${prev.oxytocinVal} ${prev.oxytocinUnit || ''}`, 'info');
      } else {
        showToast('Chưa có dữ liệu Oxytocin ở mốc trước đó', 'warning');
      }
    });
  }

  if (el.btnCopyPrevDrugs) {
    el.btnCopyPrevDrugs.addEventListener('click', () => {
      const prev = getPrecedingObservation();
      if (prev && prev.drugs) {
        el.inputDrugs.value = prev.drugs;
        showToast(`Đã lấy Thuốc đã dùng mốc trước (${prev.time || ''}): ${prev.drugs}`, 'info');
      } else {
        showToast('Chưa có dữ liệu Thuốc ở mốc trước đó', 'warning');
      }
    });
  }

  // Treatment Modal Events
  if (el.btnLoadTreatment) el.btnLoadTreatment.addEventListener('click', openTreatmentRecordsModal);
  if (el.btnCloseTreatmentModal) el.btnCloseTreatmentModal.addEventListener('click', closeTreatmentRecordsModal);
  if (el.btnCancelTreatmentModal) el.btnCancelTreatmentModal.addEventListener('click', closeTreatmentRecordsModal);
  if (el.searchTreatmentInput) el.searchTreatmentInput.addEventListener('input', filterTreatmentRecords);

  if (el.inputOxytocinUnit) {
    el.inputOxytocinUnit.addEventListener('change', handleOxytocinUnitChange);
  }

  bindPatientInfoInputs();

  if (el.btnPrint) el.btnPrint.addEventListener('click', () => window.print());
  if (el.btnReset) {
    el.btnReset.addEventListener('click', () => {
      if (confirm('Làm mới toàn bộ biểu đồ chuyển dạ?')) {
        appData.observations = [];
        renderAll();
        showToast('Đã làm mới dữ liệu', 'info');
      }
    });
  }

  // Throttled Resize
  let resizeRafId = null;
  const onThrottledResize = () => {
    if (resizeRafId) cancelAnimationFrame(resizeRafId);
    resizeRafId = requestAnimationFrame(() => {
      syncDynamicTextRowsHeight();
      syncVitalsRowHeight();
      renderSvgOverlay();
    });
  };
  window.addEventListener('resize', onThrottledResize, { passive: true });

  if (window.ResizeObserver && el.container) {
    const ro = new ResizeObserver(() => {
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(renderSvgOverlay);
    });
    ro.observe(el.container);
  }
}

// --- Helper Functions for Form Input Constraints & Formatting ---

function setupTimeInput(domEl, onExtra) {
  if (!domEl) return;
  domEl.setAttribute('maxlength', '5');
  domEl.addEventListener('input', (e) => {
    let v = e.target.value.replace(/[^\d:]/g, '');
    if (v.length > 5) v = v.slice(0, 5);
    const digits = v.replace(/[^\d]/g, '');
    if (digits.length === 4) {
      let h = Math.min(23, Math.max(0, parseInt(digits.substring(0, 2), 10) || 0));
      let m = Math.min(59, Math.max(0, parseInt(digits.substring(2, 4), 10) || 0));
      v = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    } else if (digits.length === 2 && !v.includes(':') && e.inputType !== 'deleteContentBackward') {
      let h = Math.min(23, Math.max(0, parseInt(digits, 10) || 0));
      v = `${String(h).padStart(2, '0')}:`;
    }
    e.target.value = v;
    if (onExtra) onExtra();
  });
  domEl.addEventListener('blur', (e) => {
    if (e.target.value.trim()) {
      e.target.value = format24hTime(e.target.value);
      if (onExtra) onExtra();
    }
  });
  if (onExtra) domEl.addEventListener('change', onExtra);
}

function setupDateInput(domEl, onExtra) {
  if (!domEl) return;
  domEl.setAttribute('maxlength', '10');
  domEl.addEventListener('input', (e) => {
    let v = e.target.value.replace(/[^\d\/]/g, '');
    if (v.length > 10) v = v.slice(0, 10);
    const digits = v.replace(/[^\d]/g, '');
    if (digits.length === 8) {
      v = formatDdmmyyyy(digits);
    } else if (digits.length === 2 && !v.includes('/') && e.inputType !== 'deleteContentBackward') {
      let d = Math.min(31, Math.max(1, parseInt(digits, 10) || 1));
      v = `${String(d).padStart(2, '0')}/`;
    } else if (digits.length === 4 && v.split('/').length === 2 && e.inputType !== 'deleteContentBackward') {
      let m = Math.min(12, Math.max(1, parseInt(digits.substring(2, 4), 10) || 1));
      v = `${v.substring(0, 3)}${String(m).padStart(2, '0')}/`;
    }
    e.target.value = v;
    if (onExtra) onExtra();
  });
  domEl.addEventListener('blur', (e) => {
    if (e.target.value.trim()) {
      e.target.value = formatDdmmyyyy(e.target.value);
      if (onExtra) onExtra();
    }
  });
}

function setupNumericClamp(domEl, maxLen, minVal, maxVal, onInputCb) {
  if (!domEl) return;
  domEl.setAttribute('maxlength', String(maxLen));
  domEl.addEventListener('input', (e) => {
    let v = e.target.value.replace(/[^\d]/g, '');
    if (v.length > maxLen) v = v.slice(0, maxLen);
    if (v !== '') {
      const num = parseInt(v, 10);
      if (num > maxVal) v = String(maxVal);
      else if (minVal > 0 && num < minVal && v.length === maxLen) v = String(minVal);
    }
    e.target.value = v;
    if (onInputCb) onInputCb();
  });
  domEl.addEventListener('blur', (e) => {
    if (e.target.value.trim() !== '') {
      const num = parseInt(e.target.value, 10);
      if (isNaN(num)) e.target.value = '';
      else e.target.value = String(Math.min(maxVal, Math.max(minVal, num)));
    }
    if (onInputCb) onInputCb();
  });
}

function setupDilationInput(domEl) {
  if (!domEl) return;
  domEl.setAttribute('maxlength', '4');
  domEl.addEventListener('input', (e) => {
    let v = e.target.value.replace(/[^\d\.]/g, '');
    if (v.length > 4) v = v.slice(0, 4);
    const digits = v.replace(/[^\d]/g, '');
    if (digits.length === 2 && !v.includes('.') && digits !== '10') {
      v = `${digits[0]}.${digits[1]}`;
    } else if (digits.length === 3 && !v.includes('.') && digits.startsWith('10')) {
      v = `10.${digits[2]}`;
    }
    if (v !== '' && !isNaN(parseFloat(v))) {
      if (parseFloat(v) > 10.5) v = '10.5';
    }
    e.target.value = v;
  });
  domEl.addEventListener('blur', (e) => {
    if (e.target.value.trim() !== '') e.target.value = formatDilation(e.target.value);
  });
}

function setupBpInput(domEl, onCb) {
  if (!domEl) return;
  domEl.setAttribute('maxlength', '7');
  domEl.addEventListener('input', (e) => {
    let v = e.target.value.replace(/[^\d\/]/g, '');
    if (v.length > 7) v = v.slice(0, 7);
    const digits = v.replace(/[^\d]/g, '');
    if (digits.length === 5 && !v.includes('/')) {
      let s = Math.min(250, parseInt(digits.substring(0, 3), 10) || 0);
      let d = Math.min(250, parseInt(digits.substring(3, 5), 10) || 0);
      v = `${s}/${d}`;
    } else if (digits.length === 6 && !v.includes('/')) {
      let s = Math.min(250, parseInt(digits.substring(0, 3), 10) || 0);
      let d = Math.min(250, parseInt(digits.substring(3, 6), 10) || 0);
      v = `${s}/${d}`;
    } else if (v.includes('/')) {
      const parts = v.split('/');
      let sStr = parts[0] ? parts[0].slice(0, 3) : '';
      let dStr = parts[1] ? parts[1].slice(0, 3) : '';
      if (sStr && parseInt(sStr, 10) > 250) sStr = '250';
      if (dStr && parseInt(dStr, 10) > 250) dStr = '250';
      v = parts.length > 1 ? `${sStr}/${dStr}` : sStr;
    }
    e.target.value = v;
    if (onCb) onCb();
  });
  domEl.addEventListener('blur', (e) => {
    if (e.target.value.trim()) e.target.value = formatBp(e.target.value);
    if (onCb) onCb();
  });
}

function setupTempInput(domEl, onCb) {
  if (!domEl) return;
  domEl.setAttribute('maxlength', '4');
  domEl.addEventListener('input', (e) => {
    let v = e.target.value.replace(/[^\d\.]/g, '');
    if (v.length > 4) v = v.slice(0, 4);
    const digits = v.replace(/[^\d]/g, '');
    if (digits.length === 3 && !v.includes('.')) {
      v = `${digits.substring(0, 2)}.${digits.substring(2, 3)}`;
    }
    if (v !== '' && !isNaN(parseFloat(v))) {
      if (parseFloat(v) > 45.0) v = '45.0';
    }
    e.target.value = v;
    if (onCb) onCb();
  });
  domEl.addEventListener('blur', (e) => {
    if (e.target.value.trim() !== '') e.target.value = formatTemp(e.target.value);
    if (onCb) onCb();
  });
}

function setupOxytocinInput(domEl) {
  if (!domEl) return;
  domEl.setAttribute('maxlength', '5');
  domEl.addEventListener('input', (e) => {
    let v = e.target.value;
    if (/^\d/.test(v)) {
      v = v.replace(/[^\d\.]/g, '');
      if (v.length > 5) v = v.slice(0, 5);
      const digits = v.replace(/[^\d]/g, '');
      if (digits.length === 3 && !v.includes('.')) {
        if (parseInt(digits.substring(0, 2), 10) <= 20) {
          v = `${digits.substring(0, 2)}.${digits.substring(2, 3)}`;
        } else {
          v = `${digits[0]}.${digits.substring(1, 3)}`;
        }
      }
      if (v !== '' && !isNaN(parseFloat(v))) {
        if (parseFloat(v) > 20.0) v = '20.0';
      }
    }
    e.target.value = v;
  });
  domEl.addEventListener('blur', (e) => {
    if (e.target.value.trim() !== '') e.target.value = formatOxytocin(e.target.value);
  });
}

function bindPatientInfoInputs() {
  const syncPatientField = (domEl, key) => {
    if (domEl) {
      domEl.addEventListener('input', () => { appData.patient[key] = domEl.value; });
    }
  };

  syncPatientField(el.patientNameInput, 'name');
  syncPatientField(el.patientAgeInput, 'age');
  syncPatientField(el.patientRecordInput, 'recordId');
  syncPatientField(el.patientBedInput, 'bed');
  syncPatientField(el.patientParaInput, 'para');
  syncPatientField(el.patientDiagInput, 'diag');

  setupTimeInput(el.patientAdmitTimeInput, () => { if (el.patientAdmitTimeInput) appData.patient.admitTime = el.patientAdmitTimeInput.value; });
  setupDateInput(el.patientAdmitDateInput, () => { if (el.patientAdmitDateInput) appData.patient.admitDate = el.patientAdmitDateInput.value; });
  setupDateInput(el.patientChartDateInput, () => { if (el.patientChartDateInput) appData.patient.chartDate = el.patientChartDateInput.value; });
  setupTimeInput(el.patientRuptureTimeInput, () => { if (el.patientRuptureTimeInput) appData.patient.ruptureTime = el.patientRuptureTimeInput.value; });

  if (el.chkIntactMembrane && el.chkRupturedMembrane) {
    el.chkIntactMembrane.addEventListener('change', () => {
      if (el.chkIntactMembrane.checked) {
        el.chkRupturedMembrane.checked = false;
        appData.patient.ruptured = false;
      }
    });
    el.chkRupturedMembrane.addEventListener('change', () => {
      if (el.chkRupturedMembrane.checked) {
        el.chkIntactMembrane.checked = false;
        appData.patient.ruptured = true;
      }
    });
  }
}

function loadPreset(key) {
  const p = PRESETS[key];
  if (!p) return;
  appData.patient = JSON.parse(JSON.stringify(p.patient));
  appData.observations = JSON.parse(JSON.stringify(p.observations));
  renderAll();
}

// ==============================================================
// 5. RENDER PIPELINE: DYNAMIC COLUMNS & SVG OVERLAY
// ==============================================================

function renderAll() {
  renderPatientInfo();
  renderOxytocinHeader();
  renderDynamicColumns();
  syncDynamicTextRowsHeight();
  syncVitalsRowHeight();
  renderSvgOverlay();
}

function syncDynamicTextRowsHeight() {
  const rowConfigs = [
    { cssVar: '--h-drugs', headerSelector: '.sec-drugs', cellSelector: '.col-cell.cell-drugs', baseHeight: 36 },
    { cssVar: '--h-clinical', headerSelector: '.sec-clinical', cellSelector: '.col-cell.cell-clinical', baseHeight: 46 },
    { cssVar: '--h-nhs', headerSelector: '.sec-nhs', cellSelector: '.col-cell.cell-nhs', baseHeight: 38 }
  ];

  rowConfigs.forEach(cfg => {
    const headerEl = document.querySelector(cfg.headerSelector);
    const cells = document.querySelectorAll(cfg.cellSelector);
    if (!headerEl || cells.length === 0) return;

    headerEl.style.height = 'auto';
    headerEl.style.minHeight = 'auto';
    cells.forEach(c => { c.style.height = 'auto'; c.style.minHeight = 'auto'; });

    let maxHeight = Math.max(cfg.baseHeight, headerEl.offsetHeight);
    cells.forEach(c => {
      const h = Math.max(c.scrollHeight, c.offsetHeight);
      if (h > maxHeight) maxHeight = h;
    });

    const finalHeight = maxHeight + 2;
    document.documentElement.style.setProperty(cfg.cssVar, `${finalHeight}px`);
    headerEl.style.height = `${finalHeight}px`;
    headerEl.style.minHeight = `${finalHeight}px`;
    cells.forEach(c => {
      c.style.height = `${finalHeight}px`;
      c.style.minHeight = `${finalHeight}px`;
    });
  });
}

function syncVitalsRowHeight() {
  const headerPulse = el.headerPulse || document.querySelector('.sec-pulse');
  const pulseCells = document.querySelectorAll('.col-cell.cell-pulse');
  const headerBp = el.headerBp || document.querySelector('.sec-bp');
  const bpCells = document.querySelectorAll('.col-cell.cell-bp');

  // Pulse
  const pulseVals = appData.observations.map(o => o.pulse).filter(v => v && !isNaN(v));
  let neededPulseH = 44;
  if (pulseVals.length > 0) {
    const range = Math.max(...pulseVals) - Math.min(...pulseVals);
    neededPulseH = Math.min(72, Math.max(44, 44 + Math.floor(range / 15) * 4));
  }
  if (headerPulse) {
    document.documentElement.style.setProperty('--h-pulse', `${neededPulseH}px`);
    headerPulse.style.height = `${neededPulseH}px`;
    pulseCells.forEach(c => { c.style.height = `${neededPulseH}px`; });
  }

  // BP
  const bpSysVals = appData.observations.map(o => o.bpSys).filter(v => v && !isNaN(v));
  const bpDiaVals = appData.observations.map(o => o.bpDia).filter(v => v && !isNaN(v));
  let neededBpH = 56;
  if (bpSysVals.length > 0 && bpDiaVals.length > 0) {
    const maxSpread = Math.max(...bpSysVals) - Math.min(...bpDiaVals);
    neededBpH = Math.min(90, Math.max(56, 56 + Math.floor(maxSpread / 20) * 5));
  }
  if (headerBp) {
    document.documentElement.style.setProperty('--h-bp', `${neededBpH}px`);
    headerBp.style.height = `${neededBpH}px`;
    bpCells.forEach(c => { c.style.height = `${neededBpH}px`; });
  }
}

function getObsDateTimeMs(obs) {
  if (!obs) return 0;
  let dateStr = obs.date || (appData.patient && appData.patient.chartDate) || getTodayDateStr();
  let timeStr = obs.time || '00:00';

  let year = 2026, month = 1, day = 1;
  if (dateStr.includes('/')) {
    const p = dateStr.split('/');
    if (p.length === 3) { day = parseInt(p[0], 10) || 1; month = parseInt(p[1], 10) || 1; year = parseInt(p[2], 10) || 2026; }
  } else if (dateStr.includes('-')) {
    const p = dateStr.split('-');
    if (p.length === 3) { year = parseInt(p[0], 10) || 2026; month = parseInt(p[1], 10) || 1; day = parseInt(p[2], 10) || 1; }
  }

  let h = 0, m = 0;
  const cleanTime = String(timeStr).trim().replace(/[^\d:]/g, '');
  const tParts = cleanTime.split(':');
  if (tParts.length >= 2) {
    h = parseInt(tParts[0], 10) || 0;
    m = parseInt(tParts[1], 10) || 0;
  } else if (cleanTime.length === 4) {
    h = parseInt(cleanTime.substring(0, 2), 10) || 0;
    m = parseInt(cleanTime.substring(2, 4), 10) || 0;
  }

  return new Date(year, month - 1, day, h, m, 0, 0).getTime();
}

function getGlobalOxytocinUnit() {
  if (appData.defaultOxytocinUnit) return appData.defaultOxytocinUnit;
  const obsWithOxy = appData.observations.find(o => o.oxytocinVal && String(o.oxytocinVal).trim() !== '' && o.oxytocinUnit);
  return (obsWithOxy && obsWithOxy.oxytocinUnit) || 'giọt/phút';
}

function setGlobalOxytocinUnit(newUnit) {
  appData.defaultOxytocinUnit = newUnit;
  appData.observations.forEach(o => { o.oxytocinUnit = newUnit; });
  renderOxytocinHeader();
}

function handleOxytocinUnitChange(e) {
  const newUnit = e.target.value;
  const currentUnit = getGlobalOxytocinUnit();
  if (newUnit === currentUnit) return;

  if (confirm("Thay đổi sẽ áp dụng cho toàn bộ quá trình theo dõi, bạn có muốn thay đổi?")) {
    setGlobalOxytocinUnit(newUnit);
    previousOxytocinUnit = newUnit;
    renderAll();
    if (el.oxytocinUnitNotice) el.oxytocinUnitNotice.style.display = 'none';
    showToast(`Đã đổi đơn vị Oxytocin sang ${newUnit}`, 'success');
  } else {
    e.target.value = currentUnit;
    previousOxytocinUnit = currentUnit;
  }
}

function renderOxytocinHeader() {
  if (el.oxytocinHeaderUnit) {
    el.oxytocinHeaderUnit.textContent = `(${getGlobalOxytocinUnit()})`;
  }
}

function renderPatientInfo() {
  const p = appData.patient || {};
  if (el.patientNameInput) el.patientNameInput.value = p.name || '';
  if (el.patientAgeInput) el.patientAgeInput.value = p.age || '';
  if (el.patientRecordInput) el.patientRecordInput.value = p.recordId || '';
  if (el.patientBedInput) el.patientBedInput.value = p.bed || '';
  if (el.patientParaInput) el.patientParaInput.value = p.para || '';
  if (el.patientDiagInput) el.patientDiagInput.value = p.diag || '';
  if (el.patientAdmitTimeInput) el.patientAdmitTimeInput.value = p.admitTime || '';
  if (el.patientAdmitDateInput) el.patientAdmitDateInput.value = p.admitDate || '';
  if (el.patientChartDateInput) el.patientChartDateInput.value = p.chartDate || '';
  if (el.patientRuptureTimeInput) el.patientRuptureTimeInput.value = p.ruptureTime || '';
  if (el.chkRupturedMembrane) el.chkRupturedMembrane.checked = !!p.ruptured;
  if (el.chkIntactMembrane) el.chkIntactMembrane.checked = !p.ruptured;
}

function renderDynamicColumns() {
  const container = el.container;
  if (!container) return;
  container.innerHTML = '';

  const obsList = appData.observations;
  obsList.sort((a, b) => getObsDateTimeMs(a) - getObsDateTimeMs(b));

  const startMs = obsList.length > 0 ? getObsDateTimeMs(obsList[0]) : 0;
  const renderedCols = [];

  obsList.forEach((obs, index) => {
    const curMs = getObsDateTimeMs(obs);
    obs.minutesFromStart = Math.max(0, Math.round((curMs - startMs) / 60000));

    let colWidth = CONFIG.defaultColWidth;
    if (index < obsList.length - 1) {
      const nextMs = getObsDateTimeMs(obsList[index + 1]);
      const diffMins = Math.round((nextMs - curMs) / 60000);
      colWidth = Math.max(CONFIG.minColWidth, diffMins * CONFIG.pxPerMinute);
    } else {
      colWidth = CONFIG.defaultColWidth * 2; // Cột cuối gấp đôi (120px)
    }

    obs.calculatedWidth = colWidth;
    renderedCols.push({ obs, index, width: colWidth });
  });

  const totalRenderedWidth = renderedCols.reduce((acc, c) => acc + c.width, 0);
  const minRequiredWidth = CONFIG.defaultCols * CONFIG.defaultColWidth;
  const frag = document.createDocumentFragment();

  renderedCols.forEach(({ obs, index, width }) => {
    frag.appendChild(createColumnElement(obs, index, width));
  });

  let currentPadMinutes = 0;
  if (obsList.length > 0) {
    const lastColWidth = renderedCols[renderedCols.length - 1].width;
    currentPadMinutes = obsList[obsList.length - 1].minutesFromStart + Math.round(lastColWidth / CONFIG.pxPerMinute);
  }
  let remainingWidth = minRequiredWidth - totalRenderedWidth;
  let padIndex = obsList.length;

  if (remainingWidth > 0) {
    while (remainingWidth > 0) {
      const padWidth = CONFIG.defaultColWidth;
      frag.appendChild(createEmptyColumnElement(padIndex, padWidth, currentPadMinutes, padIndex === obsList.length));
      remainingWidth -= padWidth;
      currentPadMinutes += 60;
      padIndex++;
    }
  } else {
    frag.appendChild(createEmptyColumnElement(padIndex, CONFIG.defaultColWidth, currentPadMinutes, true));
  }

  container.appendChild(frag);
}

function highlightHeaderMetrics(obs) {
  clearHeaderMetrics();
  if (!obs) return;

  // 1. Cổ tử cung (Cervix Dilation cm)
  if (obs.dilation !== null && obs.dilation !== undefined && obs.dilation !== '') {
    const cm = parseFloat(obs.dilation);
    if (!isNaN(cm)) {
      const floorCm = Math.floor(cm);
      const ceilCm = Math.ceil(cm);
      document.querySelectorAll('#secYTicksCervix .t-cervix').forEach(el => {
        const val = parseInt(el.getAttribute('data-cm') || el.textContent.trim(), 10);
        if (!isNaN(val) && (val === floorCm || val === ceilCm)) {
          el.classList.add('header-highlight-active');
        }
      });
    }
  }

  // 2. Độ lọt ngôi thai (Head Descent / Station)
  if (obs.descent !== null && obs.descent !== undefined && obs.descent !== '') {
    let raw = obs.descent;
    let stationNorm = null;
    let num = typeof raw === 'number' ? raw : parseInt(raw, 10);
    if (!isNaN(num)) {
      if (num <= -1) stationNorm = `${num}`;
      else if (num === 0) stationNorm = '0';
      else if (num >= 1 && num <= 3) stationNorm = `+${num}`;
      else if (num === 4) stationNorm = '-2';
      else if (num === 5) stationNorm = '-3';
    }
    if (stationNorm !== null) {
      document.querySelectorAll('#secYTicksCervix .t-descent').forEach(el => {
        const attr = el.getAttribute('data-station');
        const txt = el.textContent.replace(/[()]/g, '').trim();
        if (attr === stationNorm || txt === stationNorm || (stationNorm === '0' && (txt === '0' || attr === '0'))) {
          el.classList.add('header-highlight-active');
        }
      });
    }
  }

  // 3. Số cơn co trong 10 phút (Contraction count 1-6)
  if (obs.cntCount !== null && obs.cntCount !== undefined && obs.cntCount !== '') {
    const count = parseInt(obs.cntCount, 10);
    if (!isNaN(count) && count >= 1 && count <= 6) {
      document.querySelectorAll('#secYTicksCnt .cnt-tick').forEach(el => {
        const c = parseInt(el.getAttribute('data-cnt') || el.textContent.trim(), 10);
        if (c === count) {
          el.classList.add('header-highlight-active');
        }
      });
    }
  }

  // 4. Thời gian co (Contraction duration <20s, 20-40s, >40s)
  if (obs.cntDur) {
    const dur = String(obs.cntDur).trim().toLowerCase();
    document.querySelectorAll('#secContractionLegend .cnt-leg-row').forEach(el => {
      const d = el.getAttribute('data-dur');
      if (d === dur || (dur === '<20' && d === 'mild') || (dur === '20-40' && d === 'moderate') || (dur === '>40' && d === 'strong')) {
        el.classList.add('header-highlight-active');
      }
    });
  }
}

function clearHeaderMetrics() {
  document.querySelectorAll('.header-highlight-active').forEach(el => el.classList.remove('header-highlight-active'));
}

function createColumnElement(obs, index, width) {
  const col = document.createElement('div');
  col.className = 'time-col';
  col.style.width = `${width}px`;
  col.style.minWidth = `${width}px`;
  col.dataset.obsId = obs.id;
  col.dataset.index = index;

  col.addEventListener('mouseenter', () => {
    document.querySelectorAll(`.svg-col-${index}`).forEach(elem => elem.classList.add('svg-hover-active'));
    highlightHeaderMetrics(obs);
  });
  col.addEventListener('mouseleave', () => {
    document.querySelectorAll(`.svg-col-${index}`).forEach(elem => elem.classList.remove('svg-hover-active'));
    clearHeaderMetrics();
  });
  col.addEventListener('click', () => openModalForEdit(index));

  // Row 1: FHR
  col.appendChild(createCell('col-cell cell-fhr'));

  // Row 2: Liquor
  const cellLiquor = createCell('col-cell cell-liquor', obs.liquor || '');
  const liquorLabels = {
    'C': 'C - Còn', 'TĐ': 'TĐ - Trắng đục', 'TT': 'TT - Trắng trong',
    'X': 'X - Xanh', 'V': 'V - Vàng', 'Đ': 'Đ - Đỏ', 'K': 'K - Không rõ', '↓': '↓ - Ối vỡ / Bấm ối'
  };
  cellLiquor.title = liquorLabels[obs.liquor] || obs.liquor || '';
  if (['X', 'V', 'Đ', 'ĐỎ', 'ĐEN', 'S'].includes(obs.liquor)) cellLiquor.classList.add('text-danger-alert');
  col.appendChild(cellLiquor);

  // Row 3: Molding
  const cellMolding = createCell('col-cell cell-molding', obs.molding !== null && obs.molding !== undefined ? obs.molding : '');
  if (obs.molding === '++' || obs.molding === '+++') cellMolding.classList.add('text-danger-alert');
  col.appendChild(cellMolding);

  // Row 4: Cervix subgrid
  const cellCervix = createCell('col-cell cell-cervix');
  for (let i = 0; i < 12; i++) {
    const sub = document.createElement('div');
    sub.className = 'cervix-subrow';
    cellCervix.appendChild(sub);
  }
  col.appendChild(cellCervix);

  // Row 5: Time
  col.appendChild(createCell('col-cell cell-time', obs.time || ''));

  // Row 7: Contractions
  const cellCnt = createCell('col-cell cell-cnt');
  for (let i = 0; i < 6; i++) {
    const sub = document.createElement('div');
    sub.className = 'cnt-subrow';
    cellCnt.appendChild(sub);
  }
  if (obs.cntCount && obs.cntCount > 0) {
    const stack = document.createElement('div');
    stack.className = 'cnt-bar-stack';
    const fillClass = obs.cntDur === 'mild' ? 'box-mild' : obs.cntDur === 'strong' ? 'box-strong' : 'box-mod';
    for (let i = 0; i < obs.cntCount; i++) {
      const b = document.createElement('div');
      b.className = `cnt-bar-box ${fillClass}`;
      stack.appendChild(b);
    }
    cellCnt.appendChild(stack);
  }
  col.appendChild(cellCnt);

  // Row 8: Oxytocin
  const cellOxy = createCell('col-cell cell-oxy');
  if (obs.oxytocinVal && String(obs.oxytocinVal).trim() !== '') {
    const span = document.createElement('span');
    span.className = 'cell-oxy-val';
    span.textContent = obs.oxytocinVal;
    cellOxy.appendChild(span);
  }
  col.appendChild(cellOxy);

  // Row 9: Drugs
  const cellDrugs = createCell('col-cell cell-drugs', obs.drugs || '');
  cellDrugs.title = obs.drugs || '';
  col.appendChild(cellDrugs);

  // Row 10 & 11: Pulse & BP
  col.appendChild(createCell('col-cell cell-pulse'));
  col.appendChild(createCell('col-cell cell-bp'));

  // Row 12: Temp
  const cellTemp = createCell('col-cell cell-temp');
  if (obs.temp !== null && obs.temp !== undefined && obs.temp !== '') {
    cellTemp.textContent = `${obs.temp}°C`;
    if (obs.temp >= 38.0 || obs.temp < 36.0) cellTemp.classList.add('text-danger-alert');
  }
  col.appendChild(cellTemp);

  // Row 13: Urine
  const cellUrine = createCell('col-cell cell-urine');
  const uProt = createCell('cell-urine-sub', obs.urineProtein || '');
  if (obs.urineProtein && obs.urineProtein !== '-') uProt.classList.add('text-danger-alert');
  const uAcet = createCell('cell-urine-sub', obs.urineAcetone || '');
  if (obs.urineAcetone && obs.urineAcetone !== '-') uAcet.classList.add('text-danger-alert');
  const uVol = createCell('cell-urine-sub', (obs.urineVolume !== null && obs.urineVolume !== undefined && obs.urineVolume !== '') ? `${obs.urineVolume}` : '');
  cellUrine.appendChild(uProt);
  cellUrine.appendChild(uAcet);
  cellUrine.appendChild(uVol);
  col.appendChild(cellUrine);

  // Row 14 & 15: Clinical & NHS
  col.appendChild(createCell('col-cell cell-clinical', obs.notes || obs.clinicalNote || ''));
  col.appendChild(createCell('col-cell cell-nhs', obs.examiner || CONFIG.currentUser));

  return col;
}

function createCell(className, text = '') {
  const c = document.createElement('div');
  c.className = className;
  if (text) c.textContent = text;
  return c;
}

function createEmptyColumnElement(index, width, minutesFromStart, isNextEmpty = false) {
  const col = document.createElement('div');
  col.className = isNextEmpty ? 'time-col time-col-next' : 'time-col time-col-disabled';
  col.style.width = `${width}px`;
  col.style.minWidth = `${width}px`;
  col.title = "Bấm vào để nhập dữ liệu mốc tiếp theo";
  col.style.cursor = "pointer";
  col.addEventListener('click', () => openModalForAdd());

  const rows = [
    { cls: 'cell-fhr' }, { cls: 'cell-liquor' }, { cls: 'cell-molding' },
    { cls: 'cell-cervix', h: CONFIG.cervixTickHeight, count: 12 },
    { cls: 'cell-time' }, { cls: 'cell-cnt', h: CONFIG.cntTickHeight, count: 6 },
    { cls: 'cell-oxy' }, { cls: 'cell-drugs' }, { cls: 'cell-pulse' },
    { cls: 'cell-bp' }, { cls: 'cell-temp' }, { cls: 'cell-urine', sub: 3 },
    { cls: 'cell-clinical' }, { cls: 'cell-nhs' }
  ];

  rows.forEach(r => {
    const c = createCell(`col-cell ${r.cls}`);
    if (r.cls === 'cell-cervix') {
      for (let i = 0; i < 12; i++) {
        const sub = document.createElement('div');
        sub.className = 'cervix-subrow';
        c.appendChild(sub);
      }
    } else if (r.cls === 'cell-cnt') {
      for (let i = 0; i < 6; i++) {
        const sub = document.createElement('div');
        sub.className = 'cnt-subrow';
        c.appendChild(sub);
      }
    } else if (r.count) {
      for (let i = 0; i < r.count; i++) {
        const line = document.createElement('div');
        line.style.cssText = `position:absolute;left:0;right:0;top:${i * r.h}px;border-bottom:1px solid #cbd5e1;`;
        c.appendChild(line);
      }
    }
    if (r.sub) {
      for (let s = 0; s < r.sub; s++) c.appendChild(createCell('cell-urine-sub'));
    }
    col.appendChild(c);
  });

  return col;
}

// ==============================================================
// 6. SVG OVERLAY RENDERING
// ==============================================================

function renderSvgOverlay() {
  const svg = el.svgOverlay;
  const container = el.container;
  if (!svg || !container) return;

  svg.innerHTML = '';
  const totalWidth = container.offsetWidth || container.scrollWidth;
  const totalHeight = container.offsetHeight || container.scrollHeight;

  svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
  svg.setAttribute('width', `${totalWidth}`);
  svg.setAttribute('height', `${totalHeight}`);
  svg.style.width = `${totalWidth}px`;
  svg.style.height = `${totalHeight}px`;

  const cols = container.querySelectorAll('.time-col');
  if (cols.length === 0) return;

  const fhrEl = el.secFhr || document.querySelector('.sec-fhr');
  const cervixEl = el.secCervix || document.querySelector('.sec-cervix-descent');
  const pulseEl = el.headerPulse || document.querySelector('.sec-pulse');
  const bpEl = el.headerBp || document.querySelector('.sec-bp');

  const topFHR = fhrEl ? fhrEl.offsetTop : 0;
  const heightFHR = fhrEl ? fhrEl.offsetHeight : 70;
  const topCervix = cervixEl ? cervixEl.offsetTop : 122;
  const topPulse = pulseEl ? pulseEl.offsetTop : (topCervix + 240 + 26 + 120 + 34 + 40);
  const heightPulse = pulseEl ? pulseEl.offsetHeight : 80;
  const topBP = bpEl ? bpEl.offsetTop : (topPulse + heightPulse);
  const heightBP = bpEl ? bpEl.offsetHeight : 100;

  const colCoords = [];
  cols.forEach((col, idx) => {
    const w = col.offsetWidth || parseFloat(col.style.width) || 60;
    colCoords.push({ index: idx, x: col.offsetLeft, centerX: col.offsetLeft + w / 2, width: w });
  });

  const getCervixY = (cm) => topCervix + (10 - Math.max(0, Math.min(10, cm)) + 1) * 20;
  const getDescentY = (val) => {
    let level = 5;
    if (typeof val === 'string') val = parseInt(val, 10);
    if (typeof val === 'number' && !isNaN(val)) {
      if (val <= -1) {
        level = Math.min(5, Math.max(-1, 2 - val));
      } else if (val === 0) {
        level = 2;
      } else if (val >= 1 && val <= 3) {
        level = 2 - val;
      } else if (val === 4 || val === 5) {
        level = val;
      }
    }
    return topCervix + (10 - level + 1) * 20;
  };
  const getFHRY = (fhr) => topFHR + (heightFHR - 12) - ((Math.max(100, Math.min(180, fhr)) - 100) / 80) * (heightFHR - 30);
  const getPulseY = (pulse) => topPulse + heightPulse - 12 - ((Math.max(50, Math.min(140, pulse)) - 50) / 90) * (heightPulse - 24);
  const getBpY = (val) => topBP + heightBP - 12 - ((Math.max(50, Math.min(180, val)) - 50) / 130) * (heightBP - 24);

  // 1. Alert & Action Lines
  const activeObs = appData.observations.find(o => o.dilation !== null && o.dilation >= 4);
  const startIdx = activeObs ? appData.observations.indexOf(activeObs) : 0;
  const alertStartX = colCoords[startIdx] ? colCoords[startIdx].x : 0;
  const alertStartY = getCervixY(4);
  const alertEndX = alertStartX + 360 * CONFIG.pxPerMinute;
  const alertEndY = getCervixY(10);
  const actionStartX = alertStartX + 240 * CONFIG.pxPerMinute;
  const actionEndX = actionStartX + 360 * CONFIG.pxPerMinute;

  const svgCross = (px, py, x1, y1, x2, y2) => (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);

  const cervixPts = [];
  appData.observations.forEach((obs, i) => {
    if (obs.dilation !== null && obs.dilation !== undefined && colCoords[i]) {
      cervixPts.push({ cx: colCoords[i].x, cy: getCervixY(obs.dilation), obs, idx: i });
    }
  });

  const alertTriggered = cervixPts.some(p => svgCross(p.cx, p.cy, alertStartX, alertStartY, alertEndX, alertEndY) < 0);
  const actionTriggered = cervixPts.some(p => svgCross(p.cx, p.cy, actionStartX, alertStartY, actionEndX, alertEndY) >= 0);

  const alertColor = alertTriggered ? '#dc2626' : '#000000';
  const actionColor = actionTriggered ? '#dc2626' : '#000000';

  // Draw Alert Line & Label
  svg.appendChild(createSvgElement('line', { x1: alertStartX, y1: alertStartY, x2: alertEndX, y2: alertEndY, stroke: alertColor, 'stroke-width': '2.7', 'stroke-linecap': 'round' }));
  const textAlert = createSvgElement('text', { x: alertStartX + 120, y: alertStartY - 48, fill: alertColor, 'font-size': '10px', 'font-weight': 'bold', transform: `rotate(-18.5 ${alertStartX + 120} ${alertStartY - 48})` });
  textAlert.textContent = "Đường báo động";
  svg.appendChild(textAlert);

  // Draw Action Line & Label
  svg.appendChild(createSvgElement('line', { x1: actionStartX, y1: alertStartY, x2: actionEndX, y2: alertEndY, stroke: actionColor, 'stroke-width': '2.7', 'stroke-linecap': 'round' }));
  const textAction = createSvgElement('text', { x: actionStartX + 120, y: alertStartY - 48, fill: actionColor, 'font-size': '10px', 'font-weight': 'bold', transform: `rotate(-18.5 ${actionStartX + 120} ${alertStartY - 48})` });
  textAction.textContent = "Đường hành động";
  svg.appendChild(textAction);

  // 2. Cervical Dilation Path & 'X' Markers
  if (cervixPts.length > 1) {
    svg.appendChild(createSvgElement('path', { d: cervixPts.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`).join(' '), fill: 'none', stroke: 'var(--color-cervix)', 'stroke-width': '1.2' }));
  }
  cervixPts.forEach(p => {
    const colIdx = p.obs.index !== undefined ? p.obs.index : p.idx;
    const gX = createSvgElement('g', { class: `svg-marker svg-col-${colIdx}` });
    const s = 4.2;
    gX.appendChild(createSvgElement('line', { x1: p.cx - s, y1: p.cy - s, x2: p.cx + s, y2: p.cy + s, stroke: 'var(--color-cervix)', 'stroke-width': '1.2', 'stroke-linecap': 'round' }));
    gX.appendChild(createSvgElement('line', { x1: p.cx - s, y1: p.cy + s, x2: p.cx + s, y2: p.cy - s, stroke: 'var(--color-cervix)', 'stroke-width': '1.2', 'stroke-linecap': 'round' }));
    svg.appendChild(gX);
  });

  // 3. Head Descent (O)
  const descentPoints = [];
  appData.observations.forEach((obs, i) => {
    if (obs.descent !== null && obs.descent !== undefined && colCoords[i]) {
      descentPoints.push({ cx: colCoords[i].x, cy: getDescentY(obs.descent), idx: i });
    }
  });
  if (descentPoints.length > 1) {
    svg.appendChild(createSvgElement('path', { d: descentPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`).join(' '), fill: 'none', stroke: 'var(--color-descent)', 'stroke-width': '1.1', 'stroke-dasharray': '4 3' }));
  }
  descentPoints.forEach(p => {
    svg.appendChild(createSvgElement('circle', { class: `svg-marker svg-col-${p.idx}`, cx: p.cx, cy: p.cy, r: 4.2, fill: '#ffffff', stroke: 'var(--color-descent)', 'stroke-width': '1.2' }));
  });

  // 4. Fetal Heart Rate (●)
  const fhrPoints = [];
  appData.observations.forEach((obs, i) => {
    if (obs.fhr && colCoords[i]) {
      fhrPoints.push({ cx: colCoords[i].centerX, cy: getFHRY(obs.fhr), obs, idx: i });
    }
  });
  if (fhrPoints.length > 1) {
    svg.appendChild(createSvgElement('path', { d: fhrPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`).join(' '), fill: 'none', stroke: '#000000', 'stroke-width': '1.2' }));
  }
  fhrPoints.forEach(p => {
    const isAbn = p.obs.fhr < 110 || p.obs.fhr > 160;
    const colIdx = p.obs.index !== undefined ? p.obs.index : p.idx;
    svg.appendChild(createSvgElement('circle', { cx: p.cx, cy: p.cy, r: 2.6, fill: isAbn ? 'var(--danger)' : '#000000', stroke: '#ffffff', 'stroke-width': '0.8' }));
    const txt = createSvgElement('text', { class: `svg-val-text svg-col-${colIdx}`, x: p.cx, y: p.cy - 6, fill: isAbn ? 'var(--danger)' : '#000000', 'font-size': '11px', 'font-weight': '400', 'font-family': 'var(--font-sans)', 'text-anchor': 'middle' });
    txt.textContent = p.obs.fhr;
    svg.appendChild(txt);
  });

  // 5. Pulse (●)
  const pulsePoints = [];
  appData.observations.forEach((obs, i) => {
    if (obs.pulse && colCoords[i]) {
      pulsePoints.push({ cx: colCoords[i].centerX, cy: getPulseY(obs.pulse), obs, idx: i });
    }
  });
  if (pulsePoints.length > 1) {
    svg.appendChild(createSvgElement('path', { d: pulsePoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.cx} ${p.cy}`).join(' '), fill: 'none', stroke: '#000000', 'stroke-width': '1.2' }));
  }
  pulsePoints.forEach(p => {
    const isAbn = p.obs.pulse >= 100 || p.obs.pulse < 60;
    const colIdx = p.obs.index !== undefined ? p.obs.index : p.idx;
    svg.appendChild(createSvgElement('circle', { cx: p.cx, cy: p.cy, r: 2.6, fill: isAbn ? 'var(--danger)' : '#000000', stroke: '#ffffff', 'stroke-width': '0.8' }));
    const txt = createSvgElement('text', { class: `svg-val-text svg-col-${colIdx}`, x: p.cx, y: p.cy - 6, fill: isAbn ? 'var(--danger)' : '#000000', 'font-size': '11px', 'font-weight': '400', 'font-family': 'var(--font-sans)', 'text-anchor': 'middle' });
    txt.textContent = p.obs.pulse;
    svg.appendChild(txt);
  });

  // 6. Blood Pressure (▲▼)
  appData.observations.forEach((obs, i) => {
    if (obs.bpSys && obs.bpDia && colCoords[i]) {
      const cx = colCoords[i].centerX;
      const ySys = getBpY(obs.bpSys);
      const yDia = getBpY(obs.bpDia);
      const gBp = createSvgElement('g', { class: `svg-bp-group svg-col-${i}` });

      gBp.appendChild(createSvgElement('line', { x1: cx, y1: ySys, x2: cx, y2: yDia, stroke: '#000000', 'stroke-width': '1.2' }));
      gBp.appendChild(createSvgElement('polygon', { points: `${cx},${ySys - 4.5} ${cx - 3},${ySys + 1} ${cx + 3},${ySys + 1}`, fill: '#000000' }));
      gBp.appendChild(createSvgElement('polygon', { points: `${cx},${yDia + 4.5} ${cx - 3},${yDia - 1} ${cx + 3},${yDia - 1}`, fill: '#000000' }));

      const sysTxt = createSvgElement('text', { class: `svg-val-text svg-col-${i}`, x: cx, y: ySys - 6, fill: obs.bpSys >= 140 ? 'var(--danger)' : '#000000', 'font-size': '11px', 'font-weight': '400', 'font-family': 'var(--font-sans)', 'text-anchor': 'middle' });
      sysTxt.textContent = obs.bpSys;
      gBp.appendChild(sysTxt);

      const diaTxt = createSvgElement('text', { class: `svg-val-text svg-col-${i}`, x: cx, y: yDia + 13, fill: (obs.bpDia < 60 || obs.bpDia >= 90) ? 'var(--danger)' : '#000000', 'font-size': '11px', 'font-weight': '400', 'font-family': 'var(--font-sans)', 'text-anchor': 'middle' });
      diaTxt.textContent = obs.bpDia;
      gBp.appendChild(diaTxt);

      svg.appendChild(gBp);
    }
  });
}

function createSvgElement(tag, attrs = {}) {
  const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) {
    elem.setAttribute(k, v);
  }
  return elem;
}

// ==============================================================
// 7. FORM LOGIC & MODAL MANAGEMENT
// ==============================================================

function openModalForAdd(suggestedTime = null, suggestedHour = null) {
  if (el.form) el.form.reset();
  if (el.editObsId) el.editObsId.value = '';
  if (el.modalObsTitle) el.modalObsTitle.textContent = 'Thêm mốc theo dõi chuyển dạ mới';

  if (el.inputObsDate) el.inputObsDate.value = getTodayDateStr();
  if (el.inputObsTime) el.inputObsTime.value = suggestedTime ? format24hTime(suggestedTime) : getCurrentTimeStr();
  if (el.inputNHSName) el.inputNHSName.value = CONFIG.currentUser;

  const lastObsWithOxy = [...appData.observations].reverse().find(o => o.oxytocinVal && String(o.oxytocinVal).trim() !== '');
  const globalUnit = getGlobalOxytocinUnit();
  if (lastObsWithOxy) {
    if (el.inputOxytocinVal) el.inputOxytocinVal.value = lastObsWithOxy.oxytocinVal;
    if (el.inputOxytocinUnit) {
      el.inputOxytocinUnit.disabled = false;
      el.inputOxytocinUnit.value = lastObsWithOxy.oxytocinUnit || globalUnit;
      previousOxytocinUnit = el.inputOxytocinUnit.value;
    }
  } else {
    if (el.inputOxytocinVal) el.inputOxytocinVal.value = '';
    if (el.inputOxytocinUnit) {
      el.inputOxytocinUnit.disabled = false;
      el.inputOxytocinUnit.value = globalUnit;
      previousOxytocinUnit = globalUnit;
    }
  }

  if (el.inputLaborHour) {
    el.inputLaborHour.value = suggestedHour !== null && suggestedHour !== undefined
      ? suggestedHour
      : (appData.observations.length > 0 ? appData.observations[appData.observations.length - 1].laborHour + 1.0 : 0);
  }

  const blankFields = [
    el.inputClinicalNote, el.inputFHR, el.inputContractionCount, el.inputContractionDur,
    el.inputDilation, el.inputDescent, el.inputMolding, el.inputLiquor, el.inputLiquorCustom,
    el.inputPosition, el.inputDrugs, el.inputPulse, el.inputBpCombined, el.inputBpSys,
    el.inputBpDia, el.inputTemp, el.inputUrineProtein, el.inputUrineAcetone, el.inputUrineVolume
  ];
  blankFields.forEach(f => { if (f) f.value = ''; });

  if (el.inputCaput) el.inputCaput.value = '0';
  if (el.inputAsynclitism) el.inputAsynclitism.value = '0';
  if (el.oxytocinUnitNotice) el.oxytocinUnitNotice.style.display = 'none';

  calculateTimeDeltaDisplay();
  checkLiveWarnings();

  if (el.btnDeleteObs) el.btnDeleteObs.style.display = 'none';
  if (el.modal) {
    el.modal.style.display = 'flex';
    el.modal.classList.remove('active-editing');
  }
  if (el.sidebar) el.sidebar.classList.remove('sidebar-collapsed');
}

function openModalForEdit(index) {
  const obs = appData.observations[index];
  if (!obs) return;

  if (el.form) el.form.reset();
  if (el.editObsId) el.editObsId.value = obs.id || `obs-${index}`;
  if (el.modalObsTitle) el.modalObsTitle.textContent = `Chỉnh sửa mốc theo dõi lúc ${obs.time}`;

  if (el.inputObsDate) el.inputObsDate.value = obs.date ? formatDdmmyyyy(obs.date) : getTodayDateStr();
  if (el.inputObsTime) el.inputObsTime.value = format24hTime(obs.time) || '';
  if (el.inputLaborHour) el.inputLaborHour.value = obs.laborHour !== undefined ? obs.laborHour : index;
  if (el.inputNHSName) el.inputNHSName.value = obs.examiner || CONFIG.currentUser;
  if (el.inputClinicalNote) el.inputClinicalNote.value = obs.notes || obs.clinicalNote || '';

  if (el.inputDilation) el.inputDilation.value = (obs.dilation !== null && obs.dilation !== undefined) ? formatDilation(obs.dilation) : '';
  if (el.inputDescent) el.inputDescent.value = (obs.descent !== null && obs.descent !== undefined) ? String(obs.descent) : '';
  if (el.inputLiquor) el.inputLiquor.value = obs.liquor || '';
  if (el.inputLiquorCustom) el.inputLiquorCustom.value = '';

  if (el.inputMolding) el.inputMolding.value = (obs.molding !== undefined && obs.molding !== null) ? obs.molding : '';
  if (el.inputPosition) el.inputPosition.value = obs.position || '';
  if (el.inputCaput) el.inputCaput.value = obs.caput || '0';
  if (el.inputAsynclitism) el.inputAsynclitism.value = obs.asynclitism || '0';

  if (el.inputFHR) el.inputFHR.value = obs.fhr !== null && obs.fhr !== undefined ? obs.fhr : '';
  if (el.inputContractionCount) el.inputContractionCount.value = obs.cntCount !== null && obs.cntCount !== undefined ? obs.cntCount : '';
  if (el.inputContractionDur) el.inputContractionDur.value = obs.cntDur || '';
  if (el.inputOxytocinVal) el.inputOxytocinVal.value = obs.oxytocinVal !== undefined ? formatOxytocin(obs.oxytocinVal) : '';

  const globalUnit = getGlobalOxytocinUnit();
  if (el.inputOxytocinUnit) {
    el.inputOxytocinUnit.disabled = false;
    el.inputOxytocinUnit.value = globalUnit;
    previousOxytocinUnit = globalUnit;
  }
  if (el.oxytocinUnitNotice) el.oxytocinUnitNotice.style.display = 'none';

  if (el.inputDrugs) el.inputDrugs.value = obs.drugs || '';
  if (el.inputPulse) el.inputPulse.value = obs.pulse !== null && obs.pulse !== undefined ? obs.pulse : '';
  if (el.inputBpCombined) el.inputBpCombined.value = (obs.bpSys && obs.bpDia) ? `${obs.bpSys}/${obs.bpDia}` : (obs.bpSys ? `${obs.bpSys}/` : '');
  if (el.inputBpSys) el.inputBpSys.value = obs.bpSys || '';
  if (el.inputBpDia) el.inputBpDia.value = obs.bpDia || '';
  if (el.inputTemp) el.inputTemp.value = (obs.temp !== null && obs.temp !== undefined) ? formatTemp(obs.temp) : '';

  if (el.inputUrineProtein) el.inputUrineProtein.value = (obs.urineProtein !== null && obs.urineProtein !== undefined) ? obs.urineProtein : '';
  if (el.inputUrineAcetone) el.inputUrineAcetone.value = (obs.urineAcetone !== null && obs.urineAcetone !== undefined) ? obs.urineAcetone : '';
  if (el.inputUrineVolume) el.inputUrineVolume.value = (obs.urineVolume !== null && obs.urineVolume !== undefined) ? obs.urineVolume : '';

  calculateTimeDeltaDisplay();
  checkLiveWarnings();

  if (el.btnDeleteObs) el.btnDeleteObs.style.display = 'inline-flex';
  if (el.modal) {
    el.modal.style.display = 'flex';
    el.modal.classList.add('active-editing');
    el.modal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  if (el.sidebar) el.sidebar.classList.remove('sidebar-collapsed');
}

function closeModal() {
  if (el.modal) {
    el.modal.style.display = 'none';
    el.modal.classList.remove('active-editing');
  }
}

function deleteCurrentObs() {
  if (!el.editObsId || !el.editObsId.value) return;
  const editId = el.editObsId.value;
  const idx = appData.observations.findIndex(o => (o.id || '') === editId || `obs-${appData.observations.indexOf(o)}` === editId);
  if (idx === -1) return;

  const obs = appData.observations[idx];
  const timeLabel = obs.time || `mốc ${idx + 1}`;
  if (!confirm(`Xóa toàn bộ dữ liệu mốc lúc ${timeLabel}?\n\nHành động này không thể hoàn tác.`)) return;

  appData.observations.splice(idx, 1);
  closeModal();
  renderAll();
  showToast(`Đã xóa mốc lúc ${timeLabel}`, 'info');
}

function handleFormSubmit(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();

  const editId = el.editObsId.value;
  const rawTime = el.inputObsTime.value;
  const time = format24hTime(rawTime);
  if (!time || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    alert('Vui lòng nhập giờ khám đúng định dạng 24 giờ (VD: 08:30 hoặc 23:59)!');
    if (el.inputObsTime) el.inputObsTime.focus();
    return;
  }

  const rawDate = el.inputObsDate && el.inputObsDate.value ? el.inputObsDate.value : getTodayDateStr();
  const dateFormatted = formatDdmmyyyy(rawDate);

  let bpSys = null, bpDia = null;
  if (el.inputBpCombined && el.inputBpCombined.value.trim()) {
    const formattedBpStr = formatBp(el.inputBpCombined.value);
    el.inputBpCombined.value = formattedBpStr;
    const parts = formattedBpStr.split('/');
    if (parts.length >= 1 && parts[0]) bpSys = parseInt(parts[0], 10) || null;
    if (parts.length >= 2 && parts[1]) bpDia = parseInt(parts[1], 10) || null;
  } else {
    bpSys = el.inputBpSys && el.inputBpSys.value ? parseInt(el.inputBpSys.value, 10) : null;
    bpDia = el.inputBpDia && el.inputBpDia.value ? parseInt(el.inputBpDia.value, 10) : null;
  }

  const selectedUnit = el.inputOxytocinUnit ? (el.inputOxytocinUnit.value || getGlobalOxytocinUnit()) : getGlobalOxytocinUnit();
  let oxyVal = '';
  if (el.inputOxytocinVal && el.inputOxytocinVal.value.trim() !== '') {
    oxyVal = formatOxytocin(el.inputOxytocinVal.value);
    el.inputOxytocinVal.value = oxyVal;
  }

  let dilationVal = null;
  if (el.inputDilation && el.inputDilation.value.trim() !== '') {
    const dStr = formatDilation(el.inputDilation.value);
    el.inputDilation.value = dStr;
    dilationVal = parseFloat(dStr) || null;
  }

  let tempVal = null;
  if (el.inputTemp && el.inputTemp.value.trim() !== '') {
    const tStr = formatTemp(el.inputTemp.value);
    el.inputTemp.value = tStr;
    tempVal = parseFloat(tStr) || null;
  }

  let fhrVal = null;
  if (el.inputFHR && el.inputFHR.value.trim() !== '') {
    const fNum = parseInt(el.inputFHR.value, 10);
    if (!isNaN(fNum)) fhrVal = Math.min(250, Math.max(0, fNum));
  }

  let cntCountVal = null;
  if (el.inputContractionCount && el.inputContractionCount.value.trim() !== '') {
    const cNum = parseInt(el.inputContractionCount.value, 10);
    if (!isNaN(cNum)) cntCountVal = Math.min(6, Math.max(1, cNum));
  }

  let pulseVal = null;
  if (el.inputPulse && el.inputPulse.value.trim() !== '') {
    const pNum = parseInt(el.inputPulse.value, 10);
    if (!isNaN(pNum)) pulseVal = Math.min(250, Math.max(0, pNum));
  }

  let urineVolVal = null;
  if (el.inputUrineVolume && el.inputUrineVolume.value.trim() !== '') {
    const uNum = parseInt(el.inputUrineVolume.value, 10);
    if (!isNaN(uNum)) urineVolVal = Math.min(2000, Math.max(0, uNum));
  }

  const liquorVal = el.inputLiquor ? (el.inputLiquor.value || (el.inputLiquorCustom ? el.inputLiquorCustom.value : '')) : '';
  const newObs = {
    id: editId || `obs-${Date.now()}`,
    date: dateFormatted,
    time: time,
    laborHour: el.inputLaborHour ? (parseFloat(el.inputLaborHour.value) || 0) : 0,
    dilation: dilationVal,
    descent: el.inputDescent && el.inputDescent.value !== '' ? parseInt(el.inputDescent.value, 10) : null,
    liquor: liquorVal,
    molding: el.inputMolding ? el.inputMolding.value : '',
    position: el.inputPosition ? el.inputPosition.value : '',
    caput: el.inputCaput ? el.inputCaput.value : '0',
    asynclitism: el.inputAsynclitism ? el.inputAsynclitism.value : '0',
    fhr: fhrVal,
    cntCount: cntCountVal,
    cntDur: el.inputContractionDur ? el.inputContractionDur.value : '',
    oxytocinVal: oxyVal,
    oxytocinUnit: selectedUnit,
    drugs: el.inputDrugs ? el.inputDrugs.value.trim() : '',
    pulse: pulseVal,
    bpSys: bpSys,
    bpDia: bpDia,
    temp: tempVal,
    urineProtein: el.inputUrineProtein ? el.inputUrineProtein.value : '',
    urineAcetone: el.inputUrineAcetone ? el.inputUrineAcetone.value : '',
    urineVolume: urineVolVal,
    notes: el.inputClinicalNote ? el.inputClinicalNote.value.trim() : '',
    clinicalNote: el.inputClinicalNote ? el.inputClinicalNote.value.trim() : '',
    examiner: (el.inputNHSName && el.inputNHSName.value) ? el.inputNHSName.value.trim() : CONFIG.currentUser
  };

  if (oxyVal) setGlobalOxytocinUnit(selectedUnit);

  if (!editId) {
    const newObsMs = getObsDateTimeMs(newObs);
    let closestDiffMins = Infinity;
    let closestObs = null;

    appData.observations.forEach(o => {
      const diffMins = Math.round(Math.abs(newObsMs - getObsDateTimeMs(o)) / 60000);
      if (diffMins < closestDiffMins) {
        closestDiffMins = diffMins;
        closestObs = o;
      }
    });

    if (closestObs && closestDiffMins < 30) {
      const confirmMsg = `⚠️ CẢNH BÁO THEO DÕI CHUYỂN DẠ:\n\nMốc khám lúc ${time} chỉ cách mốc gần nhất (${closestObs.time}) ${closestDiffMins} phút (< 30 phút).\n\nBạn có chắc chắn muốn tiếp tục lưu mốc này không?`;
      if (!confirm(confirmMsg)) return;
    }
  }

  if (editId) {
    const idx = appData.observations.findIndex(o => o.id === editId);
    if (idx >= 0) {
      appData.observations[idx] = newObs;
      showToast(`Đã cập nhật mốc ${time}`, 'success');
    }
  } else {
    appData.observations.push(newObs);
    if (el.editObsId) el.editObsId.value = newObs.id;
    if (el.btnDeleteObs) el.btnDeleteObs.style.display = 'inline-flex';
    if (el.modalObsTitle) el.modalObsTitle.textContent = `Chỉnh sửa mốc ${time}`;
    showToast(`Đã lưu mốc ${time}`, 'success');
  }

  appData.observations.sort((a, b) => getObsDateTimeMs(a) - getObsDateTimeMs(b));
  renderAll();
}

function calculateTimeDeltaDisplay() {
  if (!el.dispTimeDelta || !el.inputObsTime) return;
  const inputTime = el.inputObsTime.value;
  if (!inputTime) return;
  const inputDate = el.inputObsDate ? el.inputObsDate.value : getTodayDateStr();

  const currentMs = getObsDateTimeMs({ date: inputDate, time: inputTime });
  const sortedPastObs = appData.observations
    .filter(o => getObsDateTimeMs(o) < currentMs)
    .sort((a, b) => getObsDateTimeMs(a) - getObsDateTimeMs(b));
  
  const prevObs = sortedPastObs[sortedPastObs.length - 1];
  if (prevObs) {
    const diff = Math.round((currentMs - getObsDateTimeMs(prevObs)) / 60000);
    const pxWidth = Math.max(CONFIG.minColWidth, diff * CONFIG.pxPerMinute);
    el.dispTimeDelta.innerHTML = `Cách mốc trước (${prevObs.time}${prevObs.date ? ' ' + prevObs.date : ''}): <strong>${diff} phút (${pxWidth}px)</strong>`;
  } else {
    el.dispTimeDelta.innerHTML = `Mốc đầu tiên: <strong>60 phút (60px)</strong>`;
  }
}

function checkLiveWarnings() {
  if (!el.inputPulse) return;
  
  // Pulse
  const pulse = parseInt(el.inputPulse.value, 10);
  if (el.pulseWarning) {
    el.pulseWarning.textContent = (pulse && (pulse >= 100 || pulse < 60)) ? `⚠️ Cảnh báo: Mạch bất thường (${pulse} l/p)!` : '';
  }

  // BP
  let sys = el.inputBpSys ? parseInt(el.inputBpSys.value, 10) : 0;
  let dia = el.inputBpDia ? parseInt(el.inputBpDia.value, 10) : 0;
  if (el.inputBpCombined && el.inputBpCombined.value) {
    const parts = el.inputBpCombined.value.trim().split(/[\/\-\s,]+/);
    if (parts.length >= 2) {
      sys = parseInt(parts[0], 10) || 0;
      dia = parseInt(parts[1], 10) || 0;
    }
  }

  if (el.bpSysWarning) el.bpSysWarning.textContent = (sys >= 140) ? `⚠️ HA tâm thu cao (≥140 mmHg)` : '';
  if (el.bpDiaWarning) el.bpDiaWarning.textContent = (dia && (dia < 60 || dia >= 90)) ? `⚠️ HA tâm trương bất thường (<60 hoặc ≥90)` : '';

  // Temp
  if (el.inputTemp && el.tempWarning) {
    const temp = parseFloat(el.inputTemp.value);
    el.tempWarning.textContent = (temp && (temp >= 38.0 || temp < 36.0)) ? `⚠️ Thân nhiệt bất thường (${temp}°C)` : '';
  }
}

// ==============================================================
// 8. TREATMENT RECORDS HISTORY SELECTION MODAL
// ==============================================================

function openTreatmentRecordsModal() {
  if (el.searchTreatmentInput) el.searchTreatmentInput.value = '';
  renderTreatmentRecordsList(MOCK_TREATMENT_RECORDS);
  if (el.treatmentModal) el.treatmentModal.classList.add('show');
}

function closeTreatmentRecordsModal() {
  if (el.treatmentModal) el.treatmentModal.classList.remove('show');
}

function filterTreatmentRecords() {
  if (!el.searchTreatmentInput) return;
  const query = el.searchTreatmentInput.value.toLowerCase().trim();
  if (!query) {
    renderTreatmentRecordsList(MOCK_TREATMENT_RECORDS);
    return;
  }

  const filtered = MOCK_TREATMENT_RECORDS.filter(r => {
    return (
      (r.time && r.time.toLowerCase().includes(query)) ||
      (r.examiner && r.examiner.toLowerCase().includes(query)) ||
      (r.notes && r.notes.toLowerCase().includes(query)) ||
      (r.dilation && `${r.dilation}`.includes(query)) ||
      (r.drugs && r.drugs.toLowerCase().includes(query))
    );
  });

  renderTreatmentRecordsList(filtered);
}

function renderTreatmentRecordsList(records) {
  const container = el.treatmentRecordsList;
  if (!container) return;
  container.innerHTML = '';

  if (!records || records.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #64748b;">
        <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem; display:block;"></i>
        Không tìm thấy phiếu điều trị phù hợp.
      </div>
    `;
    return;
  }

  const frag = document.createDocumentFragment();

  records.forEach(rec => {
    const card = document.createElement('div');
    card.className = 'treatment-record-card';

    const cervixText = rec.dilation !== undefined ? `${rec.dilation} cm` : '--';
    const descentText = rec.descent !== undefined ? `${rec.descent}/5` : '--';
    const fhrText = rec.fhr ? `${rec.fhr} bpm` : '--';
    const cntText = rec.cntCount ? `${rec.cntCount} cơn/10p` : '--';
    const bpText = (rec.bpSys && rec.bpDia) ? `${rec.bpSys}/${rec.bpDia} mmHg` : '--';
    const pulseText = rec.pulse ? `${rec.pulse} l/p` : '--';
    const tempText = rec.temp ? `${rec.temp}°C` : '--';
    const oxyText = rec.oxytocin ? `${rec.oxytocin} ${rec.oxytocinUnit || 'giọt/p'}` : '--';

    card.innerHTML = `
      <div class="treatment-card-header">
        <div class="treatment-time-badge"><i class="fa-regular fa-clock"></i> ${rec.time} • ${rec.date || '22/09/2026'}</div>
        <div class="treatment-examiner-badge"><i class="fa-solid fa-user-doctor text-primary"></i> ${rec.examiner || 'Bác sĩ điều trị'}</div>
      </div>
      <div class="treatment-metrics-grid">
        <div class="treatment-metric-cell"><span>Mở CTC:</span> <strong class="text-success">${cervixText}</strong></div>
        <div class="treatment-metric-cell"><span>Độ lọt:</span> <strong class="text-warning">${descentText}</strong></div>
        <div class="treatment-metric-cell"><span>Tim thai:</span> <strong class="text-primary">${fhrText}</strong></div>
        <div class="treatment-metric-cell"><span>Cơn gò:</span> <strong>${cntText}</strong></div>
        <div class="treatment-metric-cell"><span>Nước ối:</span> <strong>${rec.liquor || '-'}</strong></div>
        <div class="treatment-metric-cell"><span>Chống khớp:</span> <strong>${rec.molding || '0'}</strong></div>
        <div class="treatment-metric-cell"><span>Mạch:</span> <strong>${pulseText}</strong></div>
        <div class="treatment-metric-cell"><span>Huyết áp:</span> <strong>${bpText}</strong></div>
        <div class="treatment-metric-cell"><span>Thân nhiệt:</span> <strong>${tempText}</strong></div>
        <div class="treatment-metric-cell"><span>Oxytocin:</span> <strong>${oxyText}</strong></div>
      </div>
      <div class="treatment-footer-actions">
        <div class="treatment-notes-preview" title="${rec.notes || rec.drugs || ''}">
          <i class="fa-solid fa-notes-medical"></i> ${rec.notes || rec.drugs || 'Không có ghi chú thêm'}
        </div>
        <button type="button" class="btn btn-sm btn-primary btn-select-treatment" data-id="${rec.id}">
          <i class="fa-solid fa-check"></i> Chọn nạp phiếu này
        </button>
      </div>
    `;

    const btnSelect = card.querySelector('.btn-select-treatment');
    if (btnSelect) {
      btnSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        applyTreatmentRecordToForm(rec);
      });
    }
    card.addEventListener('click', () => applyTreatmentRecordToForm(rec));
    frag.appendChild(card);
  });

  container.appendChild(frag);
}

function applyTreatmentRecordToForm(record) {
  if (!record) return;

  if (el.inputObsDate) el.inputObsDate.value = record.date ? formatDdmmyyyy(record.date) : getTodayDateStr();
  if (record.time && el.inputObsTime) el.inputObsTime.value = format24hTime(record.time);
  if (record.laborHour !== undefined && el.inputLaborHour) el.inputLaborHour.value = record.laborHour;
  if (record.examiner && el.inputNHSName) el.inputNHSName.value = record.examiner;

  if (record.dilation !== undefined && el.inputDilation) el.inputDilation.value = formatDilation(record.dilation);
  if (record.descent !== undefined && el.inputDescent) el.inputDescent.value = String(record.descent);
  if (record.liquor && el.inputLiquor) el.inputLiquor.value = record.liquor;
  if (record.molding !== undefined && el.inputMolding) el.inputMolding.value = record.molding;
  if (record.position && el.inputPosition) el.inputPosition.value = record.position;
  if (record.caput !== undefined && el.inputCaput) el.inputCaput.value = record.caput;
  if (record.asynclitism !== undefined && el.inputAsynclitism) el.inputAsynclitism.value = record.asynclitism;

  if (record.fhr && el.inputFHR) el.inputFHR.value = record.fhr;
  if (record.cntCount !== undefined && el.inputContractionCount) el.inputContractionCount.value = record.cntCount;
  if (record.cntDur && el.inputContractionDur) el.inputContractionDur.value = record.cntDur;

  if (record.oxytocin !== undefined && el.inputOxytocinVal) el.inputOxytocinVal.value = record.oxytocin;
  if (record.oxytocinUnit && el.inputOxytocinUnit) el.inputOxytocinUnit.value = record.oxytocinUnit;
  if (record.drugs !== undefined && el.inputDrugs) el.inputDrugs.value = record.drugs;

  if (record.pulse && el.inputPulse) el.inputPulse.value = record.pulse;
  if (el.inputBpCombined && record.bpSys && record.bpDia) {
    el.inputBpCombined.value = `${record.bpSys}/${record.bpDia}`;
  }
  if (record.bpSys && el.inputBpSys) el.inputBpSys.value = record.bpSys;
  if (record.bpDia && el.inputBpDia) el.inputBpDia.value = record.bpDia;
  if (record.temp && el.inputTemp) el.inputTemp.value = record.temp;

  if (record.urineProtein && el.inputUrineProtein) el.inputUrineProtein.value = record.urineProtein;
  if (record.urineAcetone && el.inputUrineAcetone) el.inputUrineAcetone.value = record.urineAcetone;
  if (record.urineVolume !== undefined && el.inputUrineVolume) el.inputUrineVolume.value = record.urineVolume;

  calculateTimeDeltaDisplay();
  checkLiveWarnings();
  closeTreatmentRecordsModal();
  showToast(`Đã nạp toàn bộ chỉ số từ phiếu khám lúc ${record.time}`, 'success');
}

// ==============================================================
// 9. UTILITY FUNCTIONS
// ==============================================================

function getPrecedingObservation() {
  const editId = el.editObsId ? el.editObsId.value : '';
  const currentObsDate = el.inputObsDate && el.inputObsDate.value ? el.inputObsDate.value : getTodayDateStr();
  const currentObsTime = el.inputObsTime && el.inputObsTime.value ? el.inputObsTime.value : getCurrentTimeStr();
  const currentMs = getObsDateTimeMs({ date: currentObsDate, time: currentObsTime });

  const others = appData.observations
    .filter(o => o.id !== editId)
    .sort((a, b) => getObsDateTimeMs(a) - getObsDateTimeMs(b));

  const earlier = others.filter(o => getObsDateTimeMs(o) < currentMs);
  if (earlier.length > 0) return earlier[earlier.length - 1];
  return others.length > 0 ? others[others.length - 1] : null;
}

function getTodayDateStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function getCurrentTimeStr() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function format24hTime(str) {
  if (!str) return '';
  const clean = String(str).trim();
  const digits = clean.replace(/[^\d]/g, '');
  if (digits.length === 4) {
    let h = Math.min(23, Math.max(0, parseInt(digits.substring(0, 2), 10) || 0));
    let m = Math.min(59, Math.max(0, parseInt(digits.substring(2, 4), 10) || 0));
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  } else if (clean.includes(':')) {
    const parts = clean.split(':');
    let h = Math.min(23, Math.max(0, parseInt(parts[0], 10) || 0));
    let m = Math.min(59, Math.max(0, parseInt(parts[1], 10) || 0));
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  } else if (digits.length > 0) {
    let h = Math.min(23, Math.max(0, parseInt(digits, 10) || 0));
    return `${String(h).padStart(2, '0')}:00`;
  }
  return str;
}

function formatDdmmyyyy(str) {
  if (!str) return '';
  const clean = String(str).trim();
  if (clean.includes('-') && !clean.includes('/')) {
    const parts = clean.split('-');
    if (parts.length === 3) return `${String(parts[2]).padStart(2, '0')}/${String(parts[1]).padStart(2, '0')}/${parts[0]}`;
  }
  const digits = clean.replace(/[^\d]/g, '');
  if (digits.length >= 8) {
    let d = parseInt(digits.substring(0, 2), 10) || 1;
    let m = parseInt(digits.substring(2, 4), 10) || 1;
    let y = parseInt(digits.substring(4, 8), 10) || 2026;
    m = Math.min(12, Math.max(1, m));
    y = Math.min(2099, Math.max(2026, y));
    const maxDays = new Date(y, m, 0).getDate();
    d = Math.min(maxDays, Math.max(1, d));
    return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
  } else if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length === 3) {
      let d = parseInt(parts[0], 10) || 1;
      let m = parseInt(parts[1], 10) || 1;
      let y = parseInt(parts[2], 10) || 2026;
      m = Math.min(12, Math.max(1, m));
      y = Math.min(2099, Math.max(2026, y));
      const maxDays = new Date(y, m, 0).getDate();
      d = Math.min(maxDays, Math.max(1, d));
      return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    }
  }
  return str;
}

function formatDilation(str) {
  if (str === '' || str === null || str === undefined) return '';
  const clean = String(str).trim();
  if (!clean) return '';

  let val = null;
  const digits = clean.replace(/[^\d]/g, '');
  if (clean.includes('.')) {
    val = parseFloat(clean);
  } else if (digits.length === 2) {
    val = (digits === '10') ? 10.0 : parseInt(digits[0], 10) + parseInt(digits[1], 10) / 10;
  } else if (digits.length === 3 && digits.startsWith('10')) {
    val = 10.5;
  } else {
    val = parseFloat(clean);
  }

  if (isNaN(val)) return '';
  val = Math.round(val * 2) / 2;
  return Math.min(10.5, Math.max(0.0, val)).toFixed(1);
}

function formatBp(str) {
  if (!str) return '';
  const clean = String(str).trim();
  if (!clean) return '';

  let sys = 0, dia = 0;
  const parts = clean.split(/[\/\-\s,]+/);
  if (parts.length >= 2) {
    sys = parseInt(parts[0], 10) || 0;
    dia = parseInt(parts[1], 10) || 0;
  } else {
    const digits = clean.replace(/[^\d]/g, '');
    if (digits.length === 5) {
      sys = parseInt(digits.substring(0, 3), 10) || 0;
      dia = parseInt(digits.substring(3, 5), 10) || 0;
    } else if (digits.length === 6) {
      sys = parseInt(digits.substring(0, 3), 10) || 0;
      dia = parseInt(digits.substring(3, 6), 10) || 0;
    } else if (digits.length >= 2 && digits.length <= 3) {
      sys = parseInt(digits, 10) || 0;
    }
  }

  sys = Math.min(250, Math.max(0, sys));
  dia = Math.min(250, Math.max(0, dia));
  if (dia > 0) return `${sys}/${dia}`;
  if (sys > 0) return `${sys}/`;
  return '';
}

function formatTemp(str) {
  if (str === '' || str === null || str === undefined) return '';
  const clean = String(str).trim();
  if (!clean) return '';

  let val = null;
  const digits = clean.replace(/[^\d]/g, '');
  if (clean.includes('.')) {
    val = parseFloat(clean);
  } else if (digits.length === 3) {
    val = parseInt(digits.substring(0, 2), 10) + parseInt(digits.substring(2, 3), 10) / 10;
  } else if (digits.length === 2) {
    val = parseInt(digits, 10);
  } else {
    val = parseFloat(clean);
  }

  if (isNaN(val)) return '';
  return Math.min(45.0, Math.max(34.0, val)).toFixed(1);
}

function formatOxytocin(str) {
  if (str === '' || str === null || str === undefined) return '';
  const clean = String(str).trim();
  if (!clean) return '';
  if (isNaN(parseFloat(clean))) return clean;

  let val = null;
  const digits = clean.replace(/[^\d]/g, '');
  if (clean.includes('.')) {
    val = parseFloat(clean);
  } else if (digits.length === 3) {
    val = parseInt(digits.substring(0, 2), 10) <= 20
      ? parseInt(digits.substring(0, 2), 10) + parseInt(digits.substring(2, 3), 10) / 10
      : parseInt(digits[0], 10) + parseInt(digits.substring(1, 3), 10) / 100;
  } else {
    val = parseFloat(clean);
  }

  if (isNaN(val)) return clean;
  return String(Math.min(20.0, Math.max(0, val)));
}

function showToast(msg, type = 'info') {
  if (!el.toastBox) return;
  const toast = document.createElement('div');
  toast.className = `app-toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> <span>${msg}</span>`;
  el.toastBox.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}
