import Rand from 'rand-seed';

export default abstract class StaticHelpers {
  /**
   * Generates the given number of random values of the specified number of bits, with an optional seed.
   * @param n number of values
   * @param y bits per value
   * @param seed Random number generator seed
   * @returns
   */
  public static GenerateNValuesOfYBits(
    n: number,
    y: number,
    seed?: string
  ): bigint[] {
    const rand = new Rand(seed);
    const values: bigint[] = new Array<bigint>(n);
    const maxValue = BigInt(2) ** BigInt(y + 1) - BigInt(1);
    // 2^y - 1 = maxValue
    // 2^8 - 1 = 255
    // 2^11 - 1 = 2047
    for (let i = 0; i < n; i++) {
      values[i] = BigInt(Math.floor(rand.next() * Number(maxValue)));
    }
    return values;
  }
}
