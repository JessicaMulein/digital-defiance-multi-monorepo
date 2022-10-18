// TODO: split
import * as secrets from 'secrets.js-34r7h';
import { Shares } from 'secrets.js-34r7h';
import QuorumDataRecord from './quorumDataRecord';
import QuorumMember from './member';
import {
  IQoroumSealResults,
  EncryptedShares,
} from './interfaces';
import StaticHelpers from './staticHelpers.checksum';
import StaticHelpersKeyPair from './staticHelpers.keypair';
import StaticHelpersSymmetric from './staticHelpers.symmetric';

/**
 * @description Static helper functions for Brightchain Quorum. Encryption and other utilities.
 * - Uses secrets.js-34r7h fork of secrets.js for Shamir's Secret Sharing
 * - Uses elliptic for ECDSA
 * - Uses bip39 for BIP39 Mnemonic generation
 * - Uses crypto for AES encryption
 * - Uses crypto for RSA key generation, encryption/decryption
 */
export default abstract class StaticHelpersSealing {
  /**
   * Reconfigure secrets.js to have the right number of bits for the number of shares needed
   * @param maxShares
   */
     public static reinitSecrets(maxShares: number) {
      // must have at least 3 bits, making the minimum max shares 2^3 = 8
      const bits = Math.max(3, Math.ceil(Math.log2(maxShares)));
  
      // secrets.init requires a CSPRNG type, get the current one
      const config = secrets.getConfig();
      secrets.init(bits, config.typeCSPRNG);
    }
  
  /**
   * Using shamir's secret sharing, split the given data into the given number of shares
   * @param data
   * @param amongstMemberIds
   * @param threshold
   * @returns
   */
  public static quorumSeal<T>(
    agent: QuorumMember,
    data: T,
    amongstMemberIds: string[],
    threshold?: number
  ): IQoroumSealResults {
    if (amongstMemberIds.length < 2) {
      throw new Error('At least two members are required');
    }
    const sharesRequired = threshold ?? amongstMemberIds.length;
    if (sharesRequired < 0) {
      throw new Error('Shares required must be greater than zero');
    }
    if (sharesRequired > amongstMemberIds.length) {
      throw new Error(
        'Shares required threshold cannot be greater than the number of members'
      );
    }
    if (sharesRequired < 2) {
      throw new Error('At least two shares/members are required');
    }

    const encryptedData = StaticHelpersSymmetric.symmetricEncrypt<T>(data);

    // TODO: consider computing the number of shares a user needs if you want to consider them "required"
    // eg if you normally would have say 3 shares and require 2 but require that one of the members is a specific one
    // alice: 1 share, bob (required): 3 shares, carol: 1 share = total 5 shares

    // split the key using shamir's secret sharing
    StaticHelpersSealing.reinitSecrets(amongstMemberIds.length);
    const keyShares = secrets.share(
      encryptedData.key.toString('hex'),
      amongstMemberIds.length,
      sharesRequired
    );

    const dataRecord = new QuorumDataRecord(
      agent,
      amongstMemberIds,
      [],
      sharesRequired,
      encryptedData.encryptedData
    );
    return {
      keyShares: keyShares,
      record: dataRecord,
    };
  }

  /**
   * Using shamir's secret sharing, recombine the given shares into the original data
   * @param recoveredShares
   * @param encryptedData
   * @returns
   */
  public static quorumUnlock<T>(
    recoveredShares: Shares,
    encryptedData: Buffer
  ): T {
    // reconstitute the document key from the shares
    StaticHelpersSealing.reinitSecrets(recoveredShares.length);
    const combined = secrets.combine(recoveredShares);
    const key = Buffer.from(combined, 'hex'); // hex?
    return StaticHelpersSymmetric.symmetricDecrypt<T>(encryptedData, key);
  }

  /**
   * Encrypt each key share with each member's public key
   * @param shares
   * @param members
   * @returns
   */
  public static encryptSharesForMembers(
    shares: Shares,
    members: QuorumMember[]
  ): EncryptedShares {
    const encryptedShares: EncryptedShares = new Array<string>(members.length);
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const keyShare = shares[i];
      const encryptedKeyShare = StaticHelpersSymmetric.seal<string>(
        keyShare,
        member.dataPublicKey
      );
      encryptedShares[i] =
      StaticHelpersSymmetric.ISealResultsToBuffer(encryptedKeyShare).toString('hex');
    }
    return encryptedShares;
  }

  /**
   * Decrypt each key share with each member's private key
   */
  public static decryptSharesForMembers(
    encryptedShares: EncryptedShares,
    members: QuorumMember[]
  ): Shares {
    const decryptedShares: Shares = new Array<string>(members.length);
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const encryptedKeyShareHex = encryptedShares[i];
      const decryptedPrivateKey =
        StaticHelpersKeyPair.recoverDataKeyFromSigningKey(member);
      const encryptedKeyShare = StaticHelpersSymmetric.BufferToISealResults(
        Buffer.from(encryptedKeyShareHex, 'hex')
      );
      const decryptedKeyShare = StaticHelpersSymmetric.unseal<string>(
        encryptedKeyShare,
        decryptedPrivateKey
      );
      decryptedShares[i] = decryptedKeyShare;
    }
    return decryptedShares;
  }
}
