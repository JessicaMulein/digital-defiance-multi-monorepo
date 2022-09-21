import * as secrets from 'secrets.js-34r7h';
import { randomBytes } from 'crypto';
import ShamirShareDetail from './shamir-share-detail';
import StaticHelpers from './staticHelpers';

/**
 * Class to facilitate the generation of a mnemonic phrase and the conversion of a mnemonic phrase to a seed.
 * The mnemonic has a checksum builtin.
 * This is a non-standard approach.  The standard approach is to use the bip39 library directly. We are only
 * using the wordlists from that library.
 * It is based loosely on bip39, but with a few differences:
 * - shamir's secret sharing is used to split the seed into multiple shares (mnemonic phrases)
 * maybe/from mnemonic.ts:
 * - an additional checksum word is added to the end of the mnemonic phrase
 * - the checksum word is not part of the seed
 * - the checksum word is purely for validation purposes
 *
 * To generate a mnemonic phrase:
 * - determine the number of bits required to represent the highest index in the dictionary
 * - decide a word count (number of words in the phrase)
 * - determine the number of bits required to represent the word count
 * - generate a random number of the required number of bits (shamirs random function takes a number of bits)
 * - split the random number into the required number of words using shamirs secret sharing
 * - convert each numerical value to a word from the dictionary
 * - add the checksum word to the end of the phrase
 *
 * share vs seed:
 */
export default abstract class ShamirsMnemonic {
  private readonly words: Array<string> = [];
  private readonly checkWord: string;
  private readonly dictionaryWords: Array<string> = [];

  constructor(dictionaryWords: Array<string>, wordCount = 24) {
    this.dictionaryWords = dictionaryWords;
    const mnemonic = ShamirsMnemonic.GenerateMnemonicString(
      dictionaryWords,
      wordCount
    );
    this.words = mnemonic.phrase.split(' ');
    this.checkWord = mnemonic.checkWord;
  }

  /**
   * Generates series of bytes large enough to contain a mnemonic phrase of the specified word count, given the dictionary size
   * @param wordCount How many words in the phrase (not counting the checkWord)
   * @param wordlist The wordlist to use
   * @returns A buffer of bytes
   */
  public static GenerateSeed(wordCount = 24, wordlist: string[]): Buffer {
    const bitsPerWord = Math.ceil(Math.log2(wordlist.length));
    const requiredBits = wordCount * bitsPerWord;
    const requiredBytes = Math.ceil(requiredBits / 8);
    const seed = randomBytes(requiredBytes);
    return seed;
  }

  public static ReconstructSharesFromMnemonicString(
    phrase: string,
    wordCount: number,
    wordlist: string[]
  ): ShamirShareDetail[] {
    // split input words
    const words = phrase.split(' ');
    const wordBits = StaticHelpers.requiredBitsForShareCount(wordCount);
    // deconstruct shares
    const shareComponents: ShamirShareDetail[] = new Array(wordCount);
    // the check word is ignored
    for (let i = 0; i < wordCount; i++) {
      const wordIndexValue = ShamirsMnemonic.ReverseLookup(wordlist, words[i]);
      const shareString = ShamirShareDetail.generatePublicShareString(
        wordBits,
        i + 1,
        wordIndexValue.toString(16)
      );
      const shareComponent = ShamirShareDetail.fromShare(shareString);
      shareComponents[i] = shareComponent;
    }
    return shareComponents;
  }

  /**
   * Given a phrase and a wordlist, returns an array of the numerical values of each word in the phrase
   * @param phrase The phrase to convert
   * @param wordlist The dictionary to use
   * @returns An array of indices of the wordlist corresponding to the input phrase
   */
  public static PhraseToValues(phrase: string, wordlist: string[]): bigint[] {
    const words = phrase.split(' ');
    const wordValues: bigint[] = new Array<bigint>();
    for (const word of words) {
      const index = wordlist.indexOf(word);
      if (index === -1) {
        throw new Error('Invalid mnemonic word');
      }
      wordValues.push(BigInt(index));
    }
    return wordValues;
  }

  // public static ValuesToPhrase(
  //   values: bigint[],
  //   wordCount: number,
  //   wordlist: string[],
  //   checkWord = true
  // ): string {
  //   const words: string[] = new Array<string>(values.length);
  //   for (let i = 0; i < values.length; i++) {
  //     words[i] = wordlist[Number(values[i])];
  //   }
  //   const phrase = words.join(' ');
  //   return (
  //     phrase +
  //     (checkWord
  //       ? ' ' + this.GenerateCheckWord(phrase, wordCount, wordlist)
  //       : '')
  //   );
  // }

  public static GenerateCheckWord(
    phrase: string,
    wordCount: number,
    wordlist: string[]
  ): string {
    const wordValues = this.PhraseToValues(phrase, wordlist);
    const seedBigInt = BigInt(
      '0x' +
        ShamirsMnemonic.MnemonicStringToSeed(
          phrase,
          wordCount,
          wordlist
        ).toString('hex')
    );
    // assumes a filtered dictionary with no duplicates, whitespace, etc.
    const dictionarySize = wordlist.length;
    // number of bits needed to represent the highest index in the dictionary
    const bitsRequired = Math.ceil(Math.log2(dictionarySize));
    // create an array of the bit groupings
    const bitGroups: string[] = new Array<string>(wordCount);
    const groupValues: bigint[] = new Array(wordCount);

    // say we have 24 words, each word is 11 bits, so we have 264 bits
    // either xor all the words together, or add them together and use a modulo
    // why not do both
    let xorValue = BigInt(0);
    let addValue = BigInt(0);
    for (let i = 0; i < wordCount; i++) {
      const wordBits = wordValues[i].toString(2).padStart(bitsRequired, '0');
      bitGroups[i] = wordBits;
      groupValues[i] = BigInt('0b' + wordBits);
      xorValue ^= groupValues[i];
      addValue += groupValues[i];
    }
    const wordIndex = seedBigInt ^ xorValue ^ addValue % BigInt(dictionarySize);
    return wordlist[Number(wordIndex)];
  }

  public static ReverseLookup(wordlist: string[], word: string): number {
    return wordlist.indexOf(word);
  }
  private static reinitSecrets(wordCount: number) {
    ShamirsMnemonic.reinitSecretsByBits(
      StaticHelpers.requiredBitsForShareCount(wordCount)
    );
  }

  private static reinitSecretsByBits(bits: number) {
    // let secrets determine RNG
    secrets.setRNG();
    const config = secrets.getConfig();
    const rngToUse = config.typeCSPRNG;
    secrets.init(bits, rngToUse);
  }

  /**
   *
   * @param wordlist the dictionary to use
   * @param wordCount The desired number of words in the phrase (not counting the checkWord)
   * @param seed If a seed is provided, it will be used to generate the mnemonic phrase. If not, a random seed will be generated.
   * @returns
   */
  public static GenerateMnemonicString(
    wordlist: string[],
    wordCount = 24,
    seed?: Buffer
  ): { phrase: string; checkWord: string } {
    /**
     * An array of wordCount strings, each of which is a random word from the wordlist.
     */
    const shareWords: string[] = new Array<string>(wordCount);
    /**
     * An array containing the share details for each share word.
     */
    const shareComponents: ShamirShareDetail[] = new Array(wordCount);

    // create wordCount shares with a threshold of wordCount.
    // assumes a filtered dictionary with no duplicates, whitespace, etc.
    const dictionarySize = wordlist.length; // 2048

    // if the dictionary is 2048 words (the currently selected english dictionary is 2048 words),
    // we will need 11 bits to represent the index of each word (2^11 = 2048)
    // this is the number of bits needed to represent the highest index in the dictionary
    const bitsNeededPerDictionaryWord = Math.ceil(Math.log2(dictionarySize)); // 11
    this.reinitSecrets(wordCount);

    const totalBitsRequiredToRepresentWordCount =
      wordCount * bitsNeededPerDictionaryWord; // 11 * 24 = 264
    const totalBytesRequiredToRepresentWordCount = Math.ceil(
      totalBitsRequiredToRepresentWordCount / 8
    ); // 33
    // when we split the 33 bytes into 24 shares, we will end up with 1.72 bytes/share and need 2 bytes per share
    // so our actual share size will be 2 bytes * 24 = 48 bytes
    const bytesPerShare = Math.ceil(
      totalBytesRequiredToRepresentWordCount / wordCount
    ); // 2 bytes per share

    const totalBitsRequiredToRepresentWordCountAfterPadding =
      bytesPerShare * wordCount * 8; // 2 * 24 * 8 = 384

    // generate the random bytes needed to represent the wordCount
    // random function takes a number of bits, not bytes.
    const dataToShareInHexString = seed
      ? seed.toString('hex')
      : secrets.random(totalBitsRequiredToRepresentWordCountAfterPadding); // 384
    // expected length is totalBitsRequiredToRepresentWordCountAfterPadding / 8 (bits per byte) * 2 (hex) = 96
    if (
      dataToShareInHexString.length !==
      (totalBitsRequiredToRepresentWordCountAfterPadding / 8) * 2
    ) {
      throw new Error('Unexpected length of random data');
    }

    // the share function divides a `secret` number String str expressed in radix `inputRadix` (optional, default 16)
    // into `numShares` shares, each expressed in radix `outputRadix` (optional, default to `inputRadix`),
    // requiring `threshold` number of shares to reconstruct the secret.

    // For example for a default word count of 24 and a dictionary size of 2048, we will need 11 bits to represent each word.
    // We will need 24 * 11 = 264 bits to represent the 24 words.
    // We will need 264 / 8 = 33 bytes to represent the 24 words.
    // we will share the 33 bytes into 24 shares, and require 24 shares to reconstruct the secret.
    // the share function will return an array of 24 hex strings, each string representing a share.

    const shares = secrets.share(dataToShareInHexString, wordCount, wordCount);

    for (let i = 0; i < wordCount; i++) {
      shareComponents[i] = ShamirShareDetail.fromShare(shares[i]);
    }
    //const joinedDataHex = shareComponents.map((s) => s.data).join(''); // ends up being 3072 bytes
    // joinedDataHex is a string in hex so the length is 2x the number of actual bytes
    // joinedDataHex should now have a length of 3072. 3072/2=1536 bytes. 1536/24=64 bytes per share.
    // i'm not sure how the shamir math ends up making it 64 bytes.
    // const expectedBytesPerShare = Math.ceil(
    //   joinedDataHex.length / (2 * wordCount)
    // ); // 64
    // so now we will walk through the 24 shares and extract the 11 bits needed to represent each word.
    for (let i = 0; i < wordCount; i++) {
      const shareComponent: ShamirShareDetail = shareComponents[i];
      const dictionaryIndex = shareComponent.dictionaryIndex(wordlist);
      shareWords[i] = wordlist[dictionaryIndex];
    }
    const phrase = shareWords.join(' ');
    return {
      phrase: phrase,
      checkWord: ShamirsMnemonic.GenerateCheckWord(phrase, wordCount, wordlist),
    };
  }

  public static ValidateCheckWord(
    phrase: string,
    wordCount: number,
    wordlist: string[]
  ): boolean {
    // split input words
    const words = phrase.split(' ');
    const hasCheckWord = words.length == wordCount + 1;
    if (!hasCheckWord) {
      return false;
    }
    // set aside the check word
    const actualCheckWord = words.pop();
    // re-generate the check word
    const expectedCheckWordInfo = this.GenerateMnemonicString(
      wordlist,
      wordCount
    );
    return actualCheckWord === expectedCheckWordInfo.checkWord;
  }

  public static CombineShares(shareComponents: ShamirShareDetail[]): string {
    if (shareComponents.length < 1) {
      throw new Error('At least one share is required');
    }
    this.reinitSecretsByBits(shareComponents[0].bits);
    const shares = shareComponents.map((s) => s.share);
    const dataToShareInHexString = secrets.combine(shares);
    return dataToShareInHexString;
  }

  public static SharesToSeedBigInt(
    shareComponents: ShamirShareDetail[]
  ): bigint {
    return BigInt('0x' + this.SharesToSeedHex(shareComponents));
  }

  public static SharesToSeedHex(shareComponents: ShamirShareDetail[]): string {
    const shares = ShamirsMnemonic.CombineShares(shareComponents);
    if (shares === undefined) throw new Error('Unable to combine shares');
    return shares;
  }

  public static ValidateMnemonicString(
    phrase: string,
    wordCount: number,
    wordlist: string[]
  ): boolean {
    // make sure we can reconstruct a seed from the phrase
    const shareComponents = this.ReconstructSharesFromMnemonicString(
      phrase,
      wordCount,
      wordlist
    );
    try {
      const seed = this.SharesToSeedBigInt(shareComponents);
      return seed > 0;
    } catch (e) {
      return false;
    }
  }

  public static MnemonicStringToSeedHex(
    phrase: string,
    wordCount: number,
    wordlist: string[]
  ): string {
    const shareComponents = this.ReconstructSharesFromMnemonicString(
      phrase,
      wordCount,
      wordlist
    );
    return this.SharesToSeedHex(shareComponents);
  }

  public static MnemonicStringToSeed(
    phrase: string,
    wordCount: number,
    wordlist: string[]
  ): Buffer {
    return Buffer.from(
      ShamirsMnemonic.MnemonicStringToSeedHex(phrase, wordCount, wordlist),
      'hex'
    );
  }
}
