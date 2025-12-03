import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar"; // Import the client component

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Security Check
  const user = await currentUser();
  if (!user || user.publicMetadata.role !== "admin") {
    redirect("/");
  }

  // 2. Prepare User Data for Sidebar
  const userData = {
    name: user.firstName || user.username || "Admin",
    imageUrl: user.imageUrl
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      
      {/* 3. Render Client Sidebar */}
      <AdminSidebar user={userData} />

      {/* 4. Render Page Content */}
      {/* ml-64 pushes content to the right so it isn't hidden behind the fixed sidebar */}
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {children}
      </div>
      
    </div>
  );
}