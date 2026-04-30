import { DeliveriesController } from "@/controllers/deliveries-controller";
import { DeliveriesLogsController } from "@/controllers/deliveries-logs-controller";
import { DeliveriesStatusController } from "@/controllers/deliveries-status-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { Router } from "express";

const deliveriesRouter = Router();
const deliveriesController = new DeliveriesController();
const deliveriesStatusController = new DeliveriesStatusController();
const deliveriesLogsController = new DeliveriesLogsController();

deliveriesRouter.use(ensureAuthenticated, verifyUserAuthorization(["sale"]));
deliveriesRouter.get("/", deliveriesController.index);
deliveriesRouter.post("/", deliveriesController.create);

// Status
deliveriesRouter.patch("/:id/status", deliveriesStatusController.update);

// Logs
deliveriesRouter.get("/:id/log", deliveriesLogsController.index);
deliveriesRouter.post("/:id/log", deliveriesLogsController.create);

export { deliveriesRouter };
