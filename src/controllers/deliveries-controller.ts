import { Request, Response, NextFunction } from "express";

class DeliveriesController {
  index(request: Request, response: Response, next: NextFunction) {
    return response.json()
  }
}

export { DeliveriesController }