const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

if (!jwtPrivateKey) throw new Error("Invalid private key");

export default `-----BEGIN PRIVATE KEY-----\n${jwtPrivateKey}\n-----END PRIVATE KEY-----`;
