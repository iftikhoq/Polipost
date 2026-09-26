import type { Metadata } from 'next';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Polipost - এআই রাজনৈতিক পোস্টার মেকার 🇧🇩',
  description:
    'বাংলাদেশের যেকোনো রাজনৈতিক ও সামাজিক দিবসের প্রফেশনাল পোস্টার তৈরি করুন নিমেষেই। নিখুঁত বাংলা ফন্ট, শীর্ষ নেতৃবৃন্দের ছবি ও প্রিন্ট-রেডি রেজোলিউশন।',
  keywords: [
    'Bangladeshi political poster',
    'AI poster maker',
    'বিজয় দিবস পোস্টার',
    'নির্বাচনী পোস্টার',
    'Polipost',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="min-h-screen flex flex-col bg-background text-text-primary">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
