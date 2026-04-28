import { Request, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma";
import z from "zod";

class DeliveriesController {
  async index(request: Request, response: Response, next: NextFunction) {
    const deliveries = await prisma.delivery.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return response.json(deliveries);
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      user_id: z.uuid(),
      description: z.string(),
    });

    const { user_id, description } = bodySchema.parse(request.body);

    await prisma.delivery.create({
      data: {
        userId: user_id,
        description,
      },
    });

    return response.status(201).json();
  }
}

export { DeliveriesController };
