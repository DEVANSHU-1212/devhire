import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword, signToken } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = req.nextUrl.searchParams.get("action") || "login";

    if (action === "register") {
      const parsed = registerSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid input data", details: parsed.error.format() }, { status: 400 });
      }

      const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
      if (existing) {
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }

      const passwordHash = await hashPassword(parsed.data.password);
      const user = await db.user.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash,
          profile: {
            create: {
              targetRole: "Full Stack Developer",
              yearsOfExp: 1,
            },
          },
        },
        include: { profile: true },
      });

      const token = signToken({ userId: user.id, email: user.email, role: user.role });
      return NextResponse.json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      });
    } else {
      const parsed = loginSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid credentials format" }, { status: 400 });
      }

      const user = await db.user.findUnique({
        where: { email: parsed.data.email },
        include: { profile: true },
      });

      if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const token = signToken({ userId: user.id, email: user.email, role: user.role });
      return NextResponse.json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
