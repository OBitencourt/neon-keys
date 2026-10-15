import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import { ProfileSidebar } from "@/src/components/profile/profileSidebar";
import ProfileMobileNav from "@/src/components/profile/profileMobileNav";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-350 gap-8">
        <ProfileSidebar
          name={session.user.name}
          email={session.user.email}
          image={session.user.image ?? null}
        />

        <section className="min-w-0 flex-1">
          <ProfileMobileNav />
          {children}
        </section>
      </div>
    </main>
  );
}