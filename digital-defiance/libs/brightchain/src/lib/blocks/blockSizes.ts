export const enum BlockSize {
  /// <summary>
  /// Invalid/indeterminate/unknown block size.
  /// </summary>
  Unknown = 0,

  /// <summary>
  /// Tiniest block size, best for keys. 128b.
  /// </summary>
  Nano = 128,

  /// <summary>
  /// Best for extremely small messages. 256b.
  /// </summary>
  Micro = 256,

  /// <summary>
  /// Message size, such as a small data blob, currently 512b.
  /// </summary>
  Message = 512,

  /// <summary>
  /// Tiny size, such as smaller messages and configs, currently 1K.
  /// </summary>
  Tiny = 1024,

  /// <summary>
  /// Small size, such as small data files up to a mb or so depending on desired block count, currently 4K.
  /// </summary>
  Small = 4096,

  /// <summary>
  /// Medium size, such as medium data files up to 5-100mb, currently 1M.
  /// </summary>
  Medium = 1048576,

  /// <summary>
  /// Large size, such as large data files over 4M up to many terabytes.
  /// </summary>
  Large = 1073741824,
}

export const blockSizes = [
  BlockSize.Unknown,
  BlockSize.Nano,
  BlockSize.Micro,
  BlockSize.Message,
  BlockSize.Tiny,
  BlockSize.Small,
  BlockSize.Medium,
  BlockSize.Large,
];

export const blockSizeLengths = [
  0, 128, 256, 512, 1024, 4096, 1048576, 1073741824,
];

export function lengthToBlockSize(length: number): BlockSize {
  const index = blockSizeLengths.indexOf(length);
  if (index < 0) {
    return BlockSize.Unknown;
  }
  return blockSizes[index];
}

export function blockSizeToLength(blockSize: BlockSize): number {
  const index = blockSizes.indexOf(blockSize);
  if (index < 0) {
    return 0;
  }
  return blockSizeLengths[index];
}

export function validateBlockSize(length: number): boolean {
  return blockSizeLengths.indexOf(length) >= 1; // ignore 0 = unknown
}

export default BlockSize;
