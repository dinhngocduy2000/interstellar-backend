import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtPayload } from "../common/interface/jwt-payload.js";
import { JwtService } from "@nestjs/jwt";

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
  // TODO: CHECK FOR USER ROLE LATER
  console.log("Token: ", token);
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ?? ""
    ) as JwtPayload;

    console.log("Decoded token: ", decoded);
    console.log("Date now: ", Date.now());
    if ((decoded?.exp ?? 0) < Date.now()) {
      throw new UnauthorizedException("Invalid or expired token");
    }
    req["user"] = decoded; // Attach decoded payload to request
    next();
  } catch (error) {
    console.log(`Error verifying token: ${error}`);
    throw new UnauthorizedException("Invalid or expired token");
  }
};

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies["accessToken"]; // Assuming the JWT is stored in a cookie named 'jwt'

    if (!token) {
      throw new UnauthorizedException("No JWT found in cookie");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET ?? "", // Replace with your JWT secret
      });
      request["user"] = payload; // Attach the decoded payload to the request
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid JWT");
    }
  }
}
