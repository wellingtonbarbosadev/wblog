import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import { hash } from "bcrypt";
import z from "zod";

class UsersController {
  index(request: Request, response: Response, next: NextFunction) {
    return response.json({ message: "OK" })
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

    const hashedPassword = await hash(password, 8)

    return response.status(200).json({ name, email, password, hashedPassword })
  }
}

export { UsersController }