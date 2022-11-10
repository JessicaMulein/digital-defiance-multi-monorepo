// custom-webpack.config.js
module.exports = {
  entry: { background: 'apps/langex/src/background.ts' },
  optimization: {
    runtimeChunk: false,
  },
}
