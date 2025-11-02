// app/components/ClientLayout.tsx

"use client"; // This component is now the designated client boundary

import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    // All your client-side providers and components go here
    <LanguageProvider>
      <Navbar />
      <main className="pt-20"> {/* pt-20 likely offsets your fixed Navbar */}
        {children}
      </main>
    </LanguageProvider>
  );
}
