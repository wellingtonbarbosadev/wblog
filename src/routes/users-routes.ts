import { Router } from "express";
import { UsersController } from "@/controllers/users-controller";

const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.get("/", usersController.index)
usersRoutes.get("/:userId", usersController.findById)
usersRoutes.post("/", usersController.create)

export { usersRoutes }