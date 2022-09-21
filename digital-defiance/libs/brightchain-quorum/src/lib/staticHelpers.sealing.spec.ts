import QuorumMember from './member';
import QuorumMemberType from './quorumMemberType';
import StaticHelpers from './staticHelpers.checksum';
import StaticHelpersSealing from './staticHelpers.sealing';

describe('brightchainQuorum', () => {
  it('should seal and unlock a document', () => {
    const alice = QuorumMember.newMember(
      QuorumMemberType.User,
      'alice',
      'alice@example.com'
    );
    const bob = QuorumMember.newMember(
      QuorumMemberType.User,
      'bob',
      'bob@example.com'
    );
    const members: QuorumMember[] = [alice, bob];
    const document = { hello: 'world' };
    const sealedDocument = StaticHelpersSealing.quorumSeal<{ hello: string }>(
      alice,
      document,
      members.map((m) => m.id)
    );
    const unlockedDocument = StaticHelpersSealing.quorumUnlock<{ hello: string }>(
      sealedDocument.keyShares,
      sealedDocument.record.encryptedData
    );
    expect(unlockedDocument).toEqual(document);
  });
  it('should encrypt and decrypt the shares for the member list successfully', () => {
    const alice = QuorumMember.newMember(
      QuorumMemberType.User,
      'alice',
      'alice@example.com'
    );
    const bob = QuorumMember.newMember(
      QuorumMemberType.User,
      'bob',
      'bob@example.com'
    );
    const members: QuorumMember[] = [alice, bob];
    const document = { hello: 'world' };
    const sealedDocument = StaticHelpersSealing.quorumSeal<{ hello: string }>(
      alice,
      document,
      members.map((m) => m.id)
    );
    const encryptedShares = StaticHelpersSealing.encryptSharesForMembers(
      sealedDocument.keyShares,
      members
    );
    const decryptedShares = StaticHelpersSealing.decryptSharesForMembers(
      encryptedShares,
      members
    );
    expect(decryptedShares).toEqual(sealedDocument.keyShares);
  });
});
