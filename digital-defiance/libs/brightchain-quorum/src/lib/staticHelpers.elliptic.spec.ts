import BN = require('bn.js');
import { ec } from 'elliptic';
import { Signature } from './signature';
import StaticHelpersElliptic from './staticHelpers.elliptic';
import StaticHelpersKeyPair from './staticHelpers.keypair';

describe('brightchain-quorum staticHelpers.elliptic', () => {
  it('should convert between EC classes', () => {
    const data = Buffer.from('hello world');
    const keyPair = StaticHelpersKeyPair.generateSigningKeyPair();
    const signature: ec.Signature = StaticHelpersKeyPair.signWithSigningKey(
      keyPair.keyPair,
      data
    );
    const ourSignature: Signature =
      StaticHelpersElliptic.ourECfromEC(signature);
    const theirSignature: ec.Signature =
      StaticHelpersElliptic.ECfromOurEC(ourSignature);
    expect(theirSignature.r.toString()).toBe(signature.r.toString());
    expect(theirSignature.s.toString()).toBe(signature.s.toString());
    expect(theirSignature.recoveryParam).toBe(signature.recoveryParam);
  });
  it('should test constructLength', () => {
    let arr = [0x02];
    const r: number[] = new BN(0x7f).toArray();
    const s: number[] = new BN(0x7f).toArray();
    StaticHelpersElliptic.constructLength(arr, r.length);
    arr = arr.concat(r);
    arr.push(0x02);
    StaticHelpersElliptic.constructLength(arr, s.length);
    const backHalf = arr.concat(s);
    let res = [0x30];
    StaticHelpersElliptic.constructLength(res, backHalf.length);
    res = res.concat(backHalf);
    expect(res).toEqual([0x30, 0x06, 0x02, 0x01, 0x7f, 0x02, 0x01, 0x7f]);
  });
});
