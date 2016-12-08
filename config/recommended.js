module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    'browser': true
  },
  plugins: [
    'ember-bpr-lint'
  ],
  rules: {
    // Custom rules
    'ember-bpr-lint/no-side-effect-cp': 2,
    'ember-bpr-lint/no-attrs': 2,
    'ember-bpr-lint/no-observers': 2
  }
};
