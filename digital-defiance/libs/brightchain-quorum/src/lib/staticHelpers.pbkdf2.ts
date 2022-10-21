// TODO: split
import StaticHelpers from './staticHelpers.checksum';
import { randomBytes, pbkdf2Sync } from 'crypto';
import { IPbkdf2Result, IPbkf2Config } from './interfaces';
import StaticHelpersKeyPair from './staticHelpers.keypair';

/**
 * @description Static helper functions for Brightchain Quorum. Encryption and other utilities.
 * - Uses secrets.js-34r7h fork of secrets.js for Shamir's Secret Sharing
 * - Uses elliptic for ECDSA
 * - Uses bip39 for BIP39 Mnemonic generation
 * - Uses crypto for AES encryption
 * - Uses crypto for RSA key generation, encryption/decryption
 */
export default abstract class StaticHelpersPbkdf2 {
  /**
   * Number of pbkdf2 iterations per second when hashing a password.
   */
  public static readonly Pbkdf2IterationsPerSecond: number = 1304000;

  /**
   * Generate an options object for pbkdf2
   * @param iterations
   * @returns
   */
  public static pbkdf2Config(iterations?: number): IPbkf2Config {
    // larger numbers mean better security, less
    const config = {
      // size of the generated hash
      hashBytes: StaticHelpersKeyPair.SymmetricKeyBytes,
      // larger salt means hashed passwords are more resistant to rainbow table, but
      // you get diminishing returns pretty fast
      saltBytes: 16,
      // more iterations means an attacker has to take longer to brute force an
      // individual password, so larger is better. however, larger also means longer
      // to hash the password. tune so that hashing the password takes about a
      // second
      iterations: iterations ?? StaticHelpersPbkdf2.Pbkdf2IterationsPerSecond, //old given value: 872791,
    };
    return config;
  }

  /**
   * Execute a timed run of PBKDF2 to determine the number of iterations per second we can accomplish.
   * @param iterations
   * @returns
   */
  public static timedPbkdf2Test(iterations?: number): number {
    const config = StaticHelpersPbkdf2.pbkdf2Config(iterations);
    const saltBytes = randomBytes(config.saltBytes);
    const start = Date.now();
    const hashBytes = pbkdf2Sync(
      'password', // doesn't matter
      saltBytes,
      iterations ?? config.iterations,
      config.hashBytes,
      'sha512'
    );
    const end = Date.now();
    return end - start;
  }

  /**
   * Return the closest number of pbkdf2 iterations that can be completed in 1 second
   */
  public static timePbkdf2Iterations(): number {
    const config = StaticHelpersPbkdf2.pbkdf2Config();
    let iterations = config.iterations;
    let iterationsPerSecond = 0;
    let done = false;
    const threshold = 25; // if we are within 25 msec of 1 second, we are done
    while (!done) {
      const duration = StaticHelpersPbkdf2.timedPbkdf2Test(iterations);
      if (duration < 1000 + threshold && duration > 1000 - threshold) {
        iterationsPerSecond = iterations;
        done = true;
        break;
      }
      // if we are too fast, try again with more iterations
      // if we are too slow, try again with fewer iterations
      // determine how many iterations to add or subtract to get to a second
      const iterationsPerMs = iterations / duration;
      const iterationsPerS = Math.floor(1000 * iterationsPerMs);
      iterations = iterationsPerS;
    }
    return iterationsPerSecond;
  }

  /**
   * Given a password, use pbkdf2 to generate an appropriately sized key for AES encryption
   * @param password
   * @param salt
   * @param iterations
   * @returns
   */
  public static deriveKeyFromPassword(
    password: string,
    salt?: Buffer,
    iterations?: number
  ): IPbkdf2Result {
    const config = StaticHelpersPbkdf2.pbkdf2Config(iterations);
    const saltBytes = salt ?? randomBytes(config.saltBytes);
    if (saltBytes.length !== config.saltBytes) {
      throw new Error('Salt length does not match expected length');
    }
    const hashBytes = pbkdf2Sync(
      password,
      saltBytes,
      config.iterations,
      config.hashBytes,
      'sha512'
    );
    if (hashBytes.length !== config.hashBytes) {
      throw new Error('Hash length does not match expected length');
    }
    return {
      salt: saltBytes,
      hash: hashBytes,
      iterations: config.iterations,
    };
  }
}
