import { DeliveriesLogsController } from "@/controllers/deliveries-logs-controller";
import { Router } from "express";

import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const deliveriesLogsRouter = Router();
const deliveriesLogsController = new DeliveriesLogsController();

deliveriesLogsRouter.use(ensureAuthenticated);
deliveriesLogsRouter.get(
  "/:id",
  verifyUserAuthorization(["customer", "sale"]),
  deliveriesLogsController.index,
);

deliveriesLogsRouter.post(
  "/:id",
  verifyUserAuthorization(["sale"]),
  deliveriesLogsController.create,
);

export { deliveriesLogsRouter };
