/**
 *  Sleep for a given amount of time
 * @param ms  - time in milliseconds
 * @returns - Promise
 */
export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
