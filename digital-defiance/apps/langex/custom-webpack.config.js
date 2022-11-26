// custom-webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      util: false,
      url: false,
      crypto: false,
      'crypto-browserify': false,
      os: false,
      querystring: false,
    },
  },
  entry: { background: 'apps/langex/src/background.ts' },
  optimization: {
    runtimeChunk: false,
  },
};
