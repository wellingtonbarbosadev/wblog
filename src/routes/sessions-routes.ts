import { app } from "@/app";
import { SessionsController } from "@/controllers/sessions-controller";
import { Router } from "express";

const sessionsRouter = Router()
const sessionsController = new SessionsController()

sessionsRouter.get("/", sessionsController.index)
sessionsRouter.post("/", sessionsController.create)

export { sessionsRouter }