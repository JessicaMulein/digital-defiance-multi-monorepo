import exp = require('constants');
import { randomUUID } from 'crypto';
import QuorumMember from './member';
import QuorumMemberType from './quorumMemberType';
import StaticHelpers from './staticHelpers';
import StaticHelpersKeyPair from './staticHelpers.keypair';
describe('brightchainQuorum', () => {
  it('should sign and verify a message for a member', () => {
    const member = QuorumMember.newMember(
      QuorumMemberType.User,
      'Bob Smith',
      'bob@example.com'
    );
    const message = Buffer.from('hello world');
    const signature = member.sign(message);
    const verified = member.verify(signature, message);
    expect(verified).toBeTruthy();
    expect(member.verify(signature, Buffer.from('hello worldx'))).toBeFalsy();
  });
  it('should fail to create with an invalid id', () => {
    expect(
      () =>
        new QuorumMember(
          QuorumMemberType.User,
          'alice',
          'alice@example.com',
          undefined,
          undefined,
          'xxx'
        )
    ).toThrowError('Invalid quorum member ID');
  });
  it('should fail to create a user with no name', () => {
    expect(() =>
      QuorumMember.newMember(QuorumMemberType.User, '', 'alice@example.com')
    ).toThrowError('Quorum member name missing');
  });
  it('should fail to create a user with whitespace at the start or end of their name', () => {
    expect(() =>
      QuorumMember.newMember(
        QuorumMemberType.User,
        'alice ',
        'alice@example.com'
      )
    ).toThrowError('Quorum member name has leading or trailing spaces');
    expect(() =>
      QuorumMember.newMember(
        QuorumMemberType.User,
        ' alice',
        'alice@example.com'
      )
    ).toThrowError('Quorum member name has leading or trailing spaces');
  });
  it('should fail to create a user with no email', () => {
    expect(() =>
      QuorumMember.newMember(QuorumMemberType.User, 'alice', '')
    ).toThrowError('Quorum member email missing');
  });
  it('should fail to create a user with an email that has whitespace at the start or end', () => {
    expect(() =>
      QuorumMember.newMember(
        QuorumMemberType.User,
        'alice',
        ' alice@example.com'
      )
    ).toThrowError('Quorum member email has leading or trailing spaces');
    expect(() =>
      QuorumMember.newMember(
        QuorumMemberType.User,
        'alice',
        'alice@example.com '
      )
    ).toThrowError('Quorum member email has leading or trailing spaces');
  });
  it('should check whether a user has a data key pair', () => {
    const member = QuorumMember.newMember(
      QuorumMemberType.User,
      'Bob Smith',
      'bob@example.com'
    );
    expect(member.hasDataPrivateKey).toEqual(true);
    expect(member.hasDataKeyPair).toEqual(true);
    const noKeyMember = new QuorumMember(
      QuorumMemberType.User,
      'Charlie Smith',
      'charlie@example.com'
    );
    expect(noKeyMember.hasDataKeyPair).toEqual(false);
    expect(noKeyMember.hasDataPrivateKey).toEqual(false);
  });
  it('should check whether a user has a signing key pair', () => {
    const member = QuorumMember.newMember(
      QuorumMemberType.User,
      'Alice Smith',
      'alice@example.com'
    );
    expect(member.hasSigningKeyPair).toEqual(true);
    expect(member.hasSigningPrivateKey).toEqual(true);
    const noKeyMember = new QuorumMember(
      QuorumMemberType.User,
      'Bob Smith',
      'bob@example.com'
    );
    expect(noKeyMember.hasSigningKeyPair).toEqual(false);
    expect(noKeyMember.hasSigningPrivateKey).toEqual(false);
  });
  it('should throw with an invalid signing key', () => {
    const newId = randomUUID();
    const keyPair = StaticHelpersKeyPair.generateMemberKeyPairs(newId);
    expect(() => {
      new QuorumMember(
        QuorumMemberType.User,
        'alice',
        'alice@example.com',
        {
          publicKey: keyPair.signing.publicKey,
          privateKey: Buffer.from([]),
        },
        {
          publicKey: keyPair.data.publicKey,
          privateKey: keyPair.data.privateKey,
        }
      )
    }).toThrowError('Invalid key pair');
  });
  it('should throw with an invalid data key', () => {
    const newId = randomUUID();
    const keyPair = StaticHelpersKeyPair.generateMemberKeyPairs(newId);
    expect(() => {
      new QuorumMember(
        QuorumMemberType.User,
        'alice',
        'alice@example.com',
        {
          publicKey: keyPair.signing.publicKey,
          privateKey: keyPair.signing.privateKey,
        },
        {
          publicKey: keyPair.data.publicKey,
          privateKey: Buffer.from([]),
        }
      )
      }).toThrowError('Invalid key pair');
  });
});
