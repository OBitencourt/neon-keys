import { redirect, notFound } from "next/navigation";
import { getAdminAccess } from "@/src/lib/admin/acess";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isAdmin } = await getAdminAccess();

  if (!session) {
    redirect("/login?redirect=/admin/products");
  }

  if (!isAdmin) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-neon-white">
      {children}
    </main>
  );
}