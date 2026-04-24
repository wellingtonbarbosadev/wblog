import { Request, Response, NextFunction } from "express";

class UsersController {
  index(request: Request, response: Response, next: NextFunction) {
    return response.json({ message: "OK" })
  }
}

export { UsersController }