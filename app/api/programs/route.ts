
import { getPrograms } from "@/lib/mongo/data";
import { NextRequest, NextResponse } from "next/server";

const UI_TEXT = {
  mn: {
    heroTitle: "Бидний Хөтөлбөрүүд",
    heroSubtitle: "Нийгэмд эерэг өөрчлөлт авчрах бидний үндсэн чиглэлүүд.",
    stats: [
      { label: "Хамрагдсан хүүхэд", value: "15,000+" },
      { label: "Сургагч багш", value: "120+" },
      { label: "Хэрэгжсэн төсөл", value: "50+" },
    ],
    categories: {
      all: "Бүгд",
      education: "Боловсрол",
      volunteering: "Сайн дурын үйлс",
      protection: "Хамгаалал",
      environment: "Байгаль орчин",
    },
  },
  en: {
    heroTitle: "Our Programs",
    heroSubtitle: "Our core areas of focus to bring positive change to society.",
    stats: [
      { label: "Children Reached", value: "15,000+" },
      { label: "Expert Trainers", value: "120+" },
      { label: "Projects Executed", value: "50+" },
    ],
    categories: {
      all: "All",
      education: "Education",
      volunteering: "Volunteering",
      protection: "Protection",
      environment: "Environment",
    },
  },
};

export async function GET(request: NextRequest) {
  try {
    const locale = request.nextUrl.searchParams.get("locale") || "mn";
    
    if (locale !== "en" && locale !== "mn") {
      return NextResponse.json(
        { success: false, error: "Invalid locale specified. Use 'en' or 'mn'." },
        { status: 400 }
      );
    }

    // 1. Fetch raw programs from DB
    const programs = await getPrograms();

    // 2. Get the correct static UI text for the locale
    const pageStaticData = UI_TEXT[locale as 'mn' | 'en'];

    // 3. Construct the response
    const responseData = {
      ...pageStaticData, 
      programs: programs,
    };

    return NextResponse.json({ success: true, data: responseData });
  } catch (e: any) {
    console.error("Failed to fetch programs:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}