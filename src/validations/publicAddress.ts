import Joi from "joi";
import { isAddress } from "web3-utils";

// for account hash
export const publicAddressValidator = Joi.custom((value, helper) => {
  if (isAddress(value)) {
    return value;
  }
  return helper.message({ custom: "Not a valid public address" });
}).required();

// for pubkey  (optional for backward compatibility)
export const pubKeyValidator = Joi.string().min(66).max(68).hex();

export const genericValidator = Joi.string();
