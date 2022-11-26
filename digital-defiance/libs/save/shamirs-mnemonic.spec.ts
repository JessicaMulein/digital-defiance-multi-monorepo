import ShamirsMnemonic from './shamirs-mnemonic';
import { wordlists } from 'bip39';
import * as secrets from 'secrets.js-34r7h';
import StaticHelpers from './staticHelpers';
import ShamirShareDetail from './shamir-share-detail';

describe("shamir's mnemonic", () => {
  it('should test some assumptions', () => {
    const wordCount = 24;
    const bitsPerWord = 11;
    const seedBits = wordCount * bitsPerWord;
    const randData = secrets.random(seedBits);
    const config = secrets.getConfig();
    const rngType = config.typeCSPRNG;
    const shareCount = wordCount / 4;

    // determine number of shares required for 11 bits with 4x compression

    secrets.init(StaticHelpers.requiredBitsForShareCount(shareCount), rngType);
    const shares = secrets.share(randData, shareCount, shareCount);
    const details = shares.map((share) => ShamirShareDetail.fromShare(share));
    // each share ends up being 384 bits
    /*
            ShamirShareDetail {
          share: '51a0d7c6943e39bef0bacb66dcd5d4271f36bb06cc8fd2f333d6ef68bf964e32e2ccf08efd046f4301312eca5452c599579c',
          bits: 5,
          id: 26,
          data: '0d7c6943e39bef0bacb66dcd5d4271f36bb06cc8fd2f333d6ef68bf964e32e2ccf08efd046f4301312eca5452c599579c'
        }
        */

    // compress the shares
    // const compressedShares = ShamirsMnemonic.compressShares(details, bitsPerWord*wordCount);
    // const decompressedShares = ShamirsMnemonic.decompressShares(compressedShares, shareCount);

    console.log(details);
    // console.log(compressedShares);
    // console.log(decompressedShares);
  });
  return;
  it('should generate a seed phrase', () => {
    const wordCount = 24;
    const mnemonicString = ShamirsMnemonic.GenerateMnemonicString(
      wordlists['english'],
      wordCount
    );
    expect(mnemonicString.phrase.split(' ').length).toEqual(wordCount);
    expect(mnemonicString.checkWord).toBeDefined();
    const checkWord = ShamirsMnemonic.GenerateCheckWord(
      mnemonicString.phrase,
      wordCount,
      wordlists['english']
    );
    expect(checkWord).toEqual(mnemonicString.checkWord);
    expect(
      ShamirsMnemonic.ValidateMnemonicString(
        mnemonicString.phrase,
        wordCount,
        wordlists['english']
      )
    ).toBeTruthy();
    expect(
      ShamirsMnemonic.ValidateMnemonicString(
        mnemonicString.phrase.concat(' ').concat(mnemonicString.checkWord),
        wordCount,
        wordlists['english']
      )
    ).toBeTruthy();
    expect(
      ShamirsMnemonic.ValidateMnemonicString(
        mnemonicString.phrase.concat(' ').concat('_invalid'),
        wordCount,
        wordlists['english']
      )
    ).toBeFalsy();
  });

  it('should generate a mnemonic and a checkword', () => {
    const wordCount = 24;
    const mnemonic = ShamirsMnemonic.GenerateMnemonicString(
      wordlists['english'],
      wordCount
    );
    expect(mnemonic).toBeTruthy();
    expect(mnemonic.phrase.split(' ').length).toEqual(wordCount);
    expect(mnemonic.checkWord).toBeTruthy();

    // validate actual check string
    const isValid = ShamirsMnemonic.ValidateMnemonicString(
      [mnemonic.phrase, mnemonic.checkWord].join(' '),
      wordCount,
      wordlists['english']
    );
    expect(isValid).toBeTruthy();
  });

  it('should detect an invalid check word', () => {
    const wordCount = 24;
    const mnemonic = ShamirsMnemonic.GenerateMnemonicString(
      wordlists['english'],
      wordCount
    );
    expect(mnemonic).toBeTruthy();
    expect(mnemonic.phrase.split(' ').length).toEqual(wordCount);
    expect(mnemonic.checkWord).toBeTruthy();

    // pick a word from the dictionary that isn't the check word
    const invalidCheckWord = wordlists['english'].find(
      (word) => word !== mnemonic.checkWord
    );
    expect(invalidCheckWord).toBeTruthy();

    // validate
    const isValid = ShamirsMnemonic.ValidateMnemonicString(
      [mnemonic.phrase, invalidCheckWord].join(' '),
      wordCount,
      wordlists['english']
    );
    expect(isValid).toBeFalsy();
  });

  it('should convert a mnemonic to a seed and back', () => {
    const wordCount = 24;
    const mnemonic = ShamirsMnemonic.GenerateMnemonicString(
      wordlists['english'],
      wordCount
    );
    expect(mnemonic).toBeTruthy();
    expect(mnemonic.phrase.split(' ').length).toEqual(wordCount);

    // convert to seed
    const seed = ShamirsMnemonic.MnemonicStringToSeed(
      mnemonic.phrase,
      wordCount,
      wordlists['english']
    );
    expect(seed).toBeTruthy();

    // convert to seed again repreatably
    const seed2 = ShamirsMnemonic.MnemonicStringToSeed(
      mnemonic.phrase,
      wordCount,
      wordlists['english']
    );
    expect(seed2).toBeTruthy();
    expect(seed2.toString('hex')).toEqual(seed.toString('hex'));

    // convert back to mnemonic reliably
    const mnemonic2 = ShamirsMnemonic.GenerateMnemonicString(
      wordlists['english'],
      wordCount,
      seed2
    );
    expect(mnemonic2).toBeTruthy();
    expect(mnemonic2.phrase.split(' ').length).toEqual(wordCount);
    expect(mnemonic2).toEqual(mnemonic.phrase);
  });

  it('should convert a mnemonic to a seed and back', () => {
    const wordCount = 24;
    const mnemonic = ShamirsMnemonic.GenerateMnemonicString(
      wordlists['english'],
      wordCount
    );
    expect(mnemonic).toBeTruthy();
    expect(mnemonic.phrase.split(' ').length).toEqual(wordCount);

    // convert to seed
    const seed = ShamirsMnemonic.MnemonicStringToSeed(
      mnemonic.phrase,
      wordCount,
      wordlists['english']
    );
    expect(seed).toBeTruthy();

    // convert back
    const mnemonic2 = ShamirsMnemonic.GenerateMnemonicString(
      wordlists['english'],
      wordCount,
      seed
    );
    expect(mnemonic2).toBeTruthy();
    expect(mnemonic2.phrase.split(' ').length).toEqual(wordCount);
    expect(mnemonic2).toEqual(mnemonic.phrase);
  });
});
