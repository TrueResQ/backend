import type { NextFunction, Request, Response } from "express";
import Joi from "joi";
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";

import jwtPrivateKey from "../helpers/keys";
import createLogger from "../plugins/createLogger";
import { publicAddressValidator } from "../validations";

const log = createLogger("authentication.ts");

const authSchema = Joi.object({
  public_address: publicAddressValidator,
});

async function auth(req: Request, res: Response, next: NextFunction): Promise<unknown> {
  try {
    const header = req.headers.authorization;
    if (header) {
      const bearer = header.split(" ");
      const token = bearer[1];
      if (token && token.split(".").length === 3) {
        const decoded = jwt.verify(token, jwtPrivateKey, { ignoreExpiration: false, algorithms: ["ES256"] }) as JwtPayload;
        req.public_address = decoded.public_address as string;
        const { error } = authSchema.validate(req, { allowUnknown: true });
        if (error) {
          log.warn("invalid inputs");
          return res.status(400).json({ error, success: false });
        }
        return next();
      }
    }
    return res.status(401).json({ error: "Missing or invalid authorization header", success: false });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired", success: false });
    }
    if (error instanceof JsonWebTokenError && error.message.includes("invalid algorithm")) {
      return res.status(401).json({ error: "Token expired", success: false });
    }
    log.error(error, "header: ", req.headers.authorization, req.originalUrl);
    return res.status(500).json({ error: "Failed to authenticate token", success: false });
  }
}

export default auth;
