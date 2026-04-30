import { prisma } from "@/database/prisma";
import { Request, Response, NextFunction } from "express";
import z from "zod";

class DeliveriesLogsController {
  async index(request: Request, response: Response, next: NextFunction) {
    const paramSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramSchema.parse(request.params);

    const delivery_logs = await prisma.deliveryLog.findMany({
      where: { deliveryId: id },
    });

    return response.json(delivery_logs);
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const paramSchema = z.object({
      id: z.uuid(),
    });
    const bodySchema = z.object({
      description: z.string(),
    });

    const { id } = paramSchema.parse(request.params);
    const { description } = bodySchema.parse(request.body);

    const deliveryLog = await prisma.deliveryLog.create({
      data: {
        deliveryId: id,
        description,
      },
    });

    return response.status(201).json(deliveryLog);
  }
}

export { DeliveriesLogsController };
