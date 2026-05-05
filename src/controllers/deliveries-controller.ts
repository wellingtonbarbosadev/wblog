import { Request, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma";
import z from "zod";
import { AppError } from "@/utils/AppError";

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
        logs: {},
      },
    });

    return response.json(deliveries);
  }

  async show(request: Request, response: Response, next: NextFunction) {
    const paramSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramSchema.parse(request.params);

    const delivery = await prisma.delivery.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        logs: {},
      },
    });

    if (!delivery) {
      throw new AppError("delivery not found", 404);
    }

    return response.json(delivery);
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
