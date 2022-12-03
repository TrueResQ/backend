import { create as createRandomSeed } from "random-seed";

/**
 * Returns a random number
 */
const generateRandomNumber = (): number => {
  const randomGenerator = createRandomSeed();
  return randomGenerator(2 ** 50);
};

export default generateRandomNumber;
