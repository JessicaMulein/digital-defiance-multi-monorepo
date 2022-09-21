import QuorumMember from './member';
import QuorumMemberType from './quorumMemberType';
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
});
