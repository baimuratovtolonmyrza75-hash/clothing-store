"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  clearSessionCookie,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";

export type AuthActionState = {
  error: string | null;
};

const authSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(50),
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const signInSchema = authSchema.pick({
  email: true,
  password: true,
});

async function createUserSession(userId: string, role: "CUSTOMER" | "ADMIN") {
  const token = await createSessionToken({ userId, role });
  await setSessionCookie(token);
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = authSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid sign-up data.",
    };
  }

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      error: "An account with this email already exists.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
    select: {
      id: true,
      role: true,
    },
  });

  await createUserSession(user.id, user.role);
  redirect("/account");
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid sign-in data.",
    };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user?.passwordHash) {
    return {
      error: "Incorrect email or password.",
    };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return {
      error: "Incorrect email or password.",
    };
  }

  await createUserSession(user.id, user.role);
  redirect("/account");
}

export async function signOutAction() {
  await clearSessionCookie();
  redirect("/");
}
