import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { username, password, email } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [ 
        {
          username: username,
          email: email,
        },
      ],
    }
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "User or email already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  
  const newUser = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
      email: email
    },
  });

  return NextResponse.json(newUser, { status: 201 });
}
