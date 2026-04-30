import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import z from "zod";

class DeliveriesLogsController {
  async index(request: Request, response: Response, next: NextFunction) {
    const paramSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramSchema.parse(request.params);

    const delivery = await prisma.delivery.findUnique({
      where: { id },
    });

    if (!delivery) {
      throw new AppError("delivery not found", 404);
    }

    if (
      request.user?.id !== delivery.userId &&
      request.user?.role === "customer"
    ) {
      throw new AppError("The user can only view their deliveries", 401);
    }

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

    const delivery = await prisma.delivery.findUnique({
      where: { id },
    });

    if (!delivery) {
      throw new AppError("delivery not found", 404);
    }

    if (delivery.status === "processing") {
      throw new AppError("change status to 'shipped'");
    } else if (delivery.status === "delivered") {
      throw new AppError("order already delivered");
    }

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
