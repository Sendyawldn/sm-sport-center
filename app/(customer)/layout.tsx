import Navbar from "@/components/Navbar";
import { getSession } from "@/lib/auth";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <>
      <Navbar session={session} />
      {children}
    </>
  );
}
