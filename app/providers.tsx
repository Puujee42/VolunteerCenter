// app/providers.tsx
"use client";
import { LanguageProvider } from './context/LanguageContext';
// Import other providers if needed

export function Providers({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}