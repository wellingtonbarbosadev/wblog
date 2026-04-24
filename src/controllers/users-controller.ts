import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import z from "zod";

class UsersController {
  index(request: Request, response: Response, next: NextFunction) {
    return response.json({ message: "OK" })
  }

  create(request: Request, response: Response, next: NextFunction) {
    enum userRoles {
      CUSTOMER = "customer",
      SALE = "sale"
    }

    const userSchema = z.object({
      name: z.string(),
      email: z.email(),
      role: z.enum(userRoles),
      password: z.string({
        error: (iss) => iss.input === undefined ? "password is required" : "invalid password"
      }).min(6)
    })

    const result = userSchema.parse(request.body)

    return response.status(200).json({ result })
  }
}

export { UsersController }