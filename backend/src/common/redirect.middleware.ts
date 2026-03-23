import { Request, Response, NextFunction } from "express";

export function redirectMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.path === "/") {
    return res.redirect("/docs");
  }
  next();
}
