import { isValidAddress } from "ethereumjs-util";
import Joi from "joi";

// for account hash
export const publicAddressValidator = Joi.custom((value, helper) => {
  if (isValidAddress(value)) {
    return value;
  }
  return helper.message({ custom: "Not a valid public address" });
}).required();

// for pubkey  (optional for backward compatibility)
export const pubKeyValidator = Joi.string().min(66).max(68).hex();

export const genericValidator = Joi.string();
