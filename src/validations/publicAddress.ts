import Joi from "joi";

function validateInputAddresses(address) {
  return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
}

// for account hash
export const publicAddressValidator = Joi.custom((value, helper) => {
  if (validateInputAddresses(value)) {
    return value;
  }
  return helper.message({ custom: "Not a valid public address" });
}).required();

// for pubkey  (optional for backward compatibility)
export const pubKeyValidator = Joi.string().min(66).max(68).hex();

export const genericValidator = Joi.string();
