import { prisma } from "./lib/prisma";

async function run() {
  const courts = await prisma.court.findMany();
  if (courts.length === 0) return console.log("No courts");

  console.log("Court found:", courts[0].id);
  // Just testing connection and finding a user
  const user = await prisma.user.findFirst();
  console.log("User:", user?.id);
}
run();
