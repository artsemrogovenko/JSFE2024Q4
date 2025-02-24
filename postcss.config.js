module.exports = {
  plugins: [
    require('postcss-discard-unused')(),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
