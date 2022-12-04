/* eslint-disable no-console */
import { celebrate, Segments } from "celebrate";
import { pbkdf2, randomUUID } from "crypto";
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
router.get("/:public_address", async (req, res) => {
  try {
    const p1 = await knexRead(USER).where({ public_address: req.params.public_address });
    return res.json({ data: p1, success: true });
  } catch (error) {
    logger.error("unable to give out user details", error);
    return res.status(500).json({ error, success: false });
  }
});

router.get("/:recovery_account", async (req, res) => {
  try {
    const p1 = await knexRead("recovery_address").where({ recovery_account: req.params.recovery_account });
    return res.json({ data: p1, success: true });
  } catch (error) {
    logger.error("unable to give out user details", error);
    return res.status(500).json({ error, success: false });
  }
});

router.get("/get_recovery_accounts/:public_address", async (req, res) => {
  try {
    const p1 = await knexRead("recovery_address").where({ executant_address: req.params.public_address });
    return res.json({ data: p1, success: true });
  } catch (error) {
    logger.error("unable to give out user details", error);
    return res.status(500).json({ error, success: false });
  }
});

router.get("/get_guardians/:public_address", async (req, res) => {
  try {
    const p1 = await knexRead("guardian").where({ executant_address: req.params.public_address });
    return res.json({ data: p1, success: true });
  } catch (error) {
    logger.error("unable to give out user details", error);
    return res.status(500).json({ error, success: false });
  }
});

router.get("/get_guardians_from_recovery_account/:public_address", async (req, res) => {
  try {
    const p1 = await knexRead("recovery_address").where({ recovery_address: req.params.public_address }).first();
    const p2 = await knexRead("guardian").where({ executant_address: p1.executant_address });

    return res.json({ data: p2, success: true });
  } catch (error) {
    logger.error("unable to give out user details", error);
    return res.status(500).json({ error, success: false });
  }
});

router.get("/get_executioners/:verifier_id", async (req, res) => {
  try {
    const p1 = await knexRead("guardian").where({ verifier_id: req.params.verifier_id });
    return res.json({ data: p1, success: true });
  } catch (error) {
    logger.error("unable to give out user details", error);
    return res.status(500).json({ error, success: false });
  }
});

router.get("/get_guardians/recovery_account/:public_address", async (req, res) => {
  try {
    const recovery_data = await knexRead("recovery_address").where({ recovery_address: req.params.public_address });
    if (recovery_data.length === 0) {
      return res.json({ error: "user doesn't exist", success: false });
    }
    const { executant_address } = recovery_data[0];
    const p1 = await knexRead("guardian").where({ executant_address });
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
      verifier_id: genericValidator,
      verifier: genericValidator,
      public_address: publicAddressValidator,
    }),
  }),
  async (req, res) => {
    try {
      const { public_address, verifier_id, verifier } = req.body || {};
      const result = await knexWrite("user").where({ public_address });
      if (result.length === 0) {
        await knexWrite("user").insert({
          public_address,
          verifier: verifier || "",
          verifier_id: verifier_id || "",
        });
        return res.status(201).json({ success: true });
      }
      return res.status(403).json({ error: "user already exists", success: false });
    } catch (error) {
      logger.error("unable to insert user", error);
      return res.status(500).json({ error, success: false });
    }
  }
);

router.post("/guardian_accepted", async (req, res) => {
  try {
    const { public_address, verifier_id, verifier, guardian_email, accepted } = req.body || {};
    await knexWrite("guardian").where({ guardian_email, executant_address: public_address, verifier_id, verifier }).update({
      accepted,
    });
    return res.status(201).json({ success: true });
  } catch (error) {
    logger.error("unable to insert user", error);
    return res.status(500).json({ error, success: false });
  }
});

router.post("/update_verifier_id", async (req, res) => {
  try {
    const { uuid, verifier_id } = req.body || {};
    await knexWrite("guardian").where({ uuid }).update({
      verifier_id,
    });
    return res.status(201).json({ success: true });
  } catch (error) {
    logger.error("unable to insert user", error);
    return res.status(500).json({ error, success: false });
  }
});

/**
 * Updates guardian_id and recovery_address_id
 */
router.post("/set_recovery", async (req, res) => {
  const { public_address, verifier_id, verifier, guardians, nominee, recovery_addresses } = req.body;
  try {
    const p1 = await knexRead(USER).where({ public_address });
    if (p1.length === 0) {
      return res.status(403).json({ error: "user doesn't exists", success: false });
    }
    await Promise.all(p1);

    if (recovery_addresses) {
      const recovery_addresses_array = recovery_addresses.split(",");
      const ra = [];
      recovery_addresses_array.forEach(async function (recovery_address) {
        ra.push({
          executant_address: public_address,
          verifier,
          verifier_id,
          recovery_address,
        });
      });
      await knexWrite("recovery_address").insert(ra);
    }
    console.log(guardians);
    if (guardians) {
      const guardians_array = guardians.split(",");
      const ga = [];
      guardians_array.forEach(async function (guardian) {
        let isNominee = "false";
        if (guardian === nominee) {
          isNominee = "true";
        }
        const uuid = randomUUID();

        ga.push({
          uuid,
          executant_address: public_address,
          verifier,
          verifier_id,
          guardian_email: guardian,
          is_nominee: isNominee,
        });
      });
      await knexWrite("guardian").insert(ga);
    }
  } catch (error) {
    logger.error("unable to insert user", error);
    return res.status(500).json({ error, success: false });
  }
  return res.status(201).json({ success: true });
});

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
