import { DeliveriesController } from "@/controllers/deliveries-controller";
import { DeliveriesStatusController } from "@/controllers/deliveries-status-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Router } from "express";

const deliveriesRouter = Router();
const deliveriesController = new DeliveriesController();
const deliveriesStatusController = new DeliveriesStatusController();

deliveriesRouter.use(ensureAuthenticated, verifyUserAuthorization(["sale"]));
deliveriesRouter.get("/", deliveriesController.index);
deliveriesRouter.post("/", deliveriesController.create);

// Status
deliveriesRouter.patch("/:id/status", deliveriesStatusController.update);

export { deliveriesRouter };
