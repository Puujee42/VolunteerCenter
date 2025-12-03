import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// ✅ Make sure this path is correct based on where you saved the file above
import SettingsManager from "./SettingsManager"; 

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="pt-24 px-8 min-h-screen bg-slate-100 ml-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">System Settings</h1>
        <p className="text-slate-500">Configure global application preferences.</p>
      </div>

      {/* This triggered the error because SettingsManager was likely an object, not a function */}
      <SettingsManager />
    </div>
  );
}