import { NextFunction, Request, Response } from "express";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.time(`Request Time for: ${req.url} - ${req.method}`);
  console.log(`${req.method} ${req.url}`);
  console.timeEnd(`Request Time for: ${req.url} - ${req.method}`);
  next();
};
