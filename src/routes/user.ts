import { celebrate, Segments } from "celebrate";
import express from "express";
import Joi from "joi";

import { knexRead, knexWrite } from "../database/knex";
import { USER } from "../models/interfaces";
import createLogger from "../plugins/createLogger";
import { genericValidator, publicAddressValidator, validateContactVerifier, validateContactVerifierId } from "../validations";

const router = express.Router();
const logger = createLogger("user.ts");

/**
 * Returns user details
 */
router.get("/", async (req, res) => {
  try {
    const { public_address } = req.body;
    const p1 = await knexRead(USER).where({ public_address });
    return res.json({ data: p1, success: true });
  } catch (error) {
    logger.error("unable to give out user details", error);
    return res.status(500).json({ error, success: false });
  }
});
/**
 * Creates a new user
 */
router.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      verifierId: validateContactVerifierId,
      verifier: validateContactVerifier,
      public_address: publicAddressValidator,
    }),
  }),
  async (req, res) => {
    try {
      const { verifier, verifierId, public_address } = req.body || {};
      const result = await knexWrite("user").where({ public_address });
      if (result.length === 0) {
        await knexWrite("user").insert({
          public_address,
          verifier: verifier || "",
          verifier_id: verifierId || "",
        });
        return res.status(201).json({ success: true });
      }
      logger.warn("Already exists");
      return res.status(409).json({ error: "user already exists", success: false });
    } catch (error) {
      logger.error("unable to insert user", error);
      return res.status(500).json({ error, success: false });
    }
  }
);

/**
 * Update the user info
 */
router.patch(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object({
      verifier_id: validateContactVerifierId,
      verifier: validateContactVerifier,
      public_address: publicAddressValidator,
      guardians: genericValidator,
      nominee: genericValidator,
      recovery_address: publicAddressValidator,
    }),
  }),
  async (req, res) => {
    try {
      const { public_address, verifierId, verifier, gaurdians, nominee, recovery_address } = req.body;
      const objectId = await knexWrite("user").where({ public_address });
      if (objectId.length > 0) {
        const updateObj = {
          public_address,
          verifierId,
          verifier,
          gaurdians,
          nominee,
          recovery_address,
        };
        await knexWrite("user").where({ public_address }).update(updateObj);
        return res.status(201).json({ success: true });
      }
      logger.warn("Invalid user");
      return res.status(403).json({ error: "user doesn't exist", success: false });
    } catch (error) {
      logger.error("unable to patch user", error);
      return res.status(500).json({ error, success: false });
    }
  }
);

/**
 * Delete the user
 */
router.delete("/", async (req, res) => {
  try {
    const { public_address } = req;
    await knexWrite("user").where({ public_address }).delete();
    return res.status(201).json({ success: true });
  } catch (error) {
    logger.error("unable to delete user", error);
    return res.status(500).json({ error, success: false });
  }
});

export default router;
