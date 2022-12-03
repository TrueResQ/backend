import { bufferToHex, ecrecover, fromRpcSig, hashPersonalMessage, publicToAddress } from "ethereumjs-util";

/**
 * Returns a string with randomnumber
 */
export const getSignInMessage = (randomNumber: number) => `Torus Signin - ${randomNumber}`;

/**
 * Returns an eth address
 */
export const getAddressFromSignedMessage = (message: string, signed_message: string) => {
  const msgHash = hashPersonalMessage(Buffer.from(message, "utf8"));
  const sigParams = fromRpcSig(signed_message);
  const publicKey = ecrecover(msgHash, sigParams.v, sigParams.r, sigParams.s);
  const sender = publicToAddress(publicKey);
  return bufferToHex(sender);
};
