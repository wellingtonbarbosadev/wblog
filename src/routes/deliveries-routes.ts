import { DeliveriesController } from "@/controllers/deliveries-controller";
import { Router } from "express";

const deliveriesRouter = Router()
const deliveriesController = new DeliveriesController()

deliveriesRouter.get("/", deliveriesController.index)

export { deliveriesRouter }