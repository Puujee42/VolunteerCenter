// /app/sign-up/education.ts

// --- 1. UNIVERSITIES (Их Дээд Сургуулиуд - UB & Countryside) ---
export const universities = [
  // --- ULAANBAATAR PUBLIC ---
  { id: "NUM", name: "Монгол Улсын Их Сургууль (МУИС)" },
  { id: "MUST", name: "Шинжлэх Ухаан Технологийн Их Сургууль (ШУТИС)" },
  { id: "MNUMS", name: "Анагаахын Шинжлэх Ухааны Үндэсний Их Сургууль (АШУҮИС)" },
  { id: "MSUE", name: "Монгол Улсын Боловсролын Их Сургууль (МУБИС)" },
  { id: "MULS", name: "Хөдөө Аж Ахуйн Их Сургууль (ХААИС)" },
  { id: "MSUAC", name: "Соёл Урлагийн Их Сургууль (СУИС)" },
  { id: "UFE", name: "Санхүү Эдийн Засгийн Их Сургууль (СЭЗИС)" },
  { id: "HSUA", name: "Дотоод Хэргийн Их Сургууль (ДХИС)" },
  { id: "NDU", name: "Үндэсний Батлан Хамгаалахын Их Сургууль (ҮБХИС)" },
  { id: "RLA", name: "Төмөр Замын Дээд Сургууль" },
  { id: "PC", name: "Монгол-Солонгосын Политехник Коллеж (МКПК)" },
  { id: "COMMERCE", name: "Худалдаа Үйлдвэрлэлийн Их Сургууль" },

  // --- COUNTRYSIDE PUBLIC (Орон нутгийн төрийн өмчит) ---
  { id: "KHOVD_UNI", name: "Ховд Их Сургууль (Ховд)" },
  { id: "DORNOD_UNI", name: "Дорнод Их Сургууль (Чойбалсан)" },
  { id: "MUST_DARKHAN", name: "ШУТИС - Дархан-Уул аймаг дахь Технологийн сургууль" },
  { id: "MUST_ERDENET", name: "ШУТИС - Эрдэнэт цогцолбор дээд сургууль" },
  { id: "MUST_UVURKHANGAI", name: "ШУТИС - Өвөрхангай салбар сургууль" },
  { id: "MNUMS_DARKHAN", name: "АШУҮИС - Дархан-Уул аймаг дахь салбар сургууль" },
  { id: "MNUMS_GOBI", name: "АШУҮИС - Говь-Алтай аймаг дахь салбар сургууль" },
  { id: "MNUMS_DORNOGOVI", name: "АШУҮИС - Дорноговь аймаг дахь салбар сургууль" },
  { id: "MSUE_ARKHANGAI", name: "МУБИС - Архангай аймаг дахь Багшийн сургууль" },
  { id: "MULS_DARKHAN", name: "ХААИС - Дархан-Уул аймаг дахь салбар" },

  // --- PRIVATE & INTERNATIONAL (UB & Countryside) ---
  { id: "UHUM", name: "Хүмүүнлэгийн Ухааны Их Сургууль (ХУИС)" },
  { id: "ETUGEN", name: "Этүгэн Их Сургууль" },
  { id: "MANDAKH", name: "Мандах Их Сургууль (УБ/Дархан)" },
  { id: "OTGON", name: "Отгонтэнгэр Их Сургууль" },
  { id: "IZ", name: "Их Засаг Олон Улсын Их Сургууль" },
  { id: "UB_UNI", name: "Улаанбаатар Их Сургууль" },
  { id: "IUB", name: "Олон Улсын Улаанбаатар Их Сургууль" },
  { id: "MIU", name: "Монгол Олон Улсын Их Сургууль (MIU)" },
  { id: "GMIT", name: "Монгол-Германы хамтарсан ашигт малтмал, технологийн их сургууль (Налайх)" },
  { id: "SHIHI", name: "Шихихутуг Их Сургууль" },
  { id: "IDER", name: "Идэр Их Сургууль" },
  { id: "CITY", name: "Сити Их Сургууль" },
  { id: "GLOBAL", name: "Глобал Удирдагч Их Сургууль" },
  { id: "CHINGGIS", name: "Чингис Соосэ Их Сургууль" },
  { id: "MON_ALTIUS", name: "Мон-Алтиус Биеийн Тамирын Дээд Сургууль" },
  { id: "NATIONAL", name: "Үндэсний Их Сургууль" },
  { id: "ROYAL", name: "Роял Олон Улсын Их Сургууль" },
  { id: "ZASAGT", name: "Засагт Хан Дээд Сургууль" },
  { id: "MARGAD", name: "Маргад Дээд Сургууль (Эрдэнэт)" },
  { id: "ORKHON_UNI", name: "Орхон Их Сургууль (Эрдэнэт)" },
  { id: "DARKHAN_DEED", name: "Дархан Дээд Сургууль (Дархан)" },
  { id: "GURVAN_ERDENE", name: "Гурван-Эрдэнэ Багшийн Дээд Сургууль" },
  { id: "SOYOL", name: "Соёл Эрдэм Дээд Сургууль" },
  { id: "NEW_MED", name: "Шинэ Анагаах Ухаан Дээд Сургууль" },
  { id: "ACH", name: "Ач Анагаах Ухааны Их Сургууль" },
  { id: "OTOCH", name: "Оточ Манрамба Их Сургууль" },
];

// --- 2. HIGH SCHOOLS (ЕБС - UB & Countryside) ---

// A. Famous / Named Schools (UB)
const namedSchoolsUB = [
  // This is the updated entry
  { 
    id: "SHINE_MONGOL", 
    name: "Шинэ Монгол Сургууль",
    programs: ["Tomyo", "Olula Tomyo", "E-Start", "General (Ерөнхий)"] 
  },
  { id: "ORCHLON", name: "Орчлон Олон Улсын Сургууль" },
  { id: "HOBBY", name: "Хобби Сургууль" },
  { id: "SANT", name: "Сант Сургууль" },
  { id: "BRITISH", name: "Бритиш Сургууль (BSU)" },
  { id: "ISU", name: "Улаанбаатар Олон Улсын Дунд Сургууль (ISU)" },
  { id: "ASU", name: "Америк Сургууль (ASU)" },
  { id: "LOGARITHM", name: "Логарифм Сургууль" },
  { id: "OLONLOG", name: "Олонлог Сургууль" },
  { id: "NEST", name: "Нэст (Nest) Ахлах Сургууль" },
  { id: "EMPATHY_UB", name: "Улаанбаатар Эмпати Сургууль" },
  { id: "ELITE", name: "Элит Олон Улсын Сургууль" },
  { id: "RUSSIAN_3", name: "Орос-Монголын хамтарсан 3-р сургууль" },
  { id: "PLEKHANOV", name: "Плехановын нэрэмжит сургууль" },
  { id: "TOMUJAN", name: "Томүжин Алтернатив Сургууль" },
  { id: "SHINE_Ue", name: "Шинэ Үе Сургууль" },
  { id: "OYUNLAG", name: "Оюунлаг Сургууль" },
  { id: "TUGULDUR", name: "Төгөлдөр Сургууль" },
  { id: "SAKURA", name: "Сакура Сургууль" },
  { id: "GURUN", name: "Гүрэн Академи" },
  { id: "JET", name: "Жэт (JET) Сургууль" },
  { id: "MONGOL_GENIUS", name: "Монгол Жэниус Сургууль" },
  { id: "DART", name: "Дарт Олон Улсын Сургууль" },
  { id: "GOETHE", name: "Гёте Сургууль" },
];

// B. Famous / Named Schools (Countryside)
const namedSchoolsRural = [
  { id: "EMPATHY_DARKHAN", name: "Дархан Эмпати Сургууль" },
  { id: "EMPATHY_ERDENET", name: "Эрдэнэт Эмпати Сургууль" },
  { id: "EMPATHY_BAYANOLGII", name: "Баян-Өлгий Эмпати Сургууль" },
  { id: "LAB_1_ARKHANGAI", name: "Архангай Лаборатори 1-р сургууль" },
  { id: "LAB_1_UVURKHANGAI", name: "Өвөрхангай Мэргэд сургууль" },
  { id: "ERDENET_COMPLEX", name: "Эрдэнэт Цогцолбор Сургууль" },
  { id: "DARKHAN_OYUNI_IREEDUI", name: "Дархан Оюуны Ирээдүй Цогцолбор" },
];

// C. Generators

// 1. Generate UB Numbered Schools (1-165)
const ubNumberedSchools = Array.from({ length: 165 }, (_, i) => {
  const num = i + 1;
  return {
    id: `UB_EBS_${num}`,
    name: `Улаанбаатар ${num}-р сургууль`,
  };
});

// 2. Generate Aimag Schools (Aimag Name + Number)
const aimags = [
  "Архангай", "Баян-Өлгий", "Баянхонгор", "Булган", "Говь-Алтай", "Говьсүмбэр", 
  "Дархан-Уул", "Дорноговь", "Дорнод", "Дундговь", "Завхан", "Орхон", 
  "Өвөрхангай", "Өмнөговь", "Сүхбаатар", "Сэлэнгэ", "Төв", "Увс", "Ховд", 
  "Хөвсгөл", "Хэнтий"
];

const aimagSchools: { id: string; name: string }[] = [];

aimags.forEach(aimag => {
  const limit = (aimag === "Дархан-Уул" || aimag === "Орхон") ? 25 : 8;
  
  for (let i = 1; i <= limit; i++) {
    aimagSchools.push({
      id: `${aimag}_EBS_${i}`,
      name: `${aimag} ${i}-р сургууль`
    });
  }
  aimagSchools.push({
    id: `${aimag}_SOUM`,
    name: `${aimag} - Сумын сургууль (Бусад)`
  });
});

// --- COMBINE ALL HIGH SCHOOLS ---
export const highSchools = [
  ...namedSchoolsUB,
  ...namedSchoolsRural,
  ...ubNumberedSchools,
  ...aimagSchools,
  { id: "VTPC", name: "МСҮТ / Политехник Коллеж" },
  { id: "OTHER", name: "Бусад / Жагсаалтад байхгүй" }
];

// --- FINAL EXPORT FOR GROUPED OPTIONS ---
export const allEducationInstitutions = [
  { label: "Их Дээд Сургуулиуд", options: universities },
  { label: "Ерөнхий Боловсролын Сургуулиуд", options: highSchools }
];