import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import z from "zod";

class UsersController {
  index(request: Request, response: Response, next: NextFunction) {
    return response.json({ message: "OK" })
  }

  create(request: Request, response: Response, next: NextFunction) {

    const userSchema = z.object({
      name: z.string().trim().min(1),
      email: z.email(),
      password: z.string({
        error: (iss) => iss.input === undefined ? "password is required" : "invalid password"
      }).min(6)
    })

    const { name, email, password } = userSchema.parse(request.body)

    return response.status(200).json({ name, email, password })
  }
}

export { UsersController }