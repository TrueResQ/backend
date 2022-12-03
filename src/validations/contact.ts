import Joi from "joi";

import { DISCORD, ENS, ETH, GITHUB, GOOGLE, REDDIT, TWITTER, UNSTOPPABLE_DOMAINS } from "../helpers/constants";

export const validateContactVerifier = Joi.string()
  .max(255, "utf-8")
  .allow(GOOGLE, REDDIT, DISCORD, ETH, TWITTER, GITHUB, ENS, UNSTOPPABLE_DOMAINS)
  .required();
export const validateContactVerifierId = Joi.string().max(255, "utf-8").required();
