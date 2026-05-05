import { Router } from "express";

import { usersRoutes } from "./users-routes";
import { sessionsRouter } from "./sessions-routes";
import { deliveriesRouter } from "./deliveries-routes";
import { deliveriesLogsRouter } from "./deliveries-logs-routes";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRouter);
routes.use("/deliveries", deliveriesRouter);
routes.use("/delivery-logs", deliveriesLogsRouter);

export { routes };
