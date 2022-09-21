import StaticHelpersElliptic from './staticHelpers.elliptic';
import StaticHelpersKeyPair from './staticHelpers.keypair';

describe('brightchainQuorum', () => {
  it('should sign and verify a message', () => {
    const keyPair = StaticHelpersKeyPair.generateSigningKeyPair();
    const message = Buffer.from('hello world', 'utf8');
    const signature = StaticHelpersKeyPair.signWithSigningKey(
      keyPair.keyPair,
      message
    );
    const verified = StaticHelpersKeyPair.verifyWithSigningKey(
      keyPair.keyPair,
      signature,
      message
    );
    expect(verified).toBeTruthy();
    expect(
      StaticHelpersKeyPair.verifyWithSigningKey(
        keyPair.keyPair,
        signature,
        Buffer.from('hello worldx', 'utf8')
      )
    ).toBeFalsy();
  });
  it('should sign and recover ec signature from hex der', () => {
    const keyPair = StaticHelpersKeyPair.generateSigningKeyPair();
    const message = Buffer.from('hello world', 'utf8');
    //    const signature = StaticHelpers.sign(message, keyPair.privateKey, StaticHelpers.Sha3DefaultHashBits);
    const signature = StaticHelpersKeyPair.signWithSigningKey(
      keyPair.keyPair,
      message
    );
    const testVerify = StaticHelpersElliptic.verifySignature(
      message,
      signature,
      keyPair.publicKey
    );
    expect(testVerify).toBeTruthy();
  });
});
