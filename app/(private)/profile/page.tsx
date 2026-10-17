import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import ProfileContent from "@/src/components/profile/profileContent";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { name, email, image, createdAt } = session.user;

  const memberSince = new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <ProfileContent
      initialName={name}
      initialEmail={email}
      initialImage={image ?? null}
      memberSince={memberSince}
    />
  );
}