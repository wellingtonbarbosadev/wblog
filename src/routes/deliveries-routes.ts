import { DeliveriesController } from "@/controllers/deliveries-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { Router } from "express";

const deliveriesRouter = Router()
const deliveriesController = new DeliveriesController()

deliveriesRouter.use(ensureAuthenticated)
deliveriesRouter.get("/", deliveriesController.index)
deliveriesRouter.post("/", deliveriesController.create)

export { deliveriesRouter }