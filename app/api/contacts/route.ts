import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  companyId: z.string().optional().nullable(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const team = await prisma.team.findFirst({
    where: { ownerId: session.user.id },
  });
  const contacts = await prisma.contact.findMany({
    where: { teamId: team?.id },
  });
  return NextResponse.json({ contacts });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const team = await prisma.team.findFirst({
    where: { ownerId: session.user.id },
  });
  const json = await req.json();
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const contact = await prisma.contact.create({
    data: {
      ...parsed.data,
      teamId: team!.id,
      ownerId: session.user.id,
    },
  });
  return NextResponse.json({ contact });
}
