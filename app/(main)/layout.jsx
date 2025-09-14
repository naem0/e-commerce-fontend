import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
