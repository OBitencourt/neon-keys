import { ProfileSidebar} from "@/src/profile/profileSidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-black px-4 py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-350 gap-8">

        <ProfileSidebar />

        <section className="min-w-0 flex-1">
          {children}
        </section>

      </div>
    </main>
  );
}