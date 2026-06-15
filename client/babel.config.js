module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      'react-native-reanimated/plugin',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};