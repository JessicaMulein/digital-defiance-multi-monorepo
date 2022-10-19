import { EncryptedShares, IMemberShareCount } from './interfaces';
import QuorumMember from './member';
import QuorumMemberType from './quorumMemberType';
import StaticHelpers from './staticHelpers.checksum';
import StaticHelpersSealing from './staticHelpers.sealing';

describe('brightchainQuorum', () => {
  it('should determine the correct number of shares when no additional information is given', () => {
    const memberIds = ['member1', 'member2', 'member3', 'member4'];
    const shareCountByMemberId = undefined;
    const sharesByMemberId =
      StaticHelpersSealing.determineShareCountsByMemberId(
        memberIds,
        shareCountByMemberId
      );
    expect(sharesByMemberId.size).toEqual(4);
    expect(sharesByMemberId.get('member1')).toEqual(1);
    expect(sharesByMemberId.get('member2')).toEqual(1);
    expect(sharesByMemberId.get('member3')).toEqual(1);
    expect(sharesByMemberId.get('member4')).toEqual(1);
  });
  it('should determine the correct number of shares when additional information is given', () => {
    const memberIds = ['member1', 'member2', 'member3', 'member4'];
    const shareCountByMemberId = undefined;
    const additionalInformation: Map<string, number> = new Map<
      string,
      number
    >();
    additionalInformation.set('member2', 2);
    additionalInformation.set('member3', 3);
    const sharesByMemberId =
      StaticHelpersSealing.determineShareCountsByMemberId(
        memberIds,
        shareCountByMemberId
      );
    expect(sharesByMemberId.size).toEqual(4);
    expect(sharesByMemberId.get('member1')).toEqual(1);
    expect(sharesByMemberId.get('member2')).toEqual(2);
    expect(sharesByMemberId.get('member3')).toEqual(3);
    expect(sharesByMemberId.get('member4')).toEqual(1);
  });
  it('should not lose information converting betweeen map and arrays', () => {
    const memberIds = ['member1', 'member2', 'member3', 'member4'];
    const additionalInformation: Array<IMemberShareCount> = [
      { memberId: 'member2', shares: 2 },
      { memberId: 'member3', shares: 3 },
    ];
    const sharesByMemberId =
      StaticHelpersSealing.determineShareCountsByMemberId(
        memberIds,
        additionalInformation
      );
    const sharesByMemberIdSortedArray =
      StaticHelpersSealing.shareCountsMapToSortedArrays(sharesByMemberId);
    const sharesByMemberIdMap = StaticHelpersSealing.shareCountsArrayToMap(
      sharesByMemberIdSortedArray.members,
      sharesByMemberIdSortedArray.shares
    );
    expect(sharesByMemberIdMap.size).toEqual(4);
    expect(sharesByMemberIdMap.get('member1')).toEqual(1);
    expect(sharesByMemberIdMap.get('member2')).toEqual(2);
    expect(sharesByMemberIdMap.get('member3')).toEqual(3);
    expect(sharesByMemberIdMap.get('member4')).toEqual(1);
    const entryFormatArray: Array<IMemberShareCount> =
      StaticHelpersSealing.shareCountsMapToCountEntries(sharesByMemberIdMap);
    expect(entryFormatArray.length).toEqual(4);
    expect(entryFormatArray[0].memberId).toEqual('member1');
    expect(entryFormatArray[0].shares).toEqual(1);
    expect(entryFormatArray[1].memberId).toEqual('member2');
    expect(entryFormatArray[1].shares).toEqual(2);
    expect(entryFormatArray[2].memberId).toEqual('member3');
    expect(entryFormatArray[2].shares).toEqual(3);
    expect(entryFormatArray[3].memberId).toEqual('member4');
    expect(entryFormatArray[3].shares).toEqual(1);
    const sharesByMemberIdSortedArray2 =
      StaticHelpersSealing.shareCountsArrayToSortedArrays(entryFormatArray);
    expect(sharesByMemberIdSortedArray2.members.length).toEqual(4);
    expect(sharesByMemberIdSortedArray2.members[0]).toEqual('member1');
    expect(sharesByMemberIdSortedArray2.members[1]).toEqual('member2');
    expect(sharesByMemberIdSortedArray2.members[2]).toEqual('member3');
    expect(sharesByMemberIdSortedArray2.members[3]).toEqual('member4');
    expect(sharesByMemberIdSortedArray2.shares.length).toEqual(4);
    expect(sharesByMemberIdSortedArray2.shares[0]).toEqual(1);
    expect(sharesByMemberIdSortedArray2.shares[1]).toEqual(2);
    expect(sharesByMemberIdSortedArray2.shares[2]).toEqual(3);
    expect(sharesByMemberIdSortedArray2.shares[3]).toEqual(1);
  });
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
    const unlockedDocument = StaticHelpersSealing.quorumUnlock<{
      hello: string;
    }>(sealedDocument.keyShares, sealedDocument.record.encryptedData);
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
      StaticHelpersSealing.combineEncryptedShares(encryptedShares),
      members
    );
    expect(decryptedShares).toEqual(sealedDocument.keyShares);
  });
});
