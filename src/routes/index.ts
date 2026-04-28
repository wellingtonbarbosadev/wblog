import { Router } from "express";

import { usersRoutes } from "./users-routes";
import { sessionsRouter } from "./sessions-routes";
import { deliveriesRouter } from "./deliveries-routes";

const routes = Router()
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRouter)
routes.use("/deliveries", deliveriesRouter)

export { routes }