import { DeliveriesController } from "@/controllers/deliveries-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Router } from "express";

const deliveriesRouter = Router()
const deliveriesController = new DeliveriesController()

deliveriesRouter.use(ensureAuthenticated, verifyUserAuthorization(["sale"]))
deliveriesRouter.get("/", deliveriesController.index)
deliveriesRouter.post("/", deliveriesController.create)

export { deliveriesRouter }