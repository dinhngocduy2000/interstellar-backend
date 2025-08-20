import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "@nestjs/common";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    console.log(`No token provided`);
    return res.status(401).json({ message: "Unauthorized" });
  }
  const detatchedToken = token.split(" ")[1];
  try {
    const decoded = jwt.verify(detatchedToken, process.env.JWT_SECRET ?? "");
    req["user"] = decoded; // Attach decoded payload to request
    next();
  } catch (error) {
    console.log(`Error verifying token: ${error}`);
    throw new UnauthorizedException("Invalid or expired token");
  }
};
