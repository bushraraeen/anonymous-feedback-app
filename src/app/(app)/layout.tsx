import Navbar from '@/components/Navbar';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> 
      <main className="flex-grow">
        {children}
      </main>
      {/* Aap yahan ek Footer bhi add kar sakti hain baad mein */}
    </div>
  );
}