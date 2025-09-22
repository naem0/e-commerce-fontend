import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ConditionalNav } from "@/components/conditional-nav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function UserLayout({ children }) {
  const session = await getServerSession(authOptions);
  const user = session?.user || null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
      <ConditionalNav />
    </div>
  );
}
