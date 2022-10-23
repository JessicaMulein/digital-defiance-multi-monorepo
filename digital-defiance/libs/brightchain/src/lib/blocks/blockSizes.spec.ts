import BlockSize, {
  lengthToBlockSize,
  blockSizeToLength,
  validateBlockSize,
} from './blockSizes';
describe('blockSizes', () => {
  it('should be defined', () => {
    expect(BlockSize).toBeDefined();
  });
  it('should have the expected members', () => {
    // BlockSize is a regular enum without assigned values
    // object.keys on an enum gives the values and keys
    const blockSizeKeys = Object.keys(BlockSize);
    expect(blockSizeKeys.length).toBe(16);
    // expect the first half of the keys to be the numeric values of the enum, 0,1,2,3,4,5,6,7
    const firstHalf = blockSizeKeys.slice(0, blockSizeKeys.length / 2);
    expect(firstHalf).toEqual(['0', '1', '2', '3', '4', '5', '6', '7']);
    // expect the second half of the keys to be the string values of the enum, Unknown,Nano,Micro,Message,Tiny,Small,Medium,Large
    const secondHalf = blockSizeKeys.slice(blockSizeKeys.length / 2);
    expect(secondHalf).toEqual([
      'Unknown',
      'Nano',
      'Micro',
      'Message',
      'Tiny',
      'Small',
      'Medium',
      'Large',
    ]);
    expect(BlockSize.Unknown).toBe(0);
    expect(BlockSize.Nano).toBe(1);
    expect(BlockSize.Micro).toBe(2);
    expect(BlockSize.Message).toBe(3);
    expect(BlockSize.Tiny).toBe(4);
    expect(BlockSize.Small).toBe(5);
    expect(BlockSize.Medium).toBe(6);
    expect(BlockSize.Large).toBe(7);
  });
  it('should test blockSizeToLength', () => {
    expect(blockSizeToLength(BlockSize.Unknown)).toBe(0);
    expect(blockSizeToLength(BlockSize.Nano)).toBe(128);
    expect(blockSizeToLength(BlockSize.Micro)).toBe(256);
    expect(blockSizeToLength(BlockSize.Message)).toBe(512);
    expect(blockSizeToLength(BlockSize.Tiny)).toBe(1024);
    expect(blockSizeToLength(BlockSize.Small)).toBe(4096);
    expect(blockSizeToLength(BlockSize.Medium)).toBe(1048576);
    expect(blockSizeToLength(BlockSize.Large)).toBe(1073741824);
  });
  it('should test lengthToBlockSize', () => {
    expect(lengthToBlockSize(0)).toBe(BlockSize.Unknown);
    expect(lengthToBlockSize(128)).toBe(BlockSize.Nano);
    expect(lengthToBlockSize(256)).toBe(BlockSize.Micro);
    expect(lengthToBlockSize(512)).toBe(BlockSize.Message);
    expect(lengthToBlockSize(1024)).toBe(BlockSize.Tiny);
    expect(lengthToBlockSize(4096)).toBe(BlockSize.Small);
    expect(lengthToBlockSize(1048576)).toBe(BlockSize.Medium);
    expect(lengthToBlockSize(1073741824)).toBe(BlockSize.Large);
    //expect unexpected sizes to be unknown
    expect(lengthToBlockSize(1)).toBe(BlockSize.Unknown);
  });
  it('should test validateBlockSize', () => {
    expect(validateBlockSize(0)).toBe(true);
    expect(validateBlockSize(128)).toBe(true);
    expect(validateBlockSize(256)).toBe(true);
    expect(validateBlockSize(512)).toBe(true);
    expect(validateBlockSize(1024)).toBe(true);
    expect(validateBlockSize(4096)).toBe(true);
    expect(validateBlockSize(1048576)).toBe(true);
    expect(validateBlockSize(1073741824)).toBe(true);
    //expect unexpected sizes to be false
    expect(validateBlockSize(1)).toBe(false);
  });
});
