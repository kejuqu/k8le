module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    'at-rule-no-unknown': 0,
    'scss/at-rule-no-unknown': [
      0,
      {
        ignoreAtRules: ['tailwind'],
      },
    ],
  },
};
