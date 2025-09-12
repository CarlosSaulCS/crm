import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const companySchema = z.object({
  name: z.string().min(1),
  domain: z.string().optional().nullable(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const team = await prisma.team.findFirst({
    where: { ownerId: session.user.id },
  });
  const companies = await prisma.company.findMany({
    where: { teamId: team?.id },
  });
  return NextResponse.json({ companies });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const team = await prisma.team.findFirst({
    where: { ownerId: session.user.id },
  });
  const json = await req.json();
  const parsed = companySchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const company = await prisma.company.create({
    data: {
      ...parsed.data,
      teamId: team!.id,
      ownerId: session.user.id,
    },
  });
  return NextResponse.json({ company });
}
