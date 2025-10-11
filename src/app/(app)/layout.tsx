import { Navbar } from "@/components/layout/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}

