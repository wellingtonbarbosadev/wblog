import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { authConfig } from "@/configs/auth";
import z from "zod";

class SessionsController {
  async index(request: Request, response: Response, next: NextFunction) {
    return response.json();
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      email: z.email(),
      password: z.string().min(6),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user || !user.password) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Invalid email or password", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = jwt.sign({ role: user.role ?? "customer" }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.json({ token, user: userWithoutPassword });
  }

  update(request: Request, response: Response, next: NextFunction) {}

  delete(request: Request, response: Response, next: NextFunction) {}
}

export { SessionsController };
