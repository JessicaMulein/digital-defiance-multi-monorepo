import Block from './block';

export enum BlockSize {
  /// <summary>
  /// Invalid/indeterminate/unknown block size.
  /// </summary>
  Unknown,

  /// <summary>
  /// Tiniest block size, best for keys. 128b.
  /// </summary>
  Nano,

  /// <summary>
  /// Best for extremely small messages. 256b.
  /// </summary>
  Micro,

  /// <summary>
  /// Message size, such as a small data blob, currently 512b.
  /// </summary>
  Message,

  /// <summary>
  /// Tiny size, such as smaller messages and configs, currently 1K.
  /// </summary>
  Tiny,

  /// <summary>
  /// Small size, such as small data files up to a mb or so depending on desired block count, currently 4K.
  /// </summary>
  Small,

  /// <summary>
  /// Medium size, such as medium data files up to 5-100mb, currently 1M.
  /// </summary>
  Medium,

  /// <summary>
  /// Large size, such as large data files over 4M up to many terabytes.
  /// </summary>
  Large,
}

export const blockSizeMap = new Map<BlockSize, number>([
  [BlockSize.Unknown, 0],
  [BlockSize.Nano, 128], // 128b
  [BlockSize.Micro, 256], // 256b
  [BlockSize.Message, 512], // 512b
  [BlockSize.Tiny, 1024], // 1Kb
  [BlockSize.Small, 4096], // 4K
  [BlockSize.Medium, 1048576], // 1M
  [BlockSize.Large, 1073741824],
]);

export const blockSizeMapInverse = new Map<number, BlockSize>([
  [0, BlockSize.Unknown],
  [128, BlockSize.Nano],
  [256, BlockSize.Micro],
  [512, BlockSize.Message],
  [1024, BlockSize.Tiny],
  [4096, BlockSize.Small],
  [1048576, BlockSize.Medium],
  [1073741824, BlockSize.Large],
]);

export function blockToBlockSize(block: Block): number {
  return lengthToBlockSize(block.data.length);
}

export function lengthToBlockSize(length: number): BlockSize {
  return blockSizeMapInverse.get(length) ?? BlockSize.Unknown;
}

export function blockSizeToLength(blockSize: BlockSize): number {
  return blockSizeMap.get(blockSize) ?? 0;
}

export function validateBlockSize(length: number): boolean {
  return blockSizeMapInverse.has(length);
}

export default BlockSize;
