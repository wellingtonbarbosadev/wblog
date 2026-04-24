import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import { hash } from "bcrypt";
import z from "zod";
import { prisma } from "@/database/prisma";

class UsersController {
  async index(request: Request, response: Response, next: NextFunction) {

    const allUsers = await prisma.user.findMany()

    return response.json(allUsers)
  }

  async create(request: Request, response: Response, next: NextFunction) {

    const userSchema = z.object({
      name: z.string().trim().min(1),
      email: z.email(),
      password: z.string({
        error: (iss) => iss.input === undefined ? "password is required" : "invalid password"
      }).min(6)
    })

    const { name, email, password } = userSchema.parse(request.body)

    const userWithSameEmail = await prisma.user.findFirst({ where: { email } })
    if (userWithSameEmail) {
      throw new AppError("User with same email already exists.")
    }

    const hashedPassword = await hash(password, 8)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    const { password: _, ...userWithoutPassword } = user

    return response.status(200).json(userWithoutPassword)
  }
}

export { UsersController }