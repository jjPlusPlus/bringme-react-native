
const {getDefaultConfig} = require('metro-config');
const {resolver: defaultResolver} = getDefaultConfig.getDefaultValues();

module.exports = {
  // transformer: {
  //   assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  // },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {                              
    sourceExts: ['jsx', 'js', 'json', 'ts', 'tsx', 'cjs'],
  },
}

