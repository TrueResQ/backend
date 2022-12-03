import { celebrate, Segments } from "celebrate";
import express from "express"; // seconds
import Joi from "joi";
import jwt from "jsonwebtoken";

import redis from "../database/redis";
import { TORUS_REDIS_PREFIX } from "../helpers/constants";
import getError from "../helpers/getError";
import jwtPrivateKey from "../helpers/keys";
import { getAddressFromSignedMessage, getSignInMessage } from "../helpers/message";
import generateRandomNumber from "../helpers/random";
import createLogger from "../plugins/createLogger";
import { messageValidator, publicAddressValidator } from "../validations";

const router = express.Router();

const REDIS_TIMEOUT = 60;

const logger = createLogger("auth.ts");

router.post(
  "/message",
  celebrate({
    [Segments.BODY]: Joi.object({
      public_address: publicAddressValidator,
    }),
  }),
  async (req, res) => {
    try {
      const { public_address } = req.body;
      const randomNumber = generateRandomNumber();
      logger.info("randomNumber", randomNumber);
      const signInMessage = getSignInMessage(randomNumber);
      logger.info("signInMessage", signInMessage);
      const redisKey = `${TORUS_REDIS_PREFIX}:auth:${public_address.toLowerCase()}`;
      await redis.setEx(redisKey, REDIS_TIMEOUT, signInMessage);
      return res.status(201).json({ success: true, message: signInMessage });
    } catch (error) {
      logger.error("unable to insert/update message", error);
      return res.status(500).json({ error: getError(error), success: false });
    }
  }
);

router.post(
  "/verify",
  celebrate({
    [Segments.BODY]: Joi.object({
      public_address: publicAddressValidator,
      signed_message: messageValidator,
    }),
  }),
  async (req, res) => {
    try {
      const { signed_message, public_address } = req.body;
      const redisKey = `${TORUS_REDIS_PREFIX}:auth:${public_address.toLowerCase()}`;

      const value = await redis.get(redisKey);
      if (value) {
        const recoveredAddress = getAddressFromSignedMessage(value, signed_message);
        if (recoveredAddress.toLowerCase() === public_address.toLowerCase()) {
          // If the signature matches the owner supplied, create a
          // JSON web token for the owner that expires in 24 hours.
          const finalAddress = public_address;
          const token = jwt.sign({ public_address: finalAddress }, jwtPrivateKey, { expiresIn: "12h", algorithm: "ES256" });
          return res.status(200).json({ success: true, token });
        }
        return res.status(401).json({ error: "Signature did not match", success: false });
      }
      logger.warn("Invalid id");
      return res.status(403).json({ error: "get message first", success: false });
    } catch (error) {
      logger.error("unable to insert/update message", error);
      return res.status(500).json({ error: getError(error), success: false });
    }
  }
);

export default router;
