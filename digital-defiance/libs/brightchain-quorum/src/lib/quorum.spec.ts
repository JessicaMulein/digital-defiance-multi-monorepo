import QuorumMember from './member';
import BrightChainQuorum from './quorum';
import QuorumMemberType from './quorumMemberType';
describe('quorum', () => {
  it('should create a quorum', () => {
    const nodeOwner = QuorumMember.newMember(
      QuorumMemberType.System,
      'Node Owner',
      'owner@example.com'
    );
    const quorum = new BrightChainQuorum(nodeOwner, 'Test Quorum');
    expect(quorum).toBeTruthy();
    expect(quorum.name).toEqual('Test Quorum');
  });
});
