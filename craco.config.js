const CracoLessPlugin = require('craco-less');

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
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#04472D',
              '@link-color': '#04472D',
              '@success-color': '#32C25E',
              '@warning-color': '#FA554D',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};