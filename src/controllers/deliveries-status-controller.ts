import { prisma } from "@/database/prisma";
import { Request, Response, NextFunction } from "express";
import z from "zod";

class DeliveriesStatusController {
  async update(request: Request, response: Response, next: NextFunction) {
    const paramSchema = z.object({
      id: z.uuid(),
    });

    const bodySchema = z.object({
      status: z.enum(["processing", "shipped", "delivered"]),
    });

    const { id } = paramSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    const updatedDelivery = await prisma.delivery.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return response.json(updatedDelivery);
  }
}

export { DeliveriesStatusController };
