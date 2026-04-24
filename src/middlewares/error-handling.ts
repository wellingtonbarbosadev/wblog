import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";

export function errorHandling(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    
  }
}