import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  let user = null;
  if (session) {
    user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { name: true }
    });
  }

  return (
    <>
      <Navbar session={session} user={user} />
      {children}
    </>
  );
}
