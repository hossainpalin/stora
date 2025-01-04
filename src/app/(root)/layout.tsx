import { ReactNode } from "react";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import Header from "@/components/header";
import { getCurrentUser } from "@/actions/user.actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MainLayout({
  children
}: {
  children: ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/sign-in");

  return (
    <main className="flex h-full">
      <Sidebar
        avatar={currentUser.avatar}
        email={currentUser.email}
        name={currentUser.fullName}
      />

      <section className="flex h-full flex-1 flex-col">
        <MobileNav
          ownerId={currentUser.$id}
          accountId={currentUser.accountId}
          avatar={currentUser.avatar}
          email={currentUser.email}
          name={currentUser.fullName}
        />
        <Header ownerId={currentUser.$id} accountId={currentUser.accountId} />
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}
