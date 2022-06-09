module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.js$/,
        loader: require.resolve('@open-wc/webpack-import-meta-loader'),
      });
      return webpackConfig;
    },
  },
  babel: {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins:  [
      ['@babel/plugin-proposal-class-properties', { 'loose': true }],
      ['@babel/plugin-proposal-private-methods', { 'loose': true }],
      '@babel/plugin-proposal-object-rest-spread',
    ]
  },
};