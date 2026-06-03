// ── Shared Project Data ───────────────────────────────────────────────────────
// Used by both Portal.jsx (client view) and Admin.jsx (admin view).
// Admin changes are persisted to localStorage('emdad-admin-data').
// Portal reads localStorage first, falls back to DEFAULT_PROJECTS.

export const PHASE_COLORS = [
  "#185FA5",
  "#534AB7",
  "#B8903C",
  "#0F6E56",
  "#D85A30",
  "#3B6D11",
];
export const PHASE_BG = [
  "rgba(24,95,165,0.08)",
  "rgba(83,74,183,0.08)",
  "rgba(184,144,60,0.08)",
  "rgba(15,110,86,0.08)",
  "rgba(216,90,48,0.08)",
  "rgba(59,109,17,0.08)",
];
export const PHASE_ICONS = ["🎨", "✅", "🔨", "✨", "🚚", "🏠"];

export const STORAGE_KEY = "emdad-admin-data";

export const DEFAULT_PROJECTS = [
  {
    id: "EMD-2025-014",
    nameEn: "Villa Al-Rasheed — Master Bedroom & Dressing Suite",
    nameAr: "فيلا الراشد — جناح غرفة النوم الرئيسية وغرفة الملابس",
    typeEn: "Residential",
    typeAr: "سكني",
    phase: 2,
    progress: 58,
    managerEn: "Ahmad Khalil",
    managerAr: "أحمد خليل",
    managerPhone: "+962-779989944",
    clientNameEn: "Ibrahim Noaimi",
    clientNameAr: "إبراهيم نعيمي",
    clientEmail: "ibrahim@example.com",
    clientPin: "1234",
    startDate: "15 Sep 2025",
    deliveryDate: "10 Dec 2025",
    coverImg: "/images/master-bedrooms/BED5.jpg",
    clientPhone: "0799-000-001",
    items: [
      {
        nameEn: "Master Bedroom Set (King)",
        nameAr: "طقم غرفة نوم رئيسية (كينج)",
        qty: 1,
      },
      { nameEn: "Dressing Room System", nameAr: "نظام غرفة الملابس", qty: 1 },
      { nameEn: "Bedside Tables", nameAr: "طاولات جانبية", qty: 2 },
      { nameEn: "TV Unit", nameAr: "وحدة تلفزيون", qty: 1 },
    ],
    updates: [
      {
        date: "28 Oct 2025",
        phase: 2,
        textEn:
          "Walnut wood panels cut and prepared. Frame assembly begins tomorrow.",
        textAr: "تم قطع وتحضير ألواح خشب الجوز. يبدأ تجميع الهيكل غداً.",
      },
      {
        date: "22 Oct 2025",
        phase: 2,
        textEn:
          "Material confirmed: Premium Walnut with brushed gold hardware.",
        textAr: "تم تأكيد المواد: جوز فاخر مع أجهزة ذهبية مصقولة.",
      },
      {
        date: "08 Oct 2025",
        phase: 1,
        textEn: "Final 3D renders approved by client. Production order issued.",
        textAr: "تمت الموافقة على المخططات ثلاثية الأبعاد النهائية.",
      },
      {
        date: "25 Sep 2025",
        phase: 0,
        textEn:
          "Design concepts presented. Minor revisions to dressing room requested.",
        textAr: "تم تقديم مفاهيم التصميم. تم طلب تعديلات طفيفة.",
      },
      {
        date: "15 Sep 2025",
        phase: 0,
        textEn: "Project brief completed. Requirements documented and signed.",
        textAr: "تم إكمال ملخص المشروع. تم توثيق المتطلبات.",
      },
    ],
    docs: [
      {
        nameEn: "Project Contract",
        nameAr: "عقد المشروع",
        size: "2.4 MB",
        date: "15 Sep 2025",
      },
      {
        nameEn: "3D Renders — Bedroom",
        nameAr: "مخططات ثلاثية الأبعاد - غرفة النوم",
        size: "8.1 MB",
        date: "08 Oct 2025",
      },
      {
        nameEn: "3D Renders — Dressing Room",
        nameAr: "مخططات ثلاثية الأبعاد - غرفة الملابس",
        size: "6.7 MB",
        date: "08 Oct 2025",
      },
      {
        nameEn: "Material Specification Sheet",
        nameAr: "جدول مواصفات المواد",
        size: "1.2 MB",
        date: "22 Oct 2025",
      },
      {
        nameEn: "Deposit Invoice #INV-2025-014",
        nameAr: "فاتورة العربون #INV-2025-014",
        size: "0.3 MB",
        date: "15 Sep 2025",
      },
    ],
  },
  {
    id: "EMD-2025-007",
    nameEn: "Amman Tech Hub — Executive Office Suite",
    nameAr: "مركز عمّان للتكنولوجيا — جناح المكاتب التنفيذية",
    typeEn: "Commercial",
    typeAr: "تجاري",
    phase: 3,
    progress: 85,
    managerEn: "Sara Mansour",
    managerAr: "سارة منصور",
    managerPhone: "+962-779989944",
    clientNameEn: "Sana Adnan",
    clientNameAr: "سنا عدنان",
    clientEmail: "sana@example.com",
    clientPin: "5678",
    startDate: "01 Jul 2025",
    deliveryDate: "20 Nov 2025",
    coverImg: "/images/living-rooms/LIVING1.jpg",
    clientPhone: "0799-000-002",
    items: [
      {
        nameEn: "Executive Desk (CEO)",
        nameAr: "مكتب تنفيذي (المدير التنفيذي)",
        qty: 1,
      },
      {
        nameEn: "Conference Table (16-seat)",
        nameAr: "طاولة اجتماعات (16 مقعد)",
        qty: 1,
      },
      { nameEn: "Reception Counter", nameAr: "كاونتر الاستقبال", qty: 1 },
      {
        nameEn: "Office Storage Systems",
        nameAr: "أنظمة التخزين المكتبية",
        qty: 8,
      },
    ],
    updates: [
      {
        date: "30 Oct 2025",
        phase: 3,
        textEn:
          "High-gloss lacquer applied to all units. Final QC inspection tomorrow.",
        textAr: "تم تطبيق الطلاء اللامع. الفحص النهائي للجودة غداً.",
      },
      {
        date: "20 Oct 2025",
        phase: 3,
        textEn:
          "QC passed for all storage units. Moving to final lacquer stage.",
        textAr: "تم اجتياز ضبط الجودة. الانتقال للتشطيب النهائي.",
      },
      {
        date: "30 Sep 2025",
        phase: 2,
        textEn:
          "All 8 storage units and conference table production completed.",
        textAr: "تم الانتهاء من إنتاج جميع الوحدات وطاولة الاجتماعات.",
      },
    ],
    docs: [
      {
        nameEn: "Project Contract",
        nameAr: "عقد المشروع",
        size: "3.1 MB",
        date: "01 Jul 2025",
      },
      {
        nameEn: "Approved Floor Plan",
        nameAr: "مخطط الطابق المعتمد",
        size: "5.4 MB",
        date: "15 Jul 2025",
      },
      {
        nameEn: "Progress Invoice #INV-2025-007B",
        nameAr: "فاتورة مرحلية",
        size: "0.4 MB",
        date: "01 Sep 2025",
      },
    ],
  },
  {
    id: "EMD-2025-003",
    nameEn: "KASOTC — Training Center Furniture",
    nameAr: "كاسوتك — أثاث مركز التدريب",
    typeEn: "Government",
    typeAr: "حكومي",
    phase: 5,
    progress: 100,
    managerEn: "Khalid Al-Nimer",
    managerAr: "خالد النمر",
    managerPhone: "+962-779989944",
    clientNameEn: "Khalid Al-Nimer",
    clientNameAr: "خالد النمر",
    clientEmail: "khalid@example.com",
    clientPin: "4321",
    startDate: "01 Apr 2025",
    deliveryDate: "30 Aug 2025",
    coverImg: "/images/master-bedrooms/BED12.jpg",
    clientPhone: "0799-000-003",
    items: [
      { nameEn: "Conference Room Sets", nameAr: "أطقم غرف الاجتماعات", qty: 3 },
      {
        nameEn: "Office Workstations",
        nameAr: "محطات العمل المكتبية",
        qty: 24,
      },
      {
        nameEn: "Reception Area Furniture",
        nameAr: "أثاث منطقة الاستقبال",
        qty: 1,
      },
    ],
    updates: [
      {
        date: "30 Aug 2025",
        phase: 5,
        textEn:
          "Project fully installed and handed over. Completion certificate signed.",
        textAr: "تم تركيب المشروع بالكامل وتسليمه. تم توقيع شهادة الإنجاز.",
      },
      {
        date: "25 Aug 2025",
        phase: 4,
        textEn: "Delivery completed. Installation team on site.",
        textAr: "اكتمل التسليم. الفريق في الموقع.",
      },
    ],
    docs: [
      {
        nameEn: "Project Contract",
        nameAr: "عقد المشروع",
        size: "4.2 MB",
        date: "01 Apr 2025",
      },
      {
        nameEn: "Completion Certificate",
        nameAr: "شهادة الإنجاز",
        size: "0.8 MB",
        date: "30 Aug 2025",
      },
      {
        nameEn: "Final Invoice #INV-2025-003F",
        nameAr: "الفاتورة النهائية",
        size: "0.5 MB",
        date: "30 Aug 2025",
      },
      {
        nameEn: "2-Year Warranty Certificate",
        nameAr: "شهادة ضمان سنتين",
        size: "0.3 MB",
        date: "30 Aug 2025",
      },
    ],
  },
];

export function loadProjects() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_PROJECTS;
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export function saveProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch {
    return false;
  }
}
