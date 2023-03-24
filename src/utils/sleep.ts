/**
 * Pauses execution for a specific period of time {ms}
 *
 * @param {number} ms - how long to pause execution in miliseconds
 */
export const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};
